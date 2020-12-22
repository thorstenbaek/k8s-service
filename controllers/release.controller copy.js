const yaml = require('js-yaml');
const getK8s = require('../k8s.js').getK8s;

exports.listRelease = async (req, res) => {
    var namespace = req.params.namespace;

    let releases = [];
    var response = await getK8s().listNamespacedSecret(namespace);

    response.body.items.forEach(item => {
        releases.push(item.metadata.uid + " " + item.metadata.name);    
    });    

    res.send(releases);    
}

exports.createRelease = async (req, res) => {
    const specs = yaml.safeLoadAll(req.body);
    const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
    const created = [];

    let client = getK8s();

    for (const spec of validSpecs) {
        let namespace = "tst";
        // this is to convince the old version of TypeScript that metadata exists even though we already filtered specs
        // without metadata out
        spec.metadata = spec.metadata || {};
        spec.metadata.annotations = spec.metadata.annotations || {};
        delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
        spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
        
        try {
            // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
            // block.
            
            var deployment = await client.apis.apps.v1.namespaces(namespace).deployments(spec.metadata.name).get();                           
            console.log(deployment.body.metadata.name);
            // we got the resource, so it exists, so patch it
                
            const response = await client.apis.apps.v1.namespaces(namespace).deployments(spec.metadata.name).patch({body: spec});
            console.log(response);
            created.push(response.body);
            
        } catch (e) {
            try {
                if (spec.kind == 'Deployment')
                {
                    const deployment = await client.apis.apps.v1.namespaces(namespace).deployments.post({ body: spec });
                    console.log("Created deployment");
                    created.push(deployment.body);
                }
                else if (spec.kind == 'Service')
                {
                    const service = await client.api.v1.namespaces(namespace).services.post({ body: spec });             
                    console.log("Created service");
                    created.push(service.body);
                }
                else if (spec.kind == 'Ingress')
                {
                    const ingress = await client.apis.extensions.v1beta1.namespaces(namespace).ingresses.post({ body: spec });
                    console.log("Created ingress");
                    created.push(ingress.body);
                }
            } catch (error) {
                console.log(error); 
            }
            
            //console.log("Not found: " + spec.metadata.name);
            // console.log(e);
            // we did not get the resource, so it does not exist, so create it
            //const response = await client.createNamespacedService('sandbox', spec);
            
        }
    }
    
    res.send(created);
}

exports.getRelese = async (req, res) => {
    
}