import express, { Router } from "express";
import memberController from "../controllers/memberController";

const router: Router = express.Router();

// CRUD routes
router.post("/", (req, res) => memberController.create(req, res));
router.get("/", (req, res) => memberController.getAll(req, res));
router.get("/:id", (req, res) => memberController.getById(req, res));
router.put("/:id", (req, res) => memberController.update(req, res));
router.delete("/:id", (req, res) => memberController.delete(req, res));

// Search routes
router.get("/search/email/:email", (req, res) => memberController.searchByEmail(req, res));

export default router;
