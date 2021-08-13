import k8s from "../k8s.js";
import yaml from "js-yaml";
import k8s_client from "@kubernetes/client-node";

export default class ReleaseModel {


    async listRelease(namespace) {
        let result = [];
        
        var releases = await k8s.coreApi.listNamespacedSecret(namespace);

        releases.body.items.forEach(release => {
            result.push(release.metadata.uid + " " + release.metadata.name);    
        }); 
        
        return result;
    }

    async applyRelease(namespace, manifest) {
        const created = [];
        
    
        const specs = yaml.safeLoadAll(manifest);
        const validSpecs = specs.filter((s) => s && s.kind && s.metadata);            

        if (validSpecs[0].kind === "Namespace") {
            console.log("using namespace from manifest...")
            // implemented in spec loop
        }
        else {        
            try {
                console.log("using given namespace...")
                const namespaceObject = await k8s.coreApi.readNamespace(namespace);        
                console.log("Found given namespace " + namespaceObject.body.metadata.name);
            } catch (error) {
                const message = `Namespace ${namespace} was not found`;
                console.error(message);    
                return message;
            }        
        }

        const options = { "headers": { "Content-type": k8s_client.PatchUtils.PATCH_FORMAT_APPLY_YAML}};

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
                if (spec.kind == "Namespace") {
                    console.log("Reading namespace: " + spec.metadata.name);
                    const namespaceObject = await k8s.coreApi.readNamespace(spec.metadata.name);
                    console.log("Found namespace: " + namespaceObject.body.metadata.name);
                }
                else if (spec.kind == "Deployment")
                {
                    var deployment = await k8s.appApi.readNamespacedDeployment(spec.metadata.name, namespace);
                    console.log("Found deployment: " + deployment);                        
                    deployment = await k8s.appApi.patchNamespacedDeployment(spec.metadata.name, namespace, spec, undefined, undefined, "tst@dips.no", true, options);
                    console.log("Patched deployment: " + spec.metadata.name);
                    created.push(deployment.body);
                }
                else if (spec.kind == "StatefulSet")
                {
                    var statefulSet = await k8s.appApi.readNamespacedStatefulSet(spec.metadata.name, namespace);
                    console.log("Found statefulSet: " + statefulSet);

                    statefulSet = await k8s.appApi.patchNamespacedStatefulSet(spec.metadata.name, namespace, spec, undefined, undefined, "tst@dips.no", true, options);
                    console.log("Patched statefulSet: " + spec.metadata.name);
                    created.push(statefulSet.body);
                }
                else if (spec.kind == "Job")
                {
                    var job = await k8s.batchApi.readNamespacedJob(spec.metadata.name, namespace);
                    console.log("Found job: " + job);

                    job = await k8s.batchApi.patchNamespacedJob(spec.metadata.name, namespace, spec, undefined, undefined, "tst@dips.no", true, options);
                    console.log("Patched job: " + spec.metadata.name);
                    created.push(job.body);
                }
                else if (spec.kind == "Service")
                {
                    var service = await k8s.coreApi.readNamespacedService(spec.metadata.name, namespace);    
                    console.log("Found service: " + service.body.metadata.name);

                    try {
                        service = await k8s.coreApi.patchNamespacedService(spec.metadata.name, namespace, spec, undefined, undefined, "tst@dips.no", true, options);
                        console.log("Patched service: " + spec.metadata.name);
                        created.push(service.body);    
                    } catch (error) {
                        console.log("Patch Service failed " + error)
                    }
                    
                }
                else if (spec.kind == "Ingress")
                {
                    var ingress = await k8s.networkingApi.readNamespacedIngress(spec.metadata.name, namespace);
                    console.log("Found ingress: " + ingress);

                    ingress = await k8s.networkingApi.patchNamespacedIngress(spec.metadata.name, namespace, spec, undefined, undefined, "tst@dips.no", true, options);
                    console.log("Patched ingress: " + spec.metadata.name);
                    created.push(ingress.body);
                }                        
            } catch (e) {
                // we did not get the resource, so it does not exist, so create it
                if (spec.kind == "Namespace") {
                    const namespaceObject = await k8s.coreApi.createNamespace(spec);
                    console.log("Created namespace: " + spec.metadata.name);
                    created.push(namespaceObject.body);
                }
                else if (spec.kind == "Deployment")
                {
                    const deployment = await k8s.appApi.createNamespacedDeployment(namespace, spec);
                    console.log("Created deployment: " + spec.metadata.name);
                    created.push(deployment.body);
                }
                else if (spec.kind == "StatefulSet")
                {
                    const statefulSet = await k8s.appApi.createNamespacedStatefulSet(namespace, spec);
                    console.log("Created statefulset: " + spec.metadata.name);
                    created.push(statefulSet.body);
                }
                else if (spec.kind == "Job")
                {
                    const job = await k8s.batchApi.createNamespacedJob(namespace, spec);
                    console.log("Created job: " + spec.metadata.name);
                    created.push(job.body);
                }
                else if (spec.kind == "Service")
                {
                    const service = await k8s.coreApi.createNamespacedService(namespace, spec);
                    console.log("Created service: " + spec.metadata.name);
                    created.push(service.body);
                }
                else if (spec.kind == "Ingress")
                {
                    const ingress = await k8s.networkingApi.createNamespacedIngress(namespace, spec);
                    console.log("Created ingress: " + spec.metadata.name);
                    created.push(ingress.body);
                }
            }
        }

        return created;
    }
}