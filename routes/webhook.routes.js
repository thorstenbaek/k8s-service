const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/webhook.controller');

urlRoutes.post('/', controller.webhookPosted);

module.exports = urlRoutes;