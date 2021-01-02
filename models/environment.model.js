const fetch = require('node-fetch');
const namespace = require('./namespace.model');
const release = require('./release.model');

getManifest = async (name, domain) => {        
    
    const url = 'https://raw.githubusercontent.com/thorstenbaek/k8sSandBox/master/helm/SandBox/sandbox.release.yaml'
    const response = await fetch(url);
    var manifest = await response.text();

    manifest = manifest.replace(/RELEASE-NAME/g, name);
    manifest = manifest.replace(/DOMAIN/g, domain);     
    return manifest;
}


exports.createEnvironment = async (name, domain) => {
    try {
        console.log(`Creating environment named '${name}' at domain '${domain}'`);

        var manifest = await getManifest(name, domain);
        
        await namespace.createNamespace(name);
        await release.createRelease(name, manifest);
    
        console.log(`Environment - ${name} was successfully created`);    
    } catch (error) {
        
        console.log(`Create failed`);
    }
    
}

exports.deleteEnvironment = async (name) => {
    console.log(`Deleting environment - ${name}`);
    
    await namespace.deleteNamespace(name);

    console.log(`Environment - ${name} successfully deleted`);
}
