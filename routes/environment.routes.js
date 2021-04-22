import express from "express";
import {createEnvironment, createIsolatedEnvironment, deleteEnvironment} from "../controllers/environment.controller.js";

const urlRoutes = express.Router();

urlRoutes.post('/:name', createEnvironment);
urlRoutes.post('/isolated/:name', createIsolatedEnvironment);
urlRoutes.delete('/:name', deleteEnvironment);

export default urlRoutes;