const fetch = require('node-fetch');
const namespace = require('./namespace.model');
const release = require('./release.model');

getManifest = async (name, domain) => {        
    
    const url = process.env.ManifestTemplateURL;    
    console.log("Loading manifest from:" + url);
    
    const response = await fetch(url);
    var manifest = await response.text();

    manifest = manifest.replace(/RELEASE-NAME/g, name);
    manifest = manifest.replace(/DOMAIN/g, domain);     
    return manifest;
}


exports.createEnvironment = async (name) => {
    try {
        const targetDomain = process.env.TARGET_DOMAIN
        
        console.log(`Creating environment named '${name}' at domain '${targetDomain}'`);

        var manifest = await getManifest(name, targetDomain);
        
        await namespace.createNamespace(name);
        await release.createRelease(name, manifest);
    
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
