import express, { Router } from "express";
import authController from "../controllers/authController";

const router: Router = express.Router();

// Auth routes
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/change-password", (req, res) => authController.changePassword(req, res));
router.post("/reset-password", (req, res) => authController.resetPassword(req, res));
router.get("/profile/:user_id", (req, res) => authController.getProfile(req, res));

export default router;
