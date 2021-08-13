import WebHookModel from "../models/webhookModel.js";

export default class WebHookController {
    constructor() {
        this.webhookModel = new WebHookModel();
    }

    async webhookPosted(req, res) {        
        var event = req.headers['x-github-event'];
        var body = req.body;
        
        if (event === 'create')
        {
            try {
                var result = await this.webhookModel.create(body);    
                res.send(result);    
            } catch (error) {
                res.send(error).status(500);
            }                 
        }
        else if (event === 'delete')
        {
            try {
                var result = await this.webhookModel.delete(body);
                res.send(result);        
            } catch (error) {
                res.send(error).status(500);
            }
            
        }
        else if (event === 'push')
        {
            try {
                var result = await this.webhookModel.update(body);
                res.send(result);        
            } catch (error) {
                res.send(error).status(500);
            }        
        }
        else
        {
            const message = `Unknown github event - ${event}`;

            console.log(message);
            res.send(message).status(500);
        }
    }
}