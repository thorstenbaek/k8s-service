const yaml = require('js-yaml');
const k8s = require('../k8s.js');

exports.listRelease = async (req, res) => {
    var namespace = req.params.namespace;

    let releases = [];
    var response = await getCoreApi().listNamespacedSecret(namespace);

    response.body.items.forEach(item => {
        releases.push(item.metadata.uid + " " + item.metadata.name);    
    });    

    res.send(releases);    
}

exports.createRelease = async (req, res) => {
    const specs = yaml.safeLoadAll(req.body);
    const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
    const created = [];
    const namespace = "tst";

    let core = k8s.getCoreApi();
    let app = k8s.getAppApi();
    let networking = k8s.getNetworkingApi();

    for (const spec of validSpecs) {
        // this is to convince the old version of TypeScript that metadata exists even though we already filtered specs
        // without metadata out
        spec.metadata = spec.metadata || {};
        spec.metadata.annotations = spec.metadata.annotations || {};
        delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
        spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
        
        try {
            // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
            // block.
            
            if (spec.kind == "Deployment")
            {
                var deployment = await app.readNamespacedDeployment(spec.metadata.name, namespace);
                console.log("Found deployment: " + deployment.metadata.name);
            }
            else if (spec.kind == "Service")
            {
                var service = await core.readNamespacedService(spec.metadata.name, namespace);    
                console.log("Found service: " + service.metadata.name);
            }
            else if (spec.kind == "Ingress")
            {
                var ingress = await networking.readNamespacedIngress(spec.metadata.name, namespace);
                console.log("Found ingress: " + ingress.metadata.name);
            }
            
            // we got the resource, so it exists, so patch it
            
            /*if (spec.kind == "Deployment")
            {
                const deployment = await app.patchNamespacedDeployment(spec.metadata.name, namespace, spec);
                created.push(deployment.body);
            }
            else if (spec.kind == "Service")
            {
                const service = await core.patchNamespacedService(spec.metadata.name, namespace, spec);
                created.push(service.body);
            }
            else if (spec.kind == "Ingress")
            {
                const ingress = await app.patchNamespacedIngress(spec.metadata.name, namespace, spec);
                created.push(ingress.body);
            }*/
        } catch (e) {
            // we did not get the resource, so it does not exist, so create it
            if (spec.kind == "Deployment")
            {
                const deployment = await app.createNamespacedDeployment(namespace, spec);
                created.push(deployment.body);
            }
            else if (spec.kind == "Service")
            {
                const service = await core.createNamespacedService(namespace, spec);
                created.push(service.body);
            }
            else if (spec.kind == "Ingress")
            {
                const ingress = await networking.createNamespacedIngress(namespace, spec);
                created.push(ingress.body);
            }
        }
    }
    
    res.send(created);
}

exports.getRelese = async (req, res) => {
    
}