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

        return "";
    }

    async getParameters(body, callback) {
        var branch = this.extractBranch(body);        
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

    async create(body) {   
        
        await this.getParameters(body, async (branch, url) => {
            console.log(`Creating environment for branch - ${branch} - with manifest from ${url}`);                

            var manifest = await this.manifestLoader.loadManifest(url, branch, process.env.TARGET_DOMAIN);                
            //this.releaseModel.applyRelease(branch, manifest);
            k8s.apply(branch, manifest);
        });
    }

    async delete(body) {
        await this.getParameters(body, (branch, url) => {
            console.log(`Deleting environment for branch - ${branch}`);                
            this.environmentModel.deleteEnvironment(branch);
        });
    }

    async update(body) {
        await this.getParameters(body, async (branch, url) => {
            console.log(`Updating environment for branch - ${branch} - with manifest from ${url}`);                
            
            //Todo compare with current get all to detect added or removed nodes...

            var manifest = await this.manifestLoader.loadManifest(url, branch, process.env.TARGET_DOMAIN);                
            k8s.apply(branch, manifest);
        });                
    }
}