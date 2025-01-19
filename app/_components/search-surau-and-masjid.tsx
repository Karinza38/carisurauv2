"use client";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";
import DesktopSearchBar from "./search-bar";
import { Button } from "@/components/ui/button";

export function SearchSurauAndMasjid() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <header className="flex justify-between h-16 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="px-4">
            <Image
              src={"/assets/logo-1.png"}
              width={24}
              height={24}
              alt="logo 1"
            />
          </div>
        </header>
        <div className="pt-4 px-4 flex items-center justify-center flex-col gap-2">
          <Input placeholder="Search for Surau or Masjid" />
        </div>
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
    );
  }

  return (
    <div>
      <header className="flex justify-between h-16 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 ">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="px-6">
          <Image
            src={"/assets/banner-purple.png"}
            width={160}
            height={160}
            alt="logo 1"
          />
        </div>
      </header>

      <DesktopSearchBar />
    </div>
  );
}
