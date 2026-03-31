import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Power, PowerOff, Settings2, Droplets, CloudRain } from "lucide-react";
import { useSetIrrigationOverride, getGetIrrigationStatusQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { IrrigationStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

interface IrrigationPanelProps {
  data?: IrrigationStatus;
  isLoading: boolean;
}

export function IrrigationPanel({ data, isLoading }: IrrigationPanelProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const overrideMutation = useSetIrrigationOverride({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetIrrigationStatusQueryKey() });
        toast({ title: "Override applied", description: "Irrigation manual override toggled." });
      },
      onError: () => {
        toast({ title: "Action failed", description: "Could not toggle override.", variant: "destructive" });
      },
    },
  });

  if (isLoading) return <Skeleton className="w-full h-[400px] rounded-2xl" />;
  if (!data) return null;

  const handleToggle = () => {
    overrideMutation.mutate({ data: { enabled: !data.manualOverride, plotId: data.plotId } });
  };

  return (
    <Card className="col-span-1 border-slate-200 shadow-sm flex flex-col relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
      <CardHeader className="pb-2 border-b border-slate-100 bg-white z-10">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <span>Smart Irrigation</span>
          <Settings2 className="w-5 h-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-6 z-10">
        {/* Valve status indicator */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
          <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-4 ${
            data.valveOpen ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'
          }`}>
            {data.valveOpen && <div className="absolute inset-0 rounded-full animate-pulse bg-emerald-400/20" />}
            <div className="text-center z-10">
              <span className={`block text-3xl font-display font-bold tracking-tight ${
                data.valveOpen ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {data.valveOpen ? 'OPEN' : 'CLOSED'}
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
                Valve Status
              </span>
            </div>
          </div>
        </div>

        {/* Automation logic display */}
        <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/10 mb-6">
          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center">
            <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Control Logic
          </h4>
          <div className="font-mono text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-inner">
            <span className="text-purple-600 font-semibold">IF</span> moisture &lt; 20%<br />
            <span className="text-purple-600 font-semibold">AND</span> rain_gap &gt; 3h<br />
            <span className="text-blue-600 font-bold">→ IRRIGATION ON</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-slate-600 flex items-center">
              <Droplets className="w-4 h-4 mr-1 text-blue-500" /> {data.currentMoisture.toFixed(1)}%
            </span>
            <span className="text-slate-600 flex items-center">
              <CloudRain className="w-4 h-4 mr-1 text-slate-400" /> {data.lastRainHoursAgo}h ago
            </span>
          </div>
        </div>

        {/* Manual override */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-medium text-slate-600">Auto-trigger:</span>
            <span className={`text-sm font-bold ${data.autoTriggerActive ? 'text-emerald-600' : 'text-slate-400'}`}>
              {data.autoTriggerActive ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <Button
            onClick={handleToggle}
            disabled={overrideMutation.isPending}
            variant={data.manualOverride ? "destructive" : "default"}
            className="w-full h-12 text-base"
          >
            {data.manualOverride
              ? <><PowerOff className="w-5 h-5 mr-2" /> Disable Override</>
              : <><Power className="w-5 h-5 mr-2" /> Manual Override</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


────────────────────────────────────────────────────────────────────────────────
