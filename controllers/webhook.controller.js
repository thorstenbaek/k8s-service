import {create as modelCreate, delete_ as modelDelete, update as modelUpdate } from "../models/webhook.model.js";

export const webhookPosted = async (req, res) => {
    var event = req.headers['x-github-event'];
    var body = req.body;
    
    if (event === 'create')
    {
        try {
            var result = await modelCreate(body);    
            res.send(result);    
        } catch (error) {
            res.send(error).status(500);
        }                 
    }
    else if (event === 'delete')
    {
        try {
            var result = await modelDelete(body);
            res.send(result);        
        } catch (error) {
            res.send(error).status(500);
        }
        
    }
    else if (event === 'push')
    {
        try {
            var result = await modelUpdate(body);
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