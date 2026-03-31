import { Router, type IRouter } from "express";
import { GetAlertsResponse, AcknowledgeAlertResponse } from "@workspace/api-zod";

const router: IRouter = Router();

let alerts = [
  {
    id: "alert-001",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    plotId: "plot-1",
    severity: "critical" as const,
    message: "High EC Spike at Plot 1 – EC reading 2.8 dS/m exceeds safe threshold",
    actionRecommended: "Recommend Leaching",
    acknowledged: false,
  },
  {
    id: "alert-002",
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    plotId: "plot-3",
    severity: "critical" as const,
    message: "Critical Moisture Deficit at Plot 3 – Root zone moisture at 9.8% (< 20% threshold)",
    actionRecommended: "Activate Irrigation",
    acknowledged: false,
  },
  {
    id: "alert-003",
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    plotId: "plot-3",
    severity: "warning" as const,
    message: "Low pH Alert at Plot 3 – pH 4.8 indicates potential chemical acidification",
    actionRecommended: "Apply Lime Amendment",
    acknowledged: false,
  },
  {
    id: "alert-004",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    plotId: "plot-1",
    severity: "warning" as const,
    message: "High Na+ Concentration at Plot 1 – Sodium levels at 85 ppm, monitor for salinity stress",
    actionRecommended: "Schedule Soil Flushing",
    acknowledged: true,
  },
  {
    id: "alert-005",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    plotId: "plot-2",
    severity: "info" as const,
    message: "Plot 2 Irrigation Cycle Completed – 45 min run, moisture now at 28.9%",
    actionRecommended: "Monitor Next 24h",
    acknowledged: true,
  },
  {
    id: "alert-006",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    plotId: "plot-1",
    severity: "warning" as const,
    message: "Moisture Below Stress Threshold at Plot 1 – 30cm depth reading 15.7% triggers auto-irrigation",
    actionRecommended: "Verify Valve Operation",
    acknowledged: false,
  },
  {
    id: "alert-007",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    plotId: "plot-2",
    severity: "info" as const,
    message: "Rainfall Validation Discrepancy – Plot 2 rainfall 12.4mm vs reference 15.2mm (gap: 2.8mm)",
    actionRecommended: "Check Rain Gauge Calibration",
    acknowledged: false,
  },
];

router.get("/alerts", (_req, res) => {
  res.json(GetAlertsResponse.parse(alerts));
});

router.post("/alerts/:alertId/action", (req, res) => {
  const { alertId } = req.params;
  const alert = alerts.find((a) => a.id === alertId);
  if (!alert) { res.status(404).json({ error: "Alert not found" }); return; }
  alert.acknowledged = true;
  res.json(AcknowledgeAlertResponse.parse(alert));
});

export default router;


================================================================================
FRONTEND — artifacts/plantation-dashboard/src/
================================================================================


────────────────────────────────────────────────────────────────────────────────
