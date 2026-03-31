import { Router, type IRouter } from "express";
import {
  GetPlotsResponse,
  GetPlotMoistureResponse,
  GetPlotSalinityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateSparkline(base: number, variance: number, length = 7): number[] {
  const result: number[] = [];
  let current = base;
  for (let i = 0; i < length; i++) {
    current = Math.max(5, Math.min(95, current + (Math.random() - 0.5) * variance));
    result.push(parseFloat(current.toFixed(1)));
  }
  return result;
}

function generateTimeSeries(base: number, variance: number, points = 24): number[] {
  const result: number[] = [];
  let current = base;
  for (let i = 0; i < points; i++) {
    current = Math.max(0, current + (Math.random() - 0.5) * variance);
    result.push(parseFloat(current.toFixed(1)));
  }
  return result;
}

router.get("/plots", (_req, res) => {
  const plots = [
    {
      id: "plot-1",
      name: "Plot 1",
      healthStatus: "warning",
      moisture10cm: 18.3,
      moisture30cm: 15.7,
      moisture60cm: 22.4,
      bulkEC: 2.8,
      pH: 5.9,
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      trend7day: generateSparkline(20, 8),
    },
    {
      id: "plot-2",
      name: "Plot 2",
      healthStatus: "healthy",
      moisture10cm: 31.2,
      moisture30cm: 28.9,
      moisture60cm: 35.1,
      bulkEC: 1.4,
      pH: 6.2,
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      trend7day: generateSparkline(30, 5),
    },
    {
      id: "plot-3",
      name: "Plot 3",
      healthStatus: "critical",
      moisture10cm: 11.2,
      moisture30cm: 9.8,
      moisture60cm: 14.3,
      bulkEC: 3.6,
      pH: 4.8,
      lastUpdated: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      trend7day: generateSparkline(12, 4),
    },
  ];
  const data = GetPlotsResponse.parse(plots);
  res.json(data);
});

// 15-minute interval moisture readings (96 points = 24 hours)
router.get("/plots/:plotId/moisture", (req, res) => {
  const { plotId } = req.params;

  const baseMoisture: Record<string, { d10: number; d30: number; d60: number }> = {
    "plot-1": { d10: 18, d30: 16, d60: 22 },
    "plot-2": { d10: 31, d30: 29, d60: 35 },
    "plot-3": { d10: 11, d30: 10, d60: 14 },
  };

  const base = baseMoisture[plotId] ?? { d10: 20, d30: 18, d60: 25 };
  const now = Date.now();

  const readings = Array.from({ length: 96 }, (_, i) => {
    const ts = new Date(now - (95 - i) * 15 * 60 * 1000).toISOString();
    return {
      timestamp: ts,
      depth10cm: parseFloat(Math.max(5, base.d10 + (Math.random() - 0.5) * 8).toFixed(1)),
      depth30cm: parseFloat(Math.max(5, base.d30 + (Math.random() - 0.5) * 6).toFixed(1)),
      depth60cm: parseFloat(Math.max(5, base.d60 + (Math.random() - 0.5) * 5).toFixed(1)),
    };
  });

  const data = GetPlotMoistureResponse.parse({
    plotId,
    readings,
    stressThreshold: 20,
  });
  res.json(data);
});

router.get("/plots/:plotId/salinity", (req, res) => {
  const { plotId } = req.params;

  const baseData: Record<string, {
    bulkEC: number; na: number; cl: number; no3: number; pH: number; co2: number
  }> = {
    "plot-1": { bulkEC: 2.8, na: 85, cl: 92, no3: 48, pH: 5.9, co2: 1850 },
    "plot-2": { bulkEC: 1.4, na: 42, cl: 38, no3: 112, pH: 6.2, co2: 1620 },
    "plot-3": { bulkEC: 3.6, na: 140, cl: 155, no3: 22, pH: 4.8, co2: 2100 },
  };

  const base = baseData[plotId] ?? { bulkEC: 2.0, na: 70, cl: 75, no3: 60, pH: 6.0, co2: 1700 };

  const data = GetPlotSalinityResponse.parse({
    plotId,
    bulkEC: base.bulkEC,
    naConcentration: base.na,
    clConcentration: base.cl,
    no3Concentration: base.no3,
    pH: base.pH,
    soilCO2: base.co2,
    ecHistory: generateTimeSeries(base.bulkEC, 0.4, 7),
    phHistory: generateTimeSeries(base.pH, 0.2, 7),
    co2History: generateTimeSeries(base.co2, 80, 7),
  });
  res.json(data);
});

export default router;


────────────────────────────────────────────────────────────────────────────────
