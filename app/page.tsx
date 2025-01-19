import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchSurauAndMasjid } from "./_components/search-surau-and-masjid";
import { Separator } from "@/components/ui/separator";
import { SurauAndMasjidList } from "./_components/surau-and-masjid-lists";
import { getAllSurauMasjid } from "./_lib/actions";

export default async function Home() {
  const promises = Promise.all([getAllSurauMasjid()]);

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <SearchSurauAndMasjid />
        <Separator className="mt-4" />
        <SurauAndMasjidList promises={promises} />
      </SidebarInset>
    </SidebarProvider>
  );
}
