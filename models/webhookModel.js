import ReleaseModel from "./releaseModel.js";
import EnvironmentModel from "./environmentModel.js";
import ManifestLoader from "./manifestLoader.js";
import k8s from "../k8s.js";

export default class WebHookModel {
    constructor() {
        this.manifestLoader = new ManifestLoader();
        this.releaseModel = new ReleaseModel();
        this.environmentModel = new EnvironmentModel();
    }
      
    extractBranch(body) {
        var branch = body.ref.slice(11);        
        console.log(branch);
        if (branch !== 'master') {              
            return branch.replace(/\//g, '-');
        }

        return branch;
    }

    extractFolder(body) {
        var folder = body.ref.slice(11);        
        return folder;
    }

    async getParameters(body, callback) {
        var branch = this.extractBranch(body);        
        var folder = this.extractFolder(body);
        if (branch !== "") {
            var branchUrl = '';
            /*if (branch != 'master')
            {
                branchUrl = `${branch}/`;
                branchUrl = branchUrl.replace("-", "/");
            }*/
            
            var manifestUrl = `https://raw.githubusercontent.com/thorstenbaek/sandbox-environments/${folder}/manifest.yaml`  
            console.log("manifestUrl", manifestUrl);
            return await callback(branch, folder, manifestUrl);        
        }
    }

    async create(body) {           
        return await this.getParameters(body, async (branch, folder, url) => {
            console.log(`Creating environment for branch - ${branch} - with manifest from ${url}`);                

            var manifest = await this.manifestLoader.loadManifest(url, branch, process.env.TARGET_DOMAIN, folder);                
            await k8s.apply(branch, manifest);

            const createdMessage = `Environment for branch - ${branch} was successfully created`;
            return createdMessage;
        });
    }

    async delete(body) {
        return await this.getParameters(body, async (branch, folder, url) => {
            console.log(`Deleting environment for branch - ${branch}`);                
            await this.environmentModel.deleteEnvironment(branch);

            const deletedMessage = `Environment for branch - ${branch} was successfully deleted`;
            return deletedMessage;
        });
    }

    async update(body) {
        return await this.getParameters(body, async (branch, folder, url) => {
            console.log(`Updating environment for branch - ${branch} - with manifest from ${url}`);                
            
            //Todo compare with current get all to detect added or removed nodes...

            var manifest = await this.manifestLoader.loadManifest(url, branch, process.env.TARGET_DOMAIN, folder);                
            k8s.apply(branch, manifest);

            const updatedMessage = `Environment for branch - ${branch} was successfully updated`;
            return updatedMessage;
        });                
    }
}