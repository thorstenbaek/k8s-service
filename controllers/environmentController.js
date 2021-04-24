import EnvironmentModel from "../models/environmentModel.js";

export default class EnvironmentController {
    constructor() {
        this.model = new EnvironmentModel();
    }

    async createEnvironment(req, res) {
        var name = req.params.name;
        
        const result = await this.model.createEnvironment(name, false);
        res.status(result.status).send(result.message);    
    }

    async createIsolatedEnvironment(req, res) {
        var name = req.params.name;
        const result = await this.model.createEnvironment(name, true);
        res.status(result.status).send(result.message);    
    }

    async deleteEnvironment(req, res) {
        var name = req.params.name;
        const result = await this.model.deleteEnvironment(name);
        res.status(result.status).send(result.message);    
    }   
}