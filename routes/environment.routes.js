const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/environment.controller');

urlRoutes.post('/:name', controller.createEnvironment);
urlRoutes.post('/isolated/:name', controller.createIsolatedEnvironment);
urlRoutes.delete('/:name', controller.deleteEnvironment);

module.exports = urlRoutes;