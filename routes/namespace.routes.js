import express from "express";
import {listNamespace, createNamespace, getNamespace, updateNamespace, deleteNamespace} from "../controllers/namespace.controller.js";

const urlRoutes = express.Router();

urlRoutes.get('/', listNamespace);
urlRoutes.post('/:name', createNamespace);
urlRoutes.get('/:name', getNamespace);
urlRoutes.put('/:name', updateNamespace);
urlRoutes.delete('/:name', deleteNamespace);

export default urlRoutes;
