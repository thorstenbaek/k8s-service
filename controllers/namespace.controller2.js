const getK8s = require('../k8s.js').getK8s;

exports.listNamespace = async (req, res) => {
    let namespaces = [];
    var response = await getK8s().api.v1.namespaces.get();    

    response.body.items.forEach(item => {
        namespaces.push(item.metadata.uid + " " + item.metadata.name);    
    });    

    res.send(namespaces);    
}

exports.createNamespace = async (req, res) => {    
    var name = req.params.name;
    console.log('Creating namespace' + name);

    var namespace = {
        metadata: {
            name: name,
        },
    };

    try {
        var response = await getK8s().api.v1.namespaces.post({body: namespace});
        
        console.log('Created namespace');
        console.log(response);          
        res.status(201).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

exports.getNamespace = async (req, res) => {
    var name = req.params.name;
    try {
        var namespace = await getK8s().api.v1.namespaces(name).get();
        res.status(302).send(namespace);
        
    } catch (error) {
        console.error(error);
        res.status(404).send(error);            
    }        
}

exports.updateNamespace = (req, res) => {
    res.status(301).json({message: "Not implemented!"});    
}

exports.deleteNamespace = async (req, res) => {    
    var name = req.params.name;
    try {
        await getK8s().api.v1.namespaces(name).delete();    
        res.status(202).json({message: `Successfully deleted namespace ${name}`});           

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }            
}
