import {applyRelease} from "./release.model.js";
import {deleteEnvironment} from "./environment.model.js";
import {loadManifest} from "./manifestLoader.js";

const extractBranch = (body) => {
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

export const create = body => {   
    getParameters(body, async (branch, url) => {
        console.log(`Creating environment for branch - ${branch} - with manifest from ${url}`);                

        var manifest = await loadManifest(url, branch, process.env.TARGET_DOMAIN);                
        applyRelease(branch, manifest);
    });
}

export const delete_ = async (body) => {
    getParameters(body, (branch, url) => {
        console.log(`Deleting environment for branch - ${branch}`);                
        deleteEnvironment(branch);
    });
}

export const update = body => {
    getParameters(body, async (branch, url) => {
        console.log(`Updating environment for branch - ${branch} - with manifest from ${url}`);                
        
        var manifest = await loadManifest(url, branch, process.env.TARGET_DOMAIN);                
        applyRelease(branch, manifest);
    });                
}