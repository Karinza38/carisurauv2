"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import { stateDistrict } from "../_lib/state-district-data";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { getS3PresignedUrl } from "@/lib/s3";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Surau / Masjid name must be at least 2 characters.",
  }),
  state: z.string().min(1, "Please select a state"),
  district: z.string().min(1, "Please select a district"),
  images: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one image"),
  gMapUrl: z.string().url().optional(),
  isLocatedInsideMall: z.boolean(),
  mallName: z.string().optional(),
  isQiblatCertified: z.boolean(),
  isPerformingJumaatPrayer: z.boolean(),
  directionDescription: z.string().optional(),
});

type ImagePreview = {
  file: File;
  preview: string;
};

export function AddSurauOrMasjidForm() {
  const [districts, setDistricts] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      state: "",
      district: "",
      images: [],
      gMapUrl: "",
      isLocatedInsideMall: false,
      mallName: "",
      isQiblatCertified: false,
      isPerformingJumaatPrayer: false,
      directionDescription: "",
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setImagePreviews((prev) => [...prev, ...newPreviews]);
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, ...acceptedFiles]);
      form.clearErrors("images");
    },
    [form]
  );

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    const currentImages = form.getValues("images");
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const handleStateChange = (selectedState: string) => {
    form.setValue("state", selectedState);
    form.setValue("district", "");
    setDistricts(
      stateDistrict[selectedState as keyof typeof stateDistrict] || []
    );
  };

  const formatFilename = (file: File) => {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

    return filename;
  };

  const uploadToS3 = async (file: File) => {
    const uploadUrl = await getS3PresignedUrl(formatFilename(file), file.type);

    if (uploadUrl.uploadUrl) {
      const res = await fetch(uploadUrl.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (res.ok) {
        return uploadUrl.imageUrl;
      }

      console.log(await res.json());
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);

    alert("fuck")

    const uploadPromises = values.images.map((file) => uploadToS3(file));

    const imageUrls = await Promise.all(uploadPromises);

    toast.success(
      `Surau/Masjid Name: ${values.name}, State: ${values.state}, District: ${values.district}`
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 ${!isMobile ? "px-64 py-12" : ""}`}
      >
        {/* Other form fields remain the same */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                Surau / Masjid Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Surau Annur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Updated Image Uploader */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem className="mx-auto md:w-1/2">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                <h2 className="font-semibold tracking-tight">
                  Upload images
                  <span
                    className={
                      form.formState.errors.images ||
                      fileRejections.length !== 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {" "}
                    (Multiple images allowed)
                  </span>
                </h2>
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Image previews */}
                  <div className="grid grid-cols-2 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview.preview}
                          alt={`Upload ${index + 1}`}
                          className="h-40 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload area */}
                  <div
                    {...getRootProps()}
                    className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
                  >
                    <ImagePlus className="size-12" />
                    <Input {...getInputProps()} type="file" multiple />
                    {isDragActive ? (
                      <p>Drop the images here!</p>
                    ) : (
                      <p className="text-xs">
                        Click here or drag images to upload them
                      </p>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Images must be less than 1MB and of type png, jpg, or jpeg
                  </p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* Rest of the form fields remain the same */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">State</FormLabel>
              <Select
                onValueChange={handleStateChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(stateDistrict).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">District</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gMapUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Google Map URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://maps.app.goo.gl/FaGteTW9oryF591F6"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isLocatedInsideMall"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is the Surau located inside a mall?</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {form.watch("isLocatedInsideMall") && (
          <FormField
            control={form.control}
            name="mallName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Mall Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the mall name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="isQiblatCertified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is the Surau / Masjid Qiblat certified?</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPerformingJumaatPrayer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Is the Surau / Masjid perform Jumaat prayer?
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="directionDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief location guidance</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="On level 3, turn right besides Zara"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief the direction or guide to the Surau / Masjid to help
                others easy to navigate. <br />
                For example: the Surau is on Level 3 of Lalaport near Uniqlo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row gap-1">
          <Button type="submit">Submit</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
