import express from "express";
import k8s from "./k8s.js";
import EnvironmentRouter from "./routes/environmentRouter.js";
import HealthRouter from "./routes/healthRouter.js";
import NamespaceRouter from "./routes/namespaceRouter.js";
import WebHookRouter from "./routes/webhookRouter.js";

var port = 8001;
if (process.env.IN_CONTAINER)
{
    port = 80;
}

const app = express();
app.use(express.json());

new HealthRouter(app);
new NamespaceRouter(app);
new EnvironmentRouter(app);
new WebHookRouter(app);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
});

app.get("/", (req, res) => {
    const statusText = `
        <p>Kube8s cluster: ${k8s.coreApi._basePath}</p>        
        <p>ManifestTemplateURL: ${process.env.ManifestTemplateURL}</p>
        <p>Isolated environment ManifestTemplateURL: ${process.env.IsolatedManifestTemplateURL}</p>
        <p>Target domain: ${process.env.TARGET_DOMAIN}</p>
        `;
    res.send(statusText);
});