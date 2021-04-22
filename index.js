import express from "express";
import namespaceRoutes from "./routes/namespace.routes.js";
import releaseRoutes from "./routes/release.routes.js";
import environmentRoutes from "./routes/environment.routes.js";
import healthRoutes from "./routes/health.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import {initK8s, getCoreApi} from "./k8s.js";

const  router = express.Router();

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