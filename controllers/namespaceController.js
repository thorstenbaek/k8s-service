import NamespaceModel from "../models/namespaceModel.js";

export default class NamespaceController {   

    constructor() {
        this.namespace = new NamespaceModel();
    }
        
    async listNamespace(req, res) {
        var result = await this.namespace.listNamespace();
        res.send(result);    
    }

    async createNamespace(req, res) {    
        var name = req.params.name;
        
        var response = await this.namespace.createNamespace(name);

        if (response.error)
        {
            res.status(500).send(response.error);
        }
        
        res.status(201).send(response.body);
    }

    async getNamespace(req, res) {
        var name = req.params.name;
        
        var response = await this.namespace.getNamespace(name);

        if (response.error)
        {
            res.status(404).send(response.error);
        }
        
        res.status(302).send(response.body);
    }

    updateNamespace(req, res) {
        res.status(301).json({message: "Not implemented!"});    
    }

    async deleteNamespace(req, res) {    
        var name = req.params.name;
        
        var response = await this.namespace.deleteNamespace(name);

        if (response.error)
        {
            res.status(500).send(response.error);
        }
        else
        {
            res.status(202).send(response.message);           
        }
    }
}