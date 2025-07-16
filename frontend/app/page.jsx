import { AppSidebar } from "@/components/app-sidebar";
import TripleChartsDashboard from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import QuoteFetcher from "@/components/quote-fetcher";
import EndpointErrors from "@/components/endpoint-errors";
import FeatureUsage from "@/components/feature-usage";
import CountryMetricsChart from "@/components/country-metrics-chart";
import ResposeTimeChart from "@/components/response-time-chart";
export default function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <TripleChartsDashboard />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 lg:px-6">
                <div className="sm:col-span-1">
                  <CountryMetricsChart />
                </div>
                <div className="sm:col-span-1 ">
                  <ResposeTimeChart />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-4 lg:px-6">
                <div className="sm:col-span-1 bg-card border p-6 rounded-xl">
                  <EndpointErrors />
                </div>
                <div className="sm:col-span-1 bg-card border p-6 rounded-xl">
                  <FeatureUsage />
                </div>
                <div className="sm:col-span-2 bg-card border p-6 rounded-xl">
                  <QuoteFetcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
