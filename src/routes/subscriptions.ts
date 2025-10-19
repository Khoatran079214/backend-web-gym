import express, { Router } from "express";
import subscriptionController from "../controllers/subscriptionController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => subscriptionController.create(req, res));
router.get("/", (req, res) => subscriptionController.getAll(req, res));
router.get("/:id", (req, res) => subscriptionController.getById(req, res));
router.put("/:id", (req, res) => subscriptionController.update(req, res));
router.delete("/:id", (req, res) => subscriptionController.delete(req, res));

// Search routes
router.get("/member/:member_id", (req, res) => subscriptionController.getByMember(req, res));

export default router;
