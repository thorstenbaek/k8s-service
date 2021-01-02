const express = require('express');
const urlRoutes = express.Router();

urlRoutes.get('/', (req, res) => {
    console.log('Health check ok');
    res.status(200).send('Health check ok');
});

module.exports = urlRoutes;