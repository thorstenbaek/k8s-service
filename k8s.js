const assert = require("assert");
const kubernetes = require('@kubernetes/client-node');

let _core_api;
let _app_api;
let _batch_api;
let _networking_api;

function initK8s(callback) {
    if (_core_api) {
        console.warn("Trying to init k8s again!");
        return callback(null);
    }

    const kc = new kubernetes.KubeConfig();
    kc.loadFromDefault();

    try {           
        _core_api = kc.makeApiClient(kubernetes.CoreV1Api);
        _app_api = kc.makeApiClient(kubernetes.AppsV1Api);
        _batch_api = kc.makeApiClient(kubernetes.BatchV1Api);
        _networking_api = kc.makeApiClient(kubernetes.NetworkingV1beta1Api);
        
        console.log('K8S Api connected to: ', _core_api._basePath);
        return callback(null);    

    } catch (error) {
        return callback(error);        
    }    
}

function getCoreApi() {
    assert.ok(_core_api, "K8s has not been initialized. Please call init first.");
    return _core_api;   
}

function getAppApi() {
    assert.ok(_app_api, "K8s has not been initialized. Please call init first.");
    return _app_api;   
}

function getBatchApi() {
    assert.ok(_batch_api, "K8s has not been initialized. Please call init first.");
    return _batch_api;   
}

function getNetworkingApi() {
    assert.ok(_networking_api, "K8s has not been initialized. Please call init first.");
    return _networking_api;   
}



module.exports = {
    getCoreApi,
    getAppApi,
    getBatchApi,
    getNetworkingApi,
    initK8s
};