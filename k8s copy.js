const assert = require("assert");
const k8s = require('@kubernetes/client-node');
const Client = require('kubernetes-client').Client
const ClientNodeBackend = require('./node_modules/kubernetes-client/backends/kubernetes-client-node');

let _client;

function initK8s(callback) {
    if (_client) {
        console.warn("Trying to init k8s again!");
        return callback(null, _client);
    }

    const kubeconfig = new k8s.KubeConfig();
    kubeconfig.loadFromDefault();

    try {           
        const backend = new ClientNodeBackend({client: k8s, kubeconfig});
        _client = new Client({version: '1.13', backend: backend});        
        console.log('K8S Api connected to: ', kubeconfig.currentContext);
    
        return callback(null, _client);    
    } catch (error) {
        return callback(error);        
    }    
}

function getK8s()
{
    assert.ok(_client, "Kubernetes client is not initialized. Please called init first.");
    return _client;   
}

module.exports = {
    getK8s,
    initK8s
};