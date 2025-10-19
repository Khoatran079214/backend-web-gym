import express, { Router } from "express";
import trainerController from "../controllers/trainerController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => trainerController.create(req, res));
router.get("/", (req, res) => trainerController.getAll(req, res));
router.get("/:id", (req, res) => trainerController.getById(req, res));
router.put("/:id", (req, res) => trainerController.update(req, res));
router.delete("/:id", (req, res) => trainerController.delete(req, res));

// Search routes
router.get("/search/specialty/:specialty", (req, res) => trainerController.searchBySpecialty(req, res));

export default router;
