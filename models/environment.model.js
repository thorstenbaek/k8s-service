const namespace = require('./namespace.model');
const release = require('./release.model');
const manifestLoader = require('./manifestLoader');

exports.createEnvironment = async (name, isolated) => {
    try {
        const targetDomain = process.env.TARGET_DOMAIN
        
        console.log(`Creating environment named '${name}' at domain '${targetDomain}'`);

        let url = "";
        if (isolated)
        {
            url = process.env.IsolatedManifestTemplateURL;    
        }
        else
        {
            url = process.env.ManifestTemplateURL;    
        }

        var manifest = await manifestLoader.loadManifest(url, name, targetDomain);
        
        await namespace.createNamespace(name);
        await release.applyRelease(name, manifest);
    
        const message = `Environment '${name}' was successfully created at '${targetDomain}'`;
        console.log(message);    
        return {
            status: 200,
            message: message
        };
    } catch (error) {                
        const message = `Create environment '${name}' failed due to ${error}`;
        console.error(message);
        return {
            status: 500,
            message: message
        }
    }    
}

exports.deleteEnvironment = async (name) => {

    console.log(`Deleting environment - ${name}`);    
    
    var result = await namespace.deleteNamespace(name);
    
    if (!result.error)
    {
        const message = `Environment - ${name} successfully deleted`;
        console.log(message);

        return {
            status: 200,
            message: message
        };
    }
    else
    {
        return {
            status: 500,
            message: result.error
        };
    }
}
