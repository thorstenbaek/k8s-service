const model = require('../models/environment.model');

exports.createEnvironment = async (req, res) => {
    var name = req.params.name;
    
    const result = await model.createEnvironment(name, false);
    res.status(result.status).send(result.message);    
}

exports.createIsolatedEnvironment = async (req, res) => {
    var name = req.params.name;
    const result = await model.createEnvironment(name, true);
    res.status(result.status).send(result.message);    
}

exports.deleteEnvironment = async (req, res) => {
    var name = req.params.name;
    const result = await model.deleteEnvironment(name);
    res.status(result.status).send(result.message);    
}   