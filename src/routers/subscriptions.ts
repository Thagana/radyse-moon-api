import { Router } from "express";
import subscriptions from "../controllers/subscription/subscriptions";
import auth from "../middleware/auth";

const router = Router();

router.get("/", auth, subscriptions.getSubscriptions);
router.get("/plans", auth, subscriptions.getPlans);
router.post("/plan/create", auth, subscriptions.createPlan);
router.post("/transaction/create", auth, subscriptions.createTransactions);
router.post("/transaction/verify", auth, subscriptions.verifyTransactions);

export default router;
