const environment = require('./environment.model');

exports.create = async (body) => {
    var post = JSON.parse(body);
    
    if (post.ref_type == 'branch') // or label?
    {
        var branch = post.ref;
        var name = branch.replace(/\//g, '-');
        
        var replacement = '';
        if (branch != 'master')
        {
            replacement = `${branch}/`;
        }
        
        var manifestUrl = `https://raw.githubusercontent.com/thorstenbaek/sandbox-environments/${replacement}manifest.yaml`
        
        console.log(`Creating environment for the branch - ${name}`);        
        
        environment.createEnvironment(name, manifestUrl);
    }
}

exports.delete = async (body) => {
    return "Delete";
}