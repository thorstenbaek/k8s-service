/*import assert from "assert";
import sinon from "sinon";
import fetch from "node-fetch";
import {createEnvironment} from "../models/environmentModel.js";
import NamespaceModel from "../models/namespaceModel.js";*/

const manifestTemplate = `
    # Source: SandBox/charts/dips-fhir-service2/templates/deployment.yaml
    metadata:
    name: RELEASE-NAME-dips-fhir-service2
    labels:
        app.kubernetes.io/version: "1.0.0"
        app.kubernetes.io/managed-by: Helm
    spec:
    replicas: 1
    selector:
        matchLabels:
        app.kubernetes.io/name: dips-fhir-service2
        app.kubernetes.io/instance: RELEASE-NAME
    template:
        metadata:
        labels:
            app.kubernetes.io/name: dips-fhir-service2
            app.kubernetes.io/instance: RELEASE-NAME
        spec:
        serviceAccountName: default
        securityContext:
            {}
        containers:
            - name: dips-fhir-service2
            securityContext:
                {}
            image: "thorstenbaek/dips.fhir.service:v1.0.0.15"
            imagePullPolicy: Always
            env:            
                - name: CONFIGURATION_SERVICE_URI
                value: "sandbox-dips-ehr-configuration"
                - name: CONNECTION_STRING
                value: "server=postgres-postgresql.postgres.svc.cluster.local;database=fhirbase;user id=postgres;password=postgres;"
                - name: ENVIRONMENT
                value: "dips-ehr-app.DOMAIN"
            ports:
                - name: http
                containerPort: 80                                                                                
                protocol: TCP          
            resources:
                {}
    ---`;

const manifest = `
    # Source: SandBox/charts/dips-fhir-service2/templates/deployment.yaml
    metadata:
    name: test-dips-fhir-service2
    labels:
        app.kubernetes.io/version: "1.0.0"
        app.kubernetes.io/managed-by: Helm
    spec:
    replicas: 1
    selector:
        matchLabels:
        app.kubernetes.io/name: dips-fhir-service2
        app.kubernetes.io/instance: test
    template:
        metadata:
        labels:
            app.kubernetes.io/name: dips-fhir-service2
            app.kubernetes.io/instance: test
        spec:
        serviceAccountName: default
        securityContext:
            {}
        containers:
            - name: dips-fhir-service2
            securityContext:
                {}
            image: "thorstenbaek/dips.fhir.service:v1.0.0.15"
            imagePullPolicy: Always
            env:            
                - name: CONFIGURATION_SERVICE_URI
                value: "sandbox-dips-ehr-configuration"
                - name: CONNECTION_STRING
                value: "server=postgres-postgresql.postgres.svc.cluster.local;database=fhirbase;user id=postgres;password=postgres;"
                - name: ENVIRONMENT
                value: "dips-ehr-app.test.no"
            ports:
                - name: http
                containerPort: 80                                                                                
                protocol: TCP          
            resources:
                {}
    ---`;
/*
describe('Environment Model Tests', () => {
    describe('Create', () => {
        it('create environment', async () => {            
            const textObject = manifestTemplate;

            var responseObject = {"status":'200',text: () => { return textObject }};
            sinon.stub(fetch, 'Promise').resolves(Promise.resolve(responseObject));
            
            var namespaceMock = sinon.mock(NamespaceModel);
            namespaceMock.expects('createNamespace')
                .once()
                .withArgs('test')            
                .resolves(Promise.resolve('namespace'));                 
        
            await createEnvironment('test');
            
            namespaceMock.verify();
            namespaceMock.restore();

            releaseMock.verify();
            releaseMock.restore();
        });
    });  
});*/