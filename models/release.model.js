const k8s = require('../k8s.js');
const yaml = require('js-yaml');

exports.listRelease = async (namespace) => {
    let result = [];
    
    var releases = await k8s.getCoreApi().listNamespacedSecret(namespace);

    releases.body.items.forEach(release => {
        result.push(release.metadata.uid + " " + release.metadata.name);    
    }); 
    
    return result;
}

exports.createRelease = async (namespace, manifest) => {
    const created = [];
    
    try {
        const specs = yaml.safeLoadAll(manifest);
        const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
        
        
        let core = k8s.getCoreApi();
        let app = k8s.getAppApi();
        let batch = k8s.getBatchApi();
        let networking = k8s.getNetworkingApi();

        try {
            var namespaceObject = await core.readNamespace(namespace);        
        } catch (error) {
            const message = `Namespace ${namespace} was not found`;
            console.error(message);    
            return message;
        }        

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
    
                    deployment = await app.patchNamespacedDeployment(spec.metadata.name, namespace, spec);
                    created.push(deployment.body);
                }
                else if (spec.kind == "StatefulSet")
                {
                    var statefulSet = await app.readNamespacedStatefulSet(spec.metadata.name, namespace);
                    console.log("Found statefulSet: " + statefulSet.metadata.name);
    
                    statefulSet = await app.patchNamespacedStatefulSet(spec.metadata.name, namespace, spec);
                    created.push(statefulSet.body);
                }
                else if (spec.kind == "Job")
                {
                    var job = await batch.readNamespacedJob(spec.metadata.name, namespace);
                    console.log("Found job: " + job.metadata.name);
    
                    job = await batch.patchNamespacedJob(spec.metadata.name, namespace, spec);
                    created.push(job.body);
                }
                else if (spec.kind == "Service")
                {
                    var service = await core.readNamespacedService(spec.metadata.name, namespace);    
                    console.log("Found service: " + service.metadata.name);
    
                    service = await core.patchNamespacedService(spec.metadata.name, namespace, spec);
                    created.push(service.body);
                }
                else if (spec.kind == "Ingress")
                {
                    var ingress = await networking.readNamespacedIngress(spec.metadata.name, namespace);
                    console.log("Found ingress: " + ingress.metadata.name);
    
                    ingress = await app.patchNamespacedIngress(spec.metadata.name, namespace, spec);
                    created.push(ingress.body);
                }                        
            } catch (e) {
                // we did not get the resource, so it does not exist, so create it
                if (spec.kind == "Deployment")
                {
                    const deployment = await app.createNamespacedDeployment(namespace, spec);
                    created.push(deployment.body);
                }
                else if (spec.kind == "StatefulSet")
                {
                    const statefulSet = await app.createNamespacedStatefulSet(namespace, spec);
                    created.push(statefulSet.body);
                }
                else if (spec.kind == "Job")
                {
                    const job = await batch.createNamespacedJob(namespace, spec);
                    created.push(job.body);
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
    } catch (error) {
        console.error(error);               
        return error;
    }

    return created;
}