import express, { Router } from "express";
import paymentController from "../controllers/paymentController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => paymentController.create(req, res));
router.get("/", (req, res) => paymentController.getAll(req, res));
router.get("/:id", (req, res) => paymentController.getById(req, res));
router.put("/:id", (req, res) => paymentController.update(req, res));
router.delete("/:id", (req, res) => paymentController.delete(req, res));

// Filter routes
router.get("/member/:member_id", (req, res) => paymentController.getByMember(req, res));
router.get("/stats/revenue", (req, res) => paymentController.getStats(req, res));

export default router;
