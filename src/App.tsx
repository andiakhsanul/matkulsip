import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/providers/DataProvider";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { MapPage } from "@/pages/MapPage";
import { SummaryPage } from "@/pages/SummaryPage";
import { MethodologyPage } from "@/pages/MethodologyPage";
import { AboutPage } from "@/pages/AboutPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider delayDuration={220} skipDelayDuration={120}>
        <DataProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<MapPage />} />
              <Route path="ringkasan" element={<SummaryPage />} />
              <Route path="metodologi" element={<MethodologyPage />} />
              <Route path="tentang" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </DataProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
