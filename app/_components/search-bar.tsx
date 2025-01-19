import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const DesktopSearchBar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Mock data
  const suggestions = [
    { type: "location", text: "Kuala Lumpur" },
    { type: "location", text: "Kuala Kangsar" },
    {
      type: "place",
      text: "Surau Wakaf Ahmad kuang Lorem",
      image: "/assets/logo-1.png",
    },
    {
      type: "place",
      text: "Suggestion #2 berada di kuala zania",
      image: "/assets/logo-1.png",
    },
    {
      type: "place",
      text: "Suggest in kuala tioman #3",
      image: "/assets/logo-1.png",
    },
    {
      type: "place",
      text: "Surau Kuala Gandah",
      image: "/assets/logo-1.png",
    },
    {
      type: "place",
      text: "Masjid KL Tower Kuala Lumpur",
      image: "/assets/logo-1.png",
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        {/* Main Search Container */}
        <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200">
          {/* Custom Select */}
          <div className="relative min-w-[100px]">
            <Select defaultValue="all">
              <SelectTrigger className="border-none shadow-none bg-transparent hover:bg-gray-50 rounded-l-full focus:ring-0">
                <SelectValue>
                  <span className="text-indigo-600 font-medium">All</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="masjid">Masjid</SelectItem>
                <SelectItem value="surau">Surau</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Search Input */}
          <div className="flex-1 flex items-center">
            <Input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by location..."
              className="border-none focus-visible:ring-0 bg-transparent text-base shadow-none"
            />
          </div>

          {/* Search Button */}
          <Button className="m-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-12 h-12">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Results Dropdown */}
        {isSearching && (
          <div className="absolute w-full bg-white mt-2 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
            <div className="divide-y divide-gray-100">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {item.type === "location" ? (
                    <>
                      <div className="p-2 rounded-full bg-gray-100 mr-3">
                        <Search className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-gray-900">{item.text}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-lg object-cover mr-3 relative">
                        <Image
                          src={item.image ?? ""}
                          fill // Fill the parent container
                          className="object-cover"
                          alt="image"
                        />
                      </div>

                      <span className="text-gray-900">{item.text}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Location Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Can&apos;t find your surau/masjid?{" "}
            <Link href="/add">
              <Button
                variant="link"
                className="text-indigo-600 hover:text-indigo-700 font-medium px-1 h-auto"
              >
                Add here
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopSearchBar;
