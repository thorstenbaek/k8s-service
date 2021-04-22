import {getCoreApi} from "../k8s.js";

export const listNamespace = async() => {
    let result = [];
    var namespaces = await getCoreApi().listNamespace();

    namespaces.body.items.forEach(namespace => {
        result.push(namespace.metadata.uid + " " + namespace.metadata.name);    
    }); 
    
    return result;
}

export const createNamespace = async (name) => {
    console.log('Creating namespace ' + name);

    var namespace = {
        metadata: {
            name: name,
        },
    };

    try {
        var createdNamespace = await getCoreApi().createNamespace(namespace);
        
        console.log('Created namespace');
        console.log(createdNamespace);          
        return {body: createdNamespace};
        
    } catch (error) {
        console.error(error); 
        return {error: error};       
    }
}

export const getNamespace = async (name) => {
    try {
        var namespace = await getCoreApi().readNamespace(name);
        return {body: namespace};        
        
    } catch (error) {
        console.error(error);
        return {error: error};       
    }   
}

export const deleteNamespace = async (name) => {
    try {
        await getCoreApi().deleteNamespace(name, {});    
        const message = `Successfully deleted namespace ${name}`;
        console.log(message);
        return {message: message};        

    } catch (error) {
        console.log(error.body.message);
        return {error: error.body.message};                
    }      
}