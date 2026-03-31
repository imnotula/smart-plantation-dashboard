import { Router, type IRouter } from "express";
import {
  GetIrrigationStatusResponse,
  SetIrrigationOverrideBody,
  SetIrrigationOverrideResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

let irrigationState: Record<string, { manualOverride: boolean; valveOpen: boolean }> = {
  "plot-1": { manualOverride: false, valveOpen: true },
  "plot-2": { manualOverride: false, valveOpen: false },
  "plot-3": { manualOverride: false, valveOpen: true },
};

function getIrrigationForPlot(plotId: string) {
  const state = irrigationState[plotId] ?? { manualOverride: false, valveOpen: false };

  const moistureMap: Record<string, number> = {
    "plot-1": 15.7,
    "plot-2": 28.9,
    "plot-3": 9.8,
  };

  const rainHoursMap: Record<string, number> = {
    "plot-1": 5.2,
    "plot-2": 1.8,
    "plot-3": 8.1,
  };

  const moisture = moistureMap[plotId] ?? 20;
  const lastRainHoursAgo = rainHoursMap[plotId] ?? 4;
  // Auto-trigger rule: moisture < 20% AND no rain in last 3 hours
  const autoTriggerActive = moisture < 20 && lastRainHoursAgo > 3;
  const valveOpen = state.manualOverride ? state.valveOpen : autoTriggerActive;

  return { plotId, valveOpen, manualOverride: state.manualOverride,
           currentMoisture: moisture, lastRainHoursAgo, autoTriggerActive };
}

router.get("/irrigation", (_req, res) => {
  const data = GetIrrigationStatusResponse.parse(getIrrigationForPlot("plot-1"));
  res.json(data);
});

router.post("/irrigation/override", (req, res) => {
  const body = SetIrrigationOverrideBody.parse(req.body);
  const { plotId, enabled } = body;

  if (!irrigationState[plotId]) {
    irrigationState[plotId] = { manualOverride: false, valveOpen: false };
  }
  irrigationState[plotId].manualOverride = enabled;
  irrigationState[plotId].valveOpen = enabled;

  const data = SetIrrigationOverrideResponse.parse(getIrrigationForPlot(plotId));
  res.json(data);
});

export default router;


────────────────────────────────────────────────────────────────────────────────
