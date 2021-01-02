const express = require('express');
var bodyParser = require('body-parser');
const namespaceRoutes = require('./routes/namespace.routes');
const releaseRoutes = require('./routes/release.routes');
const environmentRoutes = require('./routes/environment.routes');
const initK8s = require('./k8s.js').initK8s;
const getCoreApi = require('./k8s.js').getCoreApi;

const port = 8001;
const app = express();

app.use(bodyParser.text());
app.use('/namespace', namespaceRoutes);
app.use('/release', releaseRoutes);
app.use('/environment', environmentRoutes);

initK8s(err => {
    if (err) {
        throw err;
    }

    app.listen(port, () => {
    console.log(`Express listening on at port ${port}`)
    });
});

app.get("/", (req, res) => {
    res.send(getCoreApi()._basePath);
});