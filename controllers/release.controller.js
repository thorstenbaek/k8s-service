import {listRelease as modelListRelease, applyRelease as modelApplyRelease} from "../models/release.model.js";

export const listRelease = async (req, res) => {
    var namespace = req.params.namespace;
    res.send(await modelListRelease(namespace));    
}

export const applyRelease = async (req, res) => {
    var namespace = req.params.namespace;
    res.send(await modelApplyRelease(namespace, req.body));    
}

export const getRelease = async (req, res) => {
    res.send({message: "not implemented"});
}   