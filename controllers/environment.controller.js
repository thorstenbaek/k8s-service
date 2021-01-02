const model = require('../models/environment.model');

exports.createEnvironment = async (req, res) => {
    var name = req.params.name;
    var domain = req.params.domain;
    res.send(await model.createEnvironment(name, domain));    
}

exports.deleteEnvironment = async (req, res) => {
    var name = req.params.name;
    res.send(await model.deleteEnvironment(name));    
}   