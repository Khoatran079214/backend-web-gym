import express, { Router } from "express";
import checkinController from "../controllers/checkinController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => checkinController.create(req, res));
router.get("/", (req, res) => checkinController.getAll(req, res));
router.get("/:id", (req, res) => checkinController.getById(req, res));
router.put("/:id", (req, res) => checkinController.update(req, res));
router.delete("/:id", (req, res) => checkinController.delete(req, res));

// Search routes
router.get("/member/:member_id", (req, res) => checkinController.getByMember(req, res));

// Stats routes
router.get("/stats/today", (req, res) => checkinController.getTodayStats(req, res));

export default router;
