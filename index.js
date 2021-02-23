const express = require('express');
var bodyParser = require('body-parser');
const namespaceRoutes = require('./routes/namespace.routes');
const releaseRoutes = require('./routes/release.routes');
const environmentRoutes = require('./routes/environment.routes');
const healthRoutes = require('./routes/health.routes');
const initK8s = require('./k8s.js').initK8s;
const getCoreApi = require('./k8s.js').getCoreApi;
const app = express();

var port = 8001;
if (process.env.IN_CONTAINER)
{
    port = 80;
}

app.use(bodyParser.text());
app.use('/namespace', namespaceRoutes);
app.use('/release', releaseRoutes);
app.use('/environment', environmentRoutes);
app.use('/health', healthRoutes);

initK8s(err => {
    if (err) {
        throw err;
    }

    app.listen(port, () => {
    console.log(`Express listening on at port ${port}`)
    });
});

app.get("/", (req, res) => {
    const statusText = `
        <p>Kube8s cluster: ${getCoreApi()._basePath}</p>
        <p>ManifestTemplateURL: ${process.env.ManifestTemplateURL}</p>
        `;
    res.send(statusText);
});