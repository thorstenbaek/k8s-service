import fetch from "node-fetch";

export async function loadManifest(url, name, domain) {        
    
    
    console.log("Loading manifest from:" + url);
    
    const response = await fetch(url);
    var manifest = await response.text();

    manifest = manifest.replace(/RELEASE-NAME/g, name);
    manifest = manifest.replace(/DOMAIN/g, domain);     
    return manifest;
}