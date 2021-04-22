const { HttpError } = require('@kubernetes/client-node');
const release = require('./release.model');
const environment = require('./environment.model');
const manifestLoader = require("./manifestLoader");

extractBranch = (body) => {
    var branch = body.ref.slice(11);        
    console.log(branch);
    if (branch !== 'master') {              
        return branch.replace(/\//g, '-');
    }

    return "";
}

const getParameters = async (body, callback) => {
    var branch = extractBranch(body);        
    
    if (branch !== "") {
        var branchUrl = '';
        if (branch != 'master')
        {
            branchUrl = `${branch}/`;
            branchUrl = branchUrl.replace("-", "/");
        }
        
        var manifestUrl = `https://raw.githubusercontent.com/thorstenbaek/sandbox-environments/${branchUrl}manifest.yaml`  
        await callback(branch, manifestUrl);        
    }
}

exports.create = body => {   
    getParameters(body, async (branch, url) => {
        console.log(`Creating environment for branch - ${branch} - with manifest from ${url}`);                

        var manifest = await manifestLoader.loadManifest(url, branch, process.env.TARGET_DOMAIN);                
        release.applyRelease(branch, manifest);
    });
}

exports.delete = async (body) => {
    getParameters(body, (branch, url) => {
        console.log(`Deleting environment for branch - ${branch}`);                
        environment.deleteEnvironment(branch);
    });
}

exports.update = body => {
    getParameters(body, async (branch, url) => {
        console.log(`Updating environment for branch - ${branch} - with manifest from ${url}`);                
        
        var manifest = await manifestLoader.loadManifest(url, branch, process.env.TARGET_DOMAIN);                
        release.applyRelease(branch, manifest);
    });                
}