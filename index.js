const express = require('express');
const namespaceRouter = require('./routes/namespace.routes');
const initK8s = require('./k8s.js').initK8s;
const getK8s = require('./k8s.js').getK8s;

const port = 80;
const app = express();

app.use('/namespace', namespaceRouter);

initK8s(err => {
    if (err) {
        throw err;
    }

    app.listen(port, () => {
    console.log(`Express listening on at port ${port}`)
    });
});

app.get("/", (req, res) => {
    res.send(getK8s()._basePath);
});

app.get("/namespaces", (req, res) => {
    
    let namespaces = [];
    getK8s().listNamespace().then((namespace) => {
        namespace.body.items.forEach(item => {
            namespaces.push(item.metadata.uid + " " + item.metadata.name);    
        });    

        res.send(namespaces);
    });    
});