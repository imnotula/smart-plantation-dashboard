import { Router, type IRouter } from "express";
import healthRouter from "./health";
import plotsRouter from "./plots";
import irrigationRouter from "./irrigation";
import weatherRouter from "./weather";
import alertsRouter from "./alerts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(plotsRouter);
router.use(irrigationRouter);
router.use(weatherRouter);
router.use(alertsRouter);

export default router;


────────────────────────────────────────────────────────────────────────────────
