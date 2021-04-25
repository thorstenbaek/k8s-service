import k8s from "../k8s.js";

export default class NamespaceModel {
    async listNamespace() {
        let result = [];
        var namespaces = await k8s.coreApi.listNamespace();

        namespaces.body.items.forEach(namespace => {
            result.push(namespace.metadata.uid + " " + namespace.metadata.name);    
        }); 
        
        return result;
    }

    async createNamespace(name) {
        console.log(`Creating namespace: ${name}`);

        var namespace = {
            metadata: {
                name: name,
            },
        };

        try {
            var createdNamespace = await k8s.coreApi.createNamespace(namespace);
            
            console.log(`Created namespace: ${createdNamespace.body.metadata.name}`);
            return {body: createdNamespace};
            
        } catch (error) {
            console.error(error); 
            return {error: error};       
        }
    }

    async getNamespace(name) {
        try {
            var namespace = await k8s.coreApi.readNamespace(name);
            return {body: namespace};        
            
        } catch (error) {
            console.error(error);
            return {error: error};       
        }   
    }

    async deleteNamespace(name) {
        try {
            await k8s.coreApi.deleteNamespace(name, {});    
            const message = `Successfully deleted namespace ${name}`;
            console.log(message);
            return {message: message};        

        } catch (error) {
            console.log(error.body.message);
            return {error: error.body.message};                
        }      
    }
}