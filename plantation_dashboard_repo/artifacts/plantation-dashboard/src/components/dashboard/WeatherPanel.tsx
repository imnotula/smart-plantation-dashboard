import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatValue } from "@/lib/utils";
import { Sun, Wind, Droplets, ThermometerSun } from "lucide-react";
import type { WeatherData } from "@workspace/api-client-react";

interface WeatherPanelProps {
  data?: WeatherData;
  isLoading: boolean;
}

export function WeatherPanel({ data, isLoading }: WeatherPanelProps) {
  if (isLoading) return <Skeleton className="col-span-1 h-[350px] rounded-2xl" />;
  if (!data) return null;

  const matchPercentage = Math.min(
    Math.round((data.plotRainfall / data.referenceRainfall) * 100), 100
  ) || 0;

  return (
    <Card className="col-span-1 border-slate-200 shadow-sm bg-white text-slate-800 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-800 flex items-center justify-between">
          Atmospheric Context
          <Sun className="w-5 h-5 text-amber-500" />
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">
        {/* ETo hero tile */}
        <div className="mb-5 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="text-sm font-medium text-slate-500 mb-1">
            Reference Evapotranspiration (ETo)
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-display font-bold text-slate-800">{formatValue(data.ETo, 1)}</span>
            <span className="text-lg text-slate-500 mb-1 font-medium">mm/day</span>
          </div>
          <div className="text-[10px] text-emerald-600 uppercase tracking-widest mt-2 font-semibold">
            FAO Penman-Monteith Calc
          </div>
        </div>

        {/* 4 weather metric tiles */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: ThermometerSun, color: "text-rose-500", label: "Temp",      value: `${data.temperature}°C` },
            { icon: Droplets,       color: "text-blue-500", label: "Humidity",  value: `${data.humidity}%` },
            { icon: Wind,           color: "text-slate-500", label: "Wind",     value: `${data.windSpeed} m/s` },
            { icon: Sun,            color: "text-amber-500", label: "Solar Rad",value: `${data.solarRadiation} W/m²` },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{label}</div>
                <div className="font-semibold text-slate-800">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Rainfall validation gauge */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-600">Rainfall Validation</span>
            <span className="text-blue-600 font-bold">{matchPercentage}% Match</span>
          </div>
          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-slate-200 rounded-full" style={{ width: '100%' }} />
            <div className="absolute top-0 left-0 h-full bg-blue-400 rounded-r-full"
                 style={{ width: `${matchPercentage}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Plot: {data.plotRainfall}mm</span>
            <span>Ref Station: {data.referenceRainfall}mm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


────────────────────────────────────────────────────────────────────────────────
