const k8s = require('@kubernetes/client-node');
const express = require("express");

//const port = 80;
const port = 8001;
const app = express();

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const server = kc.getCurrentCluster().server;
console.log('API URL: ', server);

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
console.log('K8S Api: ', k8sApi);


app.listen(port, () => {
   console.log(`Express listening on at port ${port}`)
});

app.get("/", (req, res) => {
    res.send("Return name of Kubernetes Cluster here");
});

app.get("/namespaces", (req, res) => {
    
    let namespaces = [];
    k8sApi.listNamespace().then((namespace) => {
        namespace.body.items.forEach(item => {
            namespaces.push(item.metadata.uid + " " + item.metadata.name);    
        });    

        res.send(namespaces);
    });    
});

async function getNamespace(name)
{
    var namespace = await k8sApi.readNamespace(name);        
    return namespace;    
}

app.get("/namespaces/:name", async (req, res) => {
    var name = req.params.name;
    
    try {
        var namespace = await getNamespace(name);    
        if (namespace.response.statusCode == 200)
        {
            console.log("Found namespace " + namespace.body.metadata.name);
            res.send(namespace);
        }
        else
        {
            res.status(404);
            res.send("error");            
        }
    } 
    catch (error) {
        console.log(error);
        res.status(404);
        res.send(error);        
    }    
});

app.post("/namespaces/:name", (req, res) => {
    var name = req.params.name;

    var namespace = {
        metadata: {
            name: name,
        },
    };

    k8sApi.createNamespace(namespace).then(
        (response) => {
            console.log('Created namespace');
            console.log(response);          
            res.send(response);
        },
        (err) => {
            console.log('Error!: ' + err);
            res.send(err);
        },
    );
})

async function deleteNamespace(name) {
    var namespace = await getNamespace(name);
    
    if (namespace.response.statusCode = 200)
    {
        var response = await k8sApi.deleteNamespace(namespace.body.metadata.name, {});
        if (response.response.statusCode = 200)
        {
            return namespace.body.metadata.name    
        }                
    }            
    
    return null;
}

app.delete("/namespaces/:name", async (req, res) => {
    var name = req.params.name;
    try 
    {
        var deleted = await deleteNamespace(name);
        if (deleted)
        {
            console.log("Deleted namespace " + deleted);
            res.send("Deleted namespace " + deleted);
        }
        else
        {
            console.log("Namespace not found");
            res.status(404);
            res.send("Namespace not found");            
        }
    } 
    catch (error) 
    {
        console.log(error);
        res.send(error);
        res.status(404);
    }    
})
