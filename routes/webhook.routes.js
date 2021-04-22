import express from "express";
import {webhookPosted} from "../controllers/webhook.controller.js";

const urlRoutes = express.Router();

urlRoutes.post('/', webhookPosted);

export default urlRoutes;