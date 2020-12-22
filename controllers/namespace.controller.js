const getCoreApi = require('../k8s.js').getCoreApi;
const model = require('../models/namespace.model');

exports.listNamespace = async (req, res) => {
    res.send(await model.listNamespace());    
}

exports.createNamespace = async (req, res) => {    
    var name = req.params.name;
    
    var response = await model.createNamespace(name);

    if (response.error)
    {
        res.status(500).send(response.error);
    }
    
    res.status(201).send(response.body);
}

exports.getNamespace = async (req, res) => {
    var name = req.params.name;
    
    var response = await model.getNamespace(name);

    if (response.error)
    {
        res.status(404).send(response.error);
    }
    
    res.status(302).send(response.body);
}

exports.updateNamespace = (req, res) => {
    res.status(301).json({message: "Not implemented!"});    
}

exports.deleteNamespace = async (req, res) => {    
    var name = req.params.name;
    
    var response = await model.deleteNamespace(name);

    if (response.error)
    {
        res.status(500).send(response.error);
    }
    else
    {
        res.status(202).send(response.message);           
    }
}
