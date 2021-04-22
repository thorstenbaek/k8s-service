const model = require('../models/webhook.model');

exports.webhookPosted = async (req, res) => {
    var event = req.headers['x-github-event'];
    var body = req.body;
    
    if (event === 'create')
    {
        try {
            var result = await model.create(body);    
            res.send(result);    
        } catch (error) {
            res.send(error).status(500);
        }                 
    }
    else if (event === 'delete')
    {
        try {
            var result = await model.delete(body);
            res.send(result);        
        } catch (error) {
            res.send(error).status(500);
        }
        
    }
    else if (event === 'push')
    {
        try {
            var result = await model.update(body);
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