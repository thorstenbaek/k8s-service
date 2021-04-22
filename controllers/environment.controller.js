import {createEnvironment as modelCreateEnvironment, deleteEnvironment as modelDeleteEnvironment} from "../models/environment.model.js";

export const createEnvironment = async (req, res) => {
    var name = req.params.name;
    
    const result = await modelCreateEnvironment(name, false);
    res.status(result.status).send(result.message);    
}

export const createIsolatedEnvironment = async (req, res) => {
    var name = req.params.name;
    const result = await modelCreateEnvironment(name, true);
    res.status(result.status).send(result.message);    
}

export const deleteEnvironment = async (req, res) => {
    var name = req.params.name;
    const result = await modelDeleteEnvironment(name);
    res.status(result.status).send(result.message);    
}   