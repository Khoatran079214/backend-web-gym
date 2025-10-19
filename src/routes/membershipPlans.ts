import express, { Router } from "express";
import membershipPlanController from "../controllers/membershipPlanController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => membershipPlanController.create(req, res));
router.get("/", (req, res) => membershipPlanController.getAll(req, res));
router.get("/:id", (req, res) => membershipPlanController.getById(req, res));
router.put("/:id", (req, res) => membershipPlanController.update(req, res));
router.delete("/:id", (req, res) => membershipPlanController.delete(req, res));

// Filter routes
router.get("/active/list", (req, res) => membershipPlanController.getActive(req, res));

export default router;
