const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/namespace.controller');

urlRoutes.get('/', controller.listNamespace);
urlRoutes.post('/:name', controller.createNamespace);
urlRoutes.get('/:name', controller.getNamespace);
urlRoutes.put('/:name', controller.updateNamespace);
urlRoutes.delete('/:name', controller.deleteNamespace);

module.exports = urlRoutes;
