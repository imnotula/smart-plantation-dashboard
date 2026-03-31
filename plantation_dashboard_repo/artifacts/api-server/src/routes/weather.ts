import { Router, type IRouter } from "express";
import { GetWeatherDataResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function generateHistory(base: number, variance: number, points = 7): number[] {
  const result: number[] = [];
  let current = base;
  for (let i = 0; i < points; i++) {
    current = Math.max(0, current + (Math.random() - 0.5) * variance);
    result.push(parseFloat(current.toFixed(2)));
  }
  return result;
}

router.get("/weather", (_req, res) => {
  const data = GetWeatherDataResponse.parse({
    temperature: 31.4,
    humidity: 78,
    windSpeed: 2.3,
    solarRadiation: 22.1,
    ETo: 4.87,                    // FAO Penman-Monteith result (mm/day)
    plotRainfall: 12.4,
    referenceRainfall: 15.2,
    rainfallHistory: generateHistory(14, 6),
    EToHistory: generateHistory(4.8, 0.8),
  });
  res.json(data);
});

export default router;


────────────────────────────────────────────────────────────────────────────────
