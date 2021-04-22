import {getCoreApi} from "../k8s.js";
import {listNamespace as modelListNamespace, createNamespace as modelCreateNamespace, getNamespace as modelGetNamespace, deleteNamespace as modelDeleteNamespace } from "../models/namespace.model.js";

export const listNamespace = async (req, res) => {
    res.send(await modelListNamespace());    
}

export const createNamespace = async (req, res) => {    
    var name = req.params.name;
    
    var response = await modelCreateNamespace(name);

    if (response.error)
    {
        res.status(500).send(response.error);
    }
    
    res.status(201).send(response.body);
}

export const getNamespace = async (req, res) => {
    var name = req.params.name;
    
    var response = await modelGetNamespace(name);

    if (response.error)
    {
        res.status(404).send(response.error);
    }
    
    res.status(302).send(response.body);
}

export const updateNamespace = (req, res) => {
    res.status(301).json({message: "Not implemented!"});    
}

export const deleteNamespace = async (req, res) => {    
    var name = req.params.name;
    
    var response = await modelDeleteNamespace(name);

    if (response.error)
    {
        res.status(500).send(response.error);
    }
    else
    {
        res.status(202).send(response.message);           
    }
}
