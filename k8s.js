const assert = require("assert");
const kubernetes = require('@kubernetes/client-node');

let _k8s;

function initK8s(callback) {
    if (_k8s) {
        console.warn("Trying to init k8s again!");
        return callback(null, _k8s);
    }

    const kc = new kubernetes.KubeConfig();
    kc.loadFromDefault();

    try {           
        _k8s = kc.makeApiClient(kubernetes.CoreV1Api);
        console.log('K8S Api connected to: ', _k8s._basePath);
    
        return callback(null, _k8s);    
    } catch (error) {
        return callback(error);        
    }
    
}

function getK8s()
{
    assert.ok(_k8s, "K8s has not been initialized. Please called init first.");
    return _k8s;   
}

module.exports = {
    getK8s,
    initK8s
};