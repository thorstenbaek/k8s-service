import NamespaceModel from "./namespaceModel.js";
import ReleaseModel from "./releaseModel.js";
import ManifestLoader from "./manifestLoader.js";
import k8s from "../k8s.js";

export default class EnvironmentModel {
    constructor() {
        this.namespace = new NamespaceModel();
        this.manifestLoader = new ManifestLoader();
    }

    async createEnvironment(name, isolated) {
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

            var manifest = await this.manifestLoader.loadManifest(url, name, targetDomain);
            
            await this.namespace.createNamespace(name);
            await k8s.apply(name, manifest);
        
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

    async deleteEnvironment(name) {
        console.log(`Deleting environment - ${name}`);    
        
        var result = await this.namespace.deleteNamespace(name);
        
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
}