import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAcknowledgeAlert, getGetAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { AlertEntry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

interface AlertLogProps {
  alerts?: AlertEntry[];
  isLoading: boolean;
}

export function AlertLog({ alerts, isLoading }: AlertLogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const ackMutation = useAcknowledgeAlert({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAlertsQueryKey() });
        toast({ title: "Action Recorded", description: "Alert acknowledged and action logged." });
      },
    },
  });

  if (isLoading) return <Skeleton className="w-full h-[300px] rounded-2xl" />;

  return (
    <Card className="col-span-full border-slate-200 shadow-sm flex flex-col h-[400px]">
      <CardHeader className="pb-3 border-b border-slate-100 flex-shrink-0">
        <CardTitle className="text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-500" /> System Alerts & Actions
          </div>
          <Badge variant="secondary" className="font-mono">
            {alerts?.filter(a => !a.acknowledged).length || 0} Active
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 overflow-y-auto flex-1">
        {!alerts || alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
            <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-200" />
            <p className="text-lg font-medium text-slate-700">All Clear</p>
            <p className="text-sm">No recent alerts or recommended actions.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div key={alert.id}
                   className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4
                               transition-colors hover:bg-slate-50
                               ${alert.acknowledged ? 'opacity-60 bg-slate-50/50' : 'bg-white'}`}>
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    {alert.severity === 'critical' && <AlertTriangle className="w-5 h-5 text-destructive" />}
                    {alert.severity === 'warning'  && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {alert.severity === 'info'     && <Bell className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={alert.severity === 'critical' ? 'destructive'
                               : alert.severity === 'warning' ? 'warning' : 'secondary'}
                        className="uppercase text-[10px] px-1.5 py-0"
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-500 uppercase">{alert.plotId}</span>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm ${alert.acknowledged ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 md:ml-auto">
                  {alert.acknowledged ? (
                    <div className="flex items-center text-sm text-emerald-600 font-medium px-4 py-2 bg-emerald-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Resolved
                    </div>
                  ) : (
                    <Button
                      onClick={() => ackMutation.mutate({ alertId: alert.id })}
                      disabled={ackMutation.isPending}
                      variant={alert.severity === 'critical' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Execute: {alert.actionRecommended}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


================================================================================
END OF SOURCE CODE
================================================================================
Key packages used:
  Frontend : react, vite, tailwindcss, recharts, @tanstack/react-query,
             lucide-react, date-fns, wouter, shadcn/ui components
  Backend  : express 5, zod, pino (structured logging)
  Tooling  : orval (OpenAPI → React Query hooks + Zod validators),
             drizzle-orm (ORM, available if DB is provisioned),
             TypeScript 5.9, pnpm workspaces

To connect to GitHub:
  1. Open the Git panel in Replit (branch icon, left sidebar)
  2. Click "Connect to GitHub" and authorise
  3. Push to a new or existing repository
================================================================================
