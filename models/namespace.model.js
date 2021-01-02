const k8s = require('../k8s.js');

exports.listNamespace = async() => {
    let result = [];
    var namespaces = await k8s.getCoreApi().listNamespace();

    namespaces.body.items.forEach(namespace => {
        result.push(namespace.metadata.uid + " " + namespace.metadata.name);    
    }); 
    
    return result;
}

exports.createNamespace = async (name) => {
    console.log('Creating namespace ' + name);

    var namespace = {
        metadata: {
            name: name,
        },
    };

    try {
        var createdNamespace = await k8s.getCoreApi().createNamespace(namespace);
        
        console.log('Created namespace');
        console.log(createdNamespace);          
        return {body: createdNamespace};
        
    } catch (error) {
        console.error(error); 
        return {error: error};       
    }
}

exports.getNamespace = async (name) => {
    try {
        var namespace = await k8s.getCoreApi().readNamespace(name);
        return {body: namespace};        
        
    } catch (error) {
        console.error(error);
        return {error: error};       
    }   
}

exports.deleteNamespace = async (name) => {
    try {
        await k8s.getCoreApi().deleteNamespace(name, {});    
        const message = `Successfully deleted namespace ${name}`;
        console.log(message);
        return {message: message};        

    } catch (error) {
        console.log(error.body.message);
        return {error: error.body.message};                
    }      
}