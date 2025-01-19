import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SurauMasjid } from "./_components/surau-masjid";
import getSurauMasjid from "./_lib/actions";
import { AppSidebar } from "@/components/app-sidebar";

export default async function SurauMasjidPage({
  params,
}: {
  params: { slug: string };
}) {
  const promises = Promise.all([getSurauMasjid(params.slug)]);
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <SurauMasjid promises={promises} />
      </SidebarInset>
    </SidebarProvider>
  );
}
