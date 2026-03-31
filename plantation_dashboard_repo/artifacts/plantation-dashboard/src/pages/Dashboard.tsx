import { useState, useEffect } from "react";
import {
  useGetPlots,
  useGetPlotMoisture,
  useGetIrrigationStatus,
  useGetPlotSalinity,
  useGetWeatherData,
  useGetAlerts
} from "@workspace/api-client-react";

import { PlotOverviewCards } from "@/components/dashboard/PlotOverviewCards";
import { WaterBalanceChart } from "@/components/dashboard/WaterBalanceChart";
import { IrrigationPanel } from "@/components/dashboard/IrrigationPanel";
import { DiagnosticWidgets } from "@/components/dashboard/DiagnosticWidgets";
import { WeatherPanel } from "@/components/dashboard/WeatherPanel";
import { AlertLog } from "@/components/dashboard/AlertLog";

const REFETCH_INTERVAL = 30000; // 30-second live sync

export default function Dashboard() {
  const [selectedPlotId, setSelectedPlotId] = useState<string>("plot-1");

  const { data: plots, isLoading: isLoadingPlots } = useGetPlots({
    query: { refetchInterval: REFETCH_INTERVAL }
  });
  const { data: irrigationData, isLoading: isLoadingIrrigation } = useGetIrrigationStatus({
    query: { refetchInterval: REFETCH_INTERVAL }
  });
  const { data: weatherData, isLoading: isLoadingWeather } = useGetWeatherData({
    query: { refetchInterval: REFETCH_INTERVAL }
  });
  const { data: alerts, isLoading: isLoadingAlerts } = useGetAlerts({
    query: { refetchInterval: REFETCH_INTERVAL }
  });
  const { data: moistureData, isLoading: isLoadingMoisture } = useGetPlotMoisture(
    selectedPlotId,
    { query: { refetchInterval: REFETCH_INTERVAL, enabled: !!selectedPlotId } }
  );
  const { data: salinityData, isLoading: isLoadingSalinity } = useGetPlotSalinity(
    selectedPlotId,
    { query: { refetchInterval: REFETCH_INTERVAL, enabled: !!selectedPlotId } }
  );

  useEffect(() => {
    if (plots && plots.length > 0 && !plots.find(p => p.id === "plot-1")) {
      setSelectedPlotId(plots[0].id);
    }
  }, [plots]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo"
                 className="w-8 h-8 rounded bg-primary/10" />
            <h1 className="text-xl font-display font-bold text-slate-800 tracking-tight">
              Smart Plantation <span className="text-primary font-normal">Monitor</span>
            </h1>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            Live Sync Active
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Dashboard Description */}
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
          <p className="text-sm text-slate-600 leading-relaxed">
            The <strong>Plot Health Overview</strong> gives an instant traffic-light status for each
            monitored zone, tracking root-zone moisture, electrical conductivity, and pH in real time.
            The <strong>Multi-Depth Water Balance</strong> chart compares soil moisture at 10 cm, 30 cm,
            and 60 cm depth every 15 minutes, with a 20% stress threshold line to trigger irrigation
            decisions. The <strong>Salinity &amp; pH Diagnostics</strong> panels distinguish between
            safe fertilizer salts and harmful ion accumulation (Na⁺, Cl⁻, NO₃⁻), while pairing soil
            pH with CO₂ levels to separate biological root respiration from chemical acidification.
            The <strong>Smart Irrigation Controller</strong> and <strong>Atmospheric Context</strong>
            panels close the management loop — automating valve decisions based on live sensor logic
            and validating field rainfall against the FAO Penman-Monteith reference evapotranspiration.
          </p>
        </div>

        {/* Section 1: Plot Health Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">Plot Health Overview</h2>
            <p className="text-sm text-slate-500">High-level status across all monitored zones</p>
          </div>
          {isLoadingPlots && !plots ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[250px] bg-white rounded-2xl border animate-pulse" />
              ))}
            </div>
          ) : (
            <PlotOverviewCards
              plots={plots || []}
              selectedPlotId={selectedPlotId}
              onSelectPlot={setSelectedPlotId}
            />
          )}
        </section>

        {/* Selected Plot Indicator */}
        <div className="flex items-center px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Currently Viewing Detailed Analytics For:{" "}
            <span className="font-bold underline underline-offset-4">
              {plots?.find(p => p.id === selectedPlotId)?.name || selectedPlotId}
            </span>
          </span>
        </div>

        {/* Section 2: Water Balance + Irrigation */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WaterBalanceChart data={moistureData} isLoading={isLoadingMoisture} />
          <IrrigationPanel data={irrigationData} isLoading={isLoadingIrrigation} />
        </section>

        {/* Section 3: Diagnostics + Weather */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DiagnosticWidgets data={salinityData} isLoading={isLoadingSalinity} />
          <WeatherPanel data={weatherData} isLoading={isLoadingWeather} />
        </section>

        {/* Section 4: Alert Log */}
        <section>
          <AlertLog alerts={alerts} isLoading={isLoadingAlerts} />
        </section>
      </main>
    </div>
  );
}


────────────────────────────────────────────────────────────────────────────────
