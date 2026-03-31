import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import type { SalinityPhData } from "@workspace/api-client-react";

interface DiagnosticWidgetsProps {
  data?: SalinityPhData;
  isLoading: boolean;
}

function GaugeChart({ value, min, max, label, unit, colorClass, dangerThreshold }: {
  value: number; min: number; max: number;
  label: string; unit: string; colorClass: string; dangerThreshold?: number;
}) {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const isDanger = dangerThreshold !== undefined && value >= dangerThreshold;
  const strokeColor = isDanger ? "stroke-destructive" : colorClass;
  const radius = 40;
  const circumference = radius * Math.PI;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-20 overflow-hidden">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none"
                className="stroke-slate-200" strokeWidth="12" strokeLinecap="round" />
          <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none"
                className={`transition-all duration-1000 ${strokeColor}`}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - percentage * circumference} />
        </svg>
        <div className="absolute bottom-0 left-0 w-full text-center pb-1">
          <div className="text-2xl font-display font-bold text-slate-800 leading-none">{value.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase">{unit}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-slate-600 mt-2">{label}</div>
    </div>
  );
}

function IonBar({ label, value, maxVal, color }: {
  label: string; value: number; maxVal: number; color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
        <span>{label}</span>
        <span>{value} ppm</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`}
             style={{ width: `${Math.min((value / maxVal) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

export function DiagnosticWidgets({ data, isLoading }: DiagnosticWidgetsProps) {
  if (isLoading) return <Skeleton className="col-span-1 lg:col-span-2 h-[350px] rounded-2xl" />;
  if (!data) return null;

  const ecTrend = data.ecHistory.map((val, i) => ({ index: i, value: val }));
  const phTrend = data.phHistory.map((val, i) => ({ index: i, ph: val, co2: data.co2History[i] }));
  const isHarmful = data.bulkEC > 2.5 && data.naConcentration > 100;

  return (
    <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ── Salinity Widget ── */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-800 flex items-center justify-between">
            Salinity Diagnostics
            <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-1 rounded-md">
              Diagnostic
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start mb-4">
            <GaugeChart value={data.bulkEC} min={0} max={4}
                        label="Bulk EC" unit="dS/m"
                        colorClass="stroke-amber-400" dangerThreshold={2.5} />
            <div className="flex-1 ml-6 space-y-3">
              <IonBar label="Na⁺ (Sodium)"  value={data.naConcentration}  maxVal={200} color="bg-destructive" />
              <IonBar label="Cl⁻ (Chloride)" value={data.clConcentration}  maxVal={200} color="bg-amber-500" />
              <IonBar label="NO₃⁻ (Nitrate)" value={data.no3Concentration} maxVal={200} color="bg-emerald-500" />
              <div className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
                {isHarmful
                  ? <span className="text-destructive font-bold">⚠️ Harmful Accumulation</span>
                  : <span className="text-emerald-600 font-bold">✓ Fertilizer Salts (Safe)</span>}
              </div>
            </div>
          </div>
          {/* EC 7-day sparkline */}
          <div className="h-16 w-full relative border-t border-slate-100 pt-3">
            <div className="absolute inset-0 pt-3 flex justify-center text-[10px] text-muted-foreground font-medium pointer-events-none z-10">
              EC TREND (7D)
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ecTrend}>
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── pH Diagnosis Widget ── */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-800 flex items-center justify-between">
            pH Diagnostics
            <span className="text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-1 rounded-md">
              Diagnostic
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Two gauges side-by-side: Soil pH + Soil CO₂ */}
          <div className="flex justify-around items-start mb-4">
            <GaugeChart value={data.pH} min={4} max={8}
                        label="Soil pH" unit="pH"
                        colorClass="stroke-purple-500" dangerThreshold={4.5} />
            {/* CO₂ gauge (400–3000 ppm range) */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-20 overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none"
                        className="stroke-slate-200" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none"
                        className={`transition-all duration-1000 ${data.soilCO2 > 2000 ? "stroke-destructive" : "stroke-slate-400"}`}
                        strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={40 * Math.PI}
                        strokeDashoffset={40 * Math.PI - Math.min((data.soilCO2 - 400) / 2600, 1) * (40 * Math.PI)} />
                </svg>
                <div className="absolute bottom-0 left-0 w-full text-center pb-1">
                  <div className="text-xl font-display font-bold text-slate-800 leading-none">{data.soilCO2}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">ppm</div>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600 mt-2">Soil CO₂</div>
            </div>
          </div>

          {/* Diagnosis interpretation */}
          <div className="text-xs font-medium px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg text-purple-900 mb-4">
            <span className="font-bold text-purple-700">Diagnosis: </span>
            {data.soilCO2 > 1800 && data.pH < 5.5
              ? "Biological Respiration active — root zone metabolically healthy despite low pH."
              : data.pH < 5.0
              ? "⚠️ Chemical Acidification likely — low pH with minimal CO₂ activity."
              : "Soil chemistry within acceptable range. Monitor CO₂ trends."}
          </div>

          {/* pH + CO₂ dual-line sparkline */}
          <div className="h-20 w-full relative border-t border-slate-100 pt-3">
            <div className="absolute inset-0 pt-3 flex justify-between px-2 text-[10px] font-medium pointer-events-none z-10">
              <span className="text-purple-500">■ Soil pH</span>
              <span className="text-slate-400">— Soil CO₂</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={phTrend}>
                <YAxis yAxisId="left" domain={[4, 8]} hide />
                <YAxis yAxisId="right" orientation="right" domain={['dataMin - 100', 'dataMax + 100']} hide />
                <Line yAxisId="left"  type="monotone" dataKey="ph"  stroke="#A855F7" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="co2" stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}


────────────────────────────────────────────────────────────────────────────────
