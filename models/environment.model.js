import {createNamespace, deleteNamespace} from "./namespace.model.js";
import {applyRelease} from "./release.model.js";
import {loadManifest} from "./manifestLoader.js";

export const createEnvironment = async (name, isolated) => {
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

        var manifest = await loadManifest(url, name, targetDomain);
        
        await createNamespace(name);
        await applyRelease(name, manifest);
    
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

export const deleteEnvironment = async (name) => {

    console.log(`Deleting environment - ${name}`);    
    
    var result = await deleteNamespace(name);
    
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
