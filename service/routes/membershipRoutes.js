import express from "express";
import {subscribeController, checkMembershipStatusController}  from "../controllers/membershipController.js"
const router = express.Router();

// Route to activate membership
router.post("/:userId/subscribe", subscribeController);


router.get("/:userId/status", checkMembershipStatusController);
export default router;

