const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/environment.controller');

urlRoutes.post('/:name/:domain', controller.createEnvironment);
urlRoutes.delete('/:name', controller.deleteEnvironment);

module.exports = urlRoutes;