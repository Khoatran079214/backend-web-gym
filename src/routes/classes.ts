import express, { Router } from "express";
import classController from "../controllers/classController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => classController.create(req, res));
router.get("/", (req, res) => classController.getAll(req, res));
router.get("/:id", (req, res) => classController.getById(req, res));
router.put("/:id", (req, res) => classController.update(req, res));
router.delete("/:id", (req, res) => classController.delete(req, res));

// Search routes
router.get("/search/name/:name", (req, res) => classController.searchByName(req, res));

export default router;
