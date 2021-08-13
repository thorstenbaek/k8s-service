import yaml from "js-yaml";
import kubernetes from "@kubernetes/client-node";

class KubernetesClient {
    constructor() {        
        const kubeConfig = new kubernetes.KubeConfig();
        kubeConfig.loadFromDefault();
        Object.freeze(kubeConfig);
        console.log("Initialized Kubernetes Client");
        

        try {           
            this.coreApi = kubeConfig.makeApiClient(kubernetes.CoreV1Api);
            this.appApi = kubeConfig.makeApiClient(kubernetes.AppsV1Api);
            this.batchApi = kubeConfig.makeApiClient(kubernetes.BatchV1Api);
            this.networkingApi = kubeConfig.makeApiClient(kubernetes.NetworkingV1beta1Api);
            
            console.log('K8S Api connected to: ', this.coreApi._basePath);        

        } catch (error) {
            console.error(error);
            throw new Error(error);
        }                    

        this.readOperations = {
            "Deployment": async (name, namespace) => {return await this.appApi.readNamespacedDeployment(name, namespace)},
            "StatefulSet": async (name, namespace) => {return await this.appApi.readNamespacedStatefulSet(name, namespace)},
            "Job": async (name, namespace) => {return await this.batchApi.readNamespacedJob(name, namespace)},
            "Service": async (name, namespace) => {return await this.coreApi.readNamespacedService(name, namespace)},
            "Ingress": async (name, namespace) => {return await this.networkingApi.readNamespacedIngress(name, namespace)},            
            "Pod": async (name, namespace) => {return await this.coreApi.readNamespacedPod(name, namespace)},
            "ConfigMap" : async(name, namespace) => {return await this.coreApi.readNamespacedConfigMap(name, namespace)}
        }

        this.patchOperations = {
            "Deployment": async (namespace, spec, options) => {return await this.appApi.patchNamespacedDeployment(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-service", true, options)},
            "StatefulSet": async (namespace, spec, options) => {return await this.appApi.patchNamespacedStatefulSet(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-service", true, options)},
            "Job": async (namespace, spec, options) => {return await this.batchApi.patchNamespacedJob(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-service", true, options)},
            "Service": async (namespace, spec, options) => {return await this.coreApi.patchNamespacedService(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-service", true, options)},
            "Ingress": async (namespace, spec, options) => {return await this.networkingApi.patchNamespacedIngress(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-service", true, options)},
            "Pod": async (namespace, spec, options) => {return await this.coreApi.patchNamespacedPod(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-service", true, options)},
            "ConfigMap" : async(namespace, spec, options) => {return await this.coreApi.patchNamespacedConfigMap(spec.metadata.name, namespace, spec, undefined, undefined, "k8s-serviec", true, options)}
        }

        this.createOperations = {
            "Deployment": async (namespace, spec) => {return await this.appApi.createNamespacedDeployment(namespace, spec)},
            "StatefulSet": async (namespace, spec) => {return await this.appApi.createNamespacedStatefulSet(namespace, spec)},
            "Job": async (namespace, spec) => {return await this.batchApi.createNamespacedJob(namespace, spec)},
            "Service": async (namespace, spec) => {return await this.coreApi.createNamespacedService(namespace, spec)},
            "Ingress": async (namespace, spec) => {return await this.networkingApi.createNamespacedIngress(namespace, spec)},
            "Pod": async (namespace, spec) => {return await this.coreApi.createNamespacedPod(namespace, spec)},
            "ConfigMap" : async(namespace, spec) => {return await this.coreApi.createNamespacedConfigMap(namespace, spec)}
        }
    }

    cleanSpec(spec) {
        // this is to convince the old version of TypeScript that metadata exists even though we already filtered specs
        // without metadata out
        spec.metadata = spec.metadata || {};
        spec.metadata.annotations = spec.metadata.annotations || {};
        delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
        spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
    }

    async read(namespace, spec) {
        const readFunc = this.readOperations[spec.kind]; 
        var readObject = null;

        if (readFunc) {
            try {
                readObject = await readFunc(spec.metadata.name, namespace);   
                console.log(`Read ${spec.kind}: ${readObject.body.metadata.name}`);
                return readObject != null;    
            } catch (error) {
                console.error(`Read ${spec.kind} failed`);
            }            
        }
        else {
            throw new Error("Missing read operation");    
        }
    }

    async patch(namespace, spec) {
        const options = { "headers": { "Content-type": kubernetes.PatchUtils.PATCH_FORMAT_APPLY_YAML}};

        const patchFunc = this.patchOperations[spec.kind];
        var patchedObject = null;
        
        if (patchFunc) {
            try {
                patchedObject = await patchFunc(namespace, spec, options);   
                console.log(`Patched ${spec.kind}: ${patchedObject.body.metadata.name}`);
                return patchedObject != null;
            } catch(error) {
                console.error(`Patch ${spec.kind} failed`);
            }
        }
        else {
            throw new Error("Missing patch operation");
        }
    }

    async create(namespace, spec) {
        const createFunc = this.createOperations[spec.kind];
        var createdObject = null;
        if (createFunc) {
            try {
                createdObject = await createFunc(namespace, spec);   
                console.log(`Created ${spec.kind}: ${createdObject.body.metadata.name}`);                
                return createdObject != null;
            } catch(error) {
                console.error(`Create ${spec.kind} failed due to ${error}`);
            }
        }
        else {
            throw new Error(`Missing create operation ${spec.kind}`);            
        }
    }

    async ensureNamespace(specs) {
        // make sure namespace exists
        const namespaceSpec = specs.filter((s) => s && s.kind === "Namespace");        
        if (namespaceSpec.length > 0)
        {
            const ns = namespaceSpec[0];

            console.log(`Found namespace spec in manifest named: ${ns.metadata.name}`);
            var existingNamespace = null;
            try {
                existingNamespace = await this.coreApi.readNamespace(ns.metadata.name);    
            } catch (error) {
                
            }
            
            if (existingNamespace == null) {
                console.log(`Creating namespace: ${ns.metadata.name}`);
                await this.coreApi.createNamespace(ns);
                console.log(`Created namespace: ${ns.metadata.name}`);
            }
            else {
                console.log(`Existing namespace found: ${ns.metadata.name}`);
            }
        }
    }

    async apply(namespace, manifest) {
        
        console.log("Applying manifest");
        const specs = yaml.safeLoadAll(manifest);
        
        await this.ensureNamespace(specs);
        
        const validSpecs = specs.filter((s) => s && s.kind && s.kind !== "Namespace" && s.metadata);            
        validSpecs.map(async(spec) => {
            this.cleanSpec(spec);
            
            try {
                const found = await this.read(namespace, spec);
                if (found) {
                    await this.patch(namespace, spec);
                }
                else {
                    await this.create(namespace, spec);
                }    
            } catch(error) {
                console.error(error);
            }
            
        });
    }
}

// singleton instance
const k8s = new KubernetesClient();
export default k8s;