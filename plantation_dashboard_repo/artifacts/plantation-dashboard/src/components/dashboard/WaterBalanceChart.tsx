import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { format } from "date-fns";
import type { MoistureData } from "@workspace/api-client-react";

interface WaterBalanceChartProps {
  data?: MoistureData;
  isLoading: boolean;
}

export function WaterBalanceChart({ data, isLoading }: WaterBalanceChartProps) {
  if (isLoading) return <Skeleton className="w-full h-[400px] rounded-2xl" />;
  if (!data || !data.readings || data.readings.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No moisture data available</p>
      </Card>
    );
  }

  const formattedData = data.readings.map(r => ({
    ...r,
    timeLabel: format(new Date(r.timestamp), "HH:mm"),
  }));

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-800">Multi-Depth Water Balance</CardTitle>
        <CardDescription>Continuous soil moisture tracking against stress thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickMargin={10}
                minTickGap={60}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 50]}
                tick={{ fontSize: 12, fill: '#64748B' }}
                unit="%"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm font-medium text-slate-700">{value}</span>}
              />
              {/* 20% stress threshold line */}
              <ReferenceLine
                y={data.stressThreshold || 20}
                stroke="hsl(var(--destructive))"
                strokeDasharray="4 4"
                label={{ position: 'insideTopLeft', value: 'Stress Threshold (20%)',
                         fill: 'hsl(var(--destructive))', fontSize: 12, fontWeight: 600 }}
              />
              {/* 10cm — surface, dashed blue */}
              <Line name="10cm (Surface)" type="monotone" dataKey="depth10cm"
                    stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5"
                    dot={false} activeDot={{ r: 6 }} />
              {/* 30cm — root zone (primary trigger), bold emerald */}
              <Line name="30cm (Root Zone - Trigger)" type="monotone" dataKey="depth30cm"
                    stroke="hsl(var(--primary))" strokeWidth={4}
                    dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
              {/* 60cm — deep, faint dotted gray */}
              <Line name="60cm (Deep)" type="monotone" dataKey="depth60cm"
                    stroke="#94A3B8" strokeWidth={2} strokeDasharray="2 2"
                    dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


────────────────────────────────────────────────────────────────────────────────
