const model = require('../models/release.model');

exports.listRelease = async (req, res) => {
    var namespace = req.params.namespace;
    res.send(await model.listRelease(namespace));    
}

exports.createRelease = async (req, res) => {
    var namespace = req.params.namespace;
    res.send(await model.createRelease(namespace, req.body));    
}

exports.getRelease = async (req, res) => {
    res.send({message: "not implemented"});
}