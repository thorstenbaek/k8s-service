const model = require('../models/webhook.model');

exports.webhookPosted = async (req, res) => {
    var event = req.headers['x-github-event'];
    var body = req.body;
    
    if (event === 'create')
    {
        res.send(await model.create(body));    
    }
    else if (event === 'delete')
    {
        res.send(await model.delete(body));    
    }
    else
    {
        const message = `Ignoring unknown github event - ${event}`;

        console.log(message);
        res.send(message)
    }
}