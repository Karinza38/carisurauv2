import { ArrowLeft } from "lucide-react";
import { AddSurauOrMasjidForm } from "./_components/add-surau-or-masjid-form";
import Link from "next/link";
import Image from "next/image";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AddSurauOrMasjidPage() {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between h-16 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 ">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="px-4">
              <Link href={"/"}>
                <Image
                  src={"/assets/logo-1.png"}
                  width={24}
                  height={24}
                  alt="logo 1"
                />
              </Link>
            </div>
          </header>
          <div className="py-4 px-6 md:px-12 md:py-12 xl:px-12 xl:py-12 sm:px-12 sm:py-12">
            <Link href={"/"}>
              <ArrowLeft />
            </Link>

            <div className="flex flex-col pt-2">
              <div className="text-xl font-bold">Add Surau or Masjid</div>
              <div>Help us to add Surau or Masjid and earn points!</div>
            </div>
            <div className="pt-4">
              <AddSurauOrMasjidForm />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
