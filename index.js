const express = require('express');
const router = express.Router();
const namespaceRoutes = require('./routes/namespace.routes');
const releaseRoutes = require('./routes/release.routes');
const environmentRoutes = require('./routes/environment.routes');
const healthRoutes = require('./routes/health.routes');
const webhookRoutes = require('./routes/webhook.routes');
const initK8s = require('./k8s.js').initK8s;
const getCoreApi = require('./k8s.js').getCoreApi;

var port = 8001;
if (process.env.IN_CONTAINER)
{
    port = 80;
}

const app = express();
app.use(express.json());

// app.post("/webhook", (req, res) => {
//     console.log(req.body) // Call your action on the request here
//     res.status(200).end() // Responding is important
//   })

app.use(router);
app.use('/namespace', namespaceRoutes);
app.use('/release', releaseRoutes);
app.use('/environment', environmentRoutes);
app.use('/health', healthRoutes);
app.use('/webhook', webhookRoutes);


initK8s(err => {
    if (err) {
        throw err;
    }

    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`)
    });
});

app.get("/", (req, res) => {
    const statusText = `
        <p>Kube8s cluster: ${getCoreApi()._basePath}</p>
        <p>ManifestTemplateURL: ${process.env.ManifestTemplateURL}</p>
        <p>Isolated environment ManifestTemplateURL: ${process.env.IsolatedManifestTemplateURL}</p>
        <p>Target domain: ${process.env.TARGET_DOMAIN}</p>
        `;
    res.send(statusText);
});