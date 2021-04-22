import express from "express";
import {listRelease, applyRelease} from "../controllers/release.controller.js";

const urlRoutes = express.Router();


urlRoutes.get('/:namespace', listRelease);
urlRoutes.post('/:namespace', applyRelease);
//urlRoutes.get('/:namespace', controller.getRelease);
// urlRoutes.put('/:name', controller.updateNamespace);
// urlRoutes.delete('/:name', controller.deleteNamespace);

export default urlRoutes;