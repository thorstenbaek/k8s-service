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
    }
}

// singleton instance
const k8s = new KubernetesClient();
export default k8s;