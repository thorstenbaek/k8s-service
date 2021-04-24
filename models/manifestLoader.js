import fetch from "node-fetch";

export default class ManifestLoader {

    async loadManifest(url, name, domain) {                
        console.log("Loading manifest from:" + url);
        
        const response = await fetch(url);
        var manifest = await response.text();
        console.log("Loaded manifest");        
        
        console.log("Replacing variables");        
        manifest = manifest.replace(/RELEASE-NAME/g, name);
        manifest = manifest.replace(/DOMAIN/g, domain);     
        console.log("Variables replaced");        

        return manifest;
    }
}