import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatValue } from "@/lib/utils";
import { Droplet, Activity, FlaskConical, Clock } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import type { PlotSummary } from "@workspace/api-client-react";

interface PlotOverviewCardsProps {
  plots: PlotSummary[];
  selectedPlotId: string;
  onSelectPlot: (id: string) => void;
}

export function PlotOverviewCards({ plots, selectedPlotId, onSelectPlot }: PlotOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plots.map((plot) => {
        const isSelected = plot.id === selectedPlotId;
        const trendData = plot.trend7day.map((val, i) => ({ index: i, value: val }));

        let badgeVariant: "success" | "warning" | "destructive" = "success";
        if (plot.healthStatus === "warning") badgeVariant = "warning";
        else if (plot.healthStatus === "critical") badgeVariant = "destructive";

        return (
          <Card
            key={plot.id}
            className={`cursor-pointer transition-all duration-300 border-2 overflow-hidden relative ${
              isSelected
                ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                : "border-transparent hover:border-border"
            }`}
            onClick={() => onSelectPlot(plot.id)}
          >
            {isSelected && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-emerald-300" />
            )}

            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">{plot.name}</CardTitle>
                <div className="flex items-center text-xs text-muted-foreground mt-1.5">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(plot.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <Badge variant={badgeVariant} className="uppercase tracking-wider px-3 py-1">
                {plot.healthStatus}
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Moisture column */}
                <div className="space-y-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center text-sm font-medium text-slate-600">
                    <Droplet className="w-4 h-4 mr-2 text-blue-500" /> Moisture
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">10cm</span>
                      <span className="font-semibold">{formatValue(plot.moisture10cm, 1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-600 font-medium">30cm</span>
                      <span className="font-bold text-emerald-700">{formatValue(plot.moisture30cm, 1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">60cm</span>
                      <span className="font-semibold">{formatValue(plot.moisture60cm, 1)}%</span>
                    </div>
                  </div>
                </div>

                {/* EC + pH column */}
                <div className="space-y-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs font-medium text-slate-600 mb-1">
                      <Activity className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Bulk EC
                    </div>
                    <div className="text-lg font-bold">
                      {formatValue(plot.bulkEC, 2)}
                      <span className="text-[10px] text-muted-foreground font-normal"> dS/m</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-xs font-medium text-slate-600 mb-1">
                      <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> pH Level
                    </div>
                    <div className="text-lg font-bold">{formatValue(plot.pH, 1)}</div>
                  </div>
                </div>
              </div>

              {/* 7-day sparkline */}
              <div className="h-12 w-full mt-2 relative">
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground/40 font-medium pointer-events-none z-10">
                  7-DAY MOISTURE TREND
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={plot.healthStatus === 'critical' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


────────────────────────────────────────────────────────────────────────────────
