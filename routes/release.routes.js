const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/release.controller');

urlRoutes.get('/:namespace', controller.listRelease);
urlRoutes.post('/:namespace', controller.createRelease);
//urlRoutes.get('/:namespace', controller.getRelease);
// urlRoutes.put('/:name', controller.updateNamespace);
// urlRoutes.delete('/:name', controller.deleteNamespace);

module.exports = urlRoutes;