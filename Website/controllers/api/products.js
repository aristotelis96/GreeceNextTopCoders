const db = require(appDir + '/models/products.js');
const auth = require('./authentication');
const util = require('util');

getProducts =  function (req, res) {
    var id = req.params.id;
    
    if(id!=null){ // if id was provided in URL (ex. GET /shops/id?..) return specific shop
        let apiResult = {};
        if(isNaN(id)){
            return res.status(400).send({message: "Bad request", err: "id is NaN"});
        }
        return db.returnProductById(id, (err, result)=>{
            if(err){
                return res.status(500).send({message: "internal server error", err: err})
            } else {
                if(result.length == 0){
                    return res.status(404).send({message: "Id not found"});
                }
                let withdrawn;
                if (result[0].withdrawn == 0) withdrawn = false; else withdrawn = true;
                apiResult = {
                    id: result[0].id,
                    name: result[0].name,
                    description: result[0].description,
                    category: result[0].category,
                    extra_data: result[0].extra_data,
                    tags: result[0].tags,
                    withdrawn: withdrawn
                }
                return res.status(200).send(apiResult);
            }
        })
    }
    let start = parseInt(req.query.start);
    if (isNaN(start))
        start = 0;
    let count = parseInt(req.query.count);
    if (isNaN(count))
        count = 20;
    let sort = req.query.sort;
    if (sort != 'id|ASC' && sort != 'name|ASC' && sort != 'name|DESC')
        sort = 'id|DESC';
    let status = req.query.status;
    if (status != 'ALL' && status != 'WITHDRAWN')
        status = 'ACTIVE';
    if(req.params.id!=null)
        status = 'ALL'; // if user requested specific product we need to search for everything
    
    (async () => {
        var result;
        try {
            let [column, AscDesc] = sort.split('|'); // <- nice 
            result = await (util.promisify(db.getAllProducts))({
                status: status,
                sort: { column: column, AscDesc: AscDesc }
            });
        } catch (e) {
            return res.status(500).send({message: "Internal server error", err: e});
        }
        apiResult = {};
        apiResult.start = start;
        apiResult.count = count;
        apiResult.total = result.length;
        apiResult.products = [];
        let i;
        let end = parseInt(start) + parseInt(count);
        for (i = start; (i < end) && (i < result.length); i++) {
            let withdrawn;
            if (result[i].withdrawn == 0) withdrawn = false; else withdrawn = true;
            apiResult.products.push({
                id: result[i].id,
                name: result[i].name,
                description: result[i].description,
                category: result[i].category,
                extra_data: result[i].extra_data,
                tags: result[i].tags,
                withdrawn: withdrawn
            });
        }
        return res.status(200).json(apiResult);
    })();
}
postProducts = function (req, res){
    /* Get body parameters */
    let name = req.body.name;
    if(name == null)
        return res.status(400).json({message: "Bad request"});
    let description = req.body.description;
    if(description == null)
        return res.status(400).json({message: "Bad request"});  
    let category = req.body.category;
    if(category == null)
        return res.status(400).json({message: "Bad request"});
    let extraData = req.body.extraData;
    if(extraData == null || extraData == "")
       extraData = null;
    /* get tags */
    let tags = req.body.tags;
    if(tags == null)
        return res.status(400).json({message: "Bad request"});
    tags = tags.replace(/"/g,'');
    tags = tags.replace(/\[/g,'');
    tags = tags.replace(/\]/g,'');
    tags = tags.split(',');
    let i = tags.indexOf('');
    if(i!=-1)
        tags.splice(i, 1);
    let withdrawn = req.body.withdrawn;
    if(withdrawn == null || withdrawn == "false")
        withdrawn = 0 ;
    else if (withdrawn == "true")
        withdrawn = 1 ;        
    
    db.InsertInProducts({
        name: name,
        category: category,
        description: description,
        extraData: extraData,
        withdrawn: withdrawn,
        tags: tags
    }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" , err: err.toString()});
        } else {
            return res.status(200).json({
                id: result.insertId,
                name: name,
                category: category,
                description: description,
                extraData: extraData,
                withdrawn: withdrawn,
                tags: tags
            })
        }
    })
}
putProducts = function (req, res) {
    /* Get id parameters */
    let productid = req.params.id;
    if(isNaN(productid)){
        return res.status(400).json({message: "Bad request", err: "id is NaN"});
    }
    /* Get body parameters */
    let name = req.body.name;
    if(name == null)
        return res.status(400).json({message: "Bad request"});
    let category = req.body.category;
    if(category == null)
        return res.status(400).json({message: "Bad request"});  
    let description = req.body.description;
    if(description == null)
        return res.status(400).json({message: "Bad request"});
    let extraData = req.body.extraData;
    if(extraData == null)
        return res.status(400).json({message: "Bad request"});
    /* get tags */
  
    let tags = req.body.tags;
    if(tags == null)
        return res.status(400).json({message: "Bad request"});
    tags = tags.replace(/"/g,'');
    tags = tags.replace(/\[/g,'');
    tags = tags.replace(/\]/g,'');
    tags = tags.split(',');
    let i = tags.indexOf('');
    if(i!=-1)
        tags.splice(i, 1);
    let withdrawn = req.body.withdrawn;
    if(withdrawn == null)
        return res.status(400).json({message: "Bad request"});
    db.updateProduct({
        id: productid,
        name: name,
        category: category,
        extraData: extraData,
        description: description,
        withdrawn: withdrawn,
        tags: tags
    }, (err, result)=>{
        if (err) {
            return res.status(500).json({ message: "Internal Server Error", err: err.toString()});
        } else {
            if(result.affectedRows == 0)
                return res.status(404).json({message: "Not Found", err: "id not found"})
            else
                return res.status(200).json({
                    id: productid,
                    name: name,
                    category: category,
                    extraData: extraData,
                    description: description,
                    withdrawn: withdrawn,
                    tags: tags
                })
        }
    });
}
patchProducts = async function (req, res) {
    /* Get id parameters */
    let productid = req.params.id;
    if(isNaN(productid)){
        return res.status(400).json({message: "Bad request", err: "id is NaN"});
    }
    let fields = {}; /* fields is parameters for db.updateShop */
    /* Get body parameters */
    let name = req.body.name;
    let fieldsToBeChanged = 0;
    if(name != null){
        fieldsToBeChanged++;
        fields.name = name;
    }
    let description = req.body.description;
    if(description != null){
        fieldsToBeChanged++;
        fields.description = description;
    }
    let category = req.body.category;
    if(category != null) {  
        fieldsToBeChanged++;        
        fields.category = category;
    }
    let extraData = req.body.extraData;
    if(extraData != null) {
       
        fieldsToBeChanged++;
        fields.extraData = extraData;
    }
    /* get tags */
    let tags = req.body.tags;
    
    if (tags != null) {
        tags = tags.replace(/"/g, '');
        tags = tags.replace(/\[/g, '');
        tags = tags.replace(/\]/g, '');
        tags = tags.split(',');
        let i = tags.indexOf('');
        if (i != -1)
            tags.splice(i, 1);
        fieldsToBeChanged++;
        fields.tags = tags;
    }
    let withdrawn = req.body.withdrawn;
    if(withdrawn != null){
        fieldsToBeChanged++;
        fields.withdrawn = withdrawn;
    }        
    if (fieldsToBeChanged != 1)
        return res.status(400).json({ message: "Bad request, sent too many fields" });
    /* Update shop and return updated shop */
    fields.id = productid;
    let promisify = util.promisify // use promisify function
    try {
        let UpdateRes = await (promisify(db.updateProduct))(fields);
        /* Check if no id was found to be updated */
        if (UpdateRes.affectedRows == 0)
            return res.status(404).json({ message: "Not Found", err: "id not found" })
        /* Fetch updated shop and reply */
        let updatedProduct = await (promisify(db.returnProductById))(productid);
        let withdrawn;
        if (updatedProduct[0].withdrawn == 0) withdrawn = false; else withdrawn = true;
        let apiResult = {
            id: updatedProduct[0].id,
            name: updatedProduct[0].name,
            description: updatedProduct[0].description,
            category: updatedProduct[0].category,
            extraData: updatedProduct[0].extraData,
            tags: updatedProduct[0].tags,
            withdrawn: withdrawn
        }
        return res.status(200).send(apiResult);
    }
    catch(e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.toString() });
    }
}
deleteProducts = function (req, res){
    let token = req.header('X-OBSERVATORY-AUTH')
    let data = auth.decode(token).data;
    let productid = req.params.id;
    if(isNaN(productid)){
        return res.status(400).send({message: "Bad request", err: "id is NaN"});
    }
    /* If administrator , delete shop permanently */
    if(data.email == "admin@admin") {
        db.deleteProducts(productid, (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: err
                })
            } else {
                if(result.affectedRows == 0)
                    return res.status(404).json({message: "Not Found", err: "id not found"})
                else
                    return res.status(200).json({message: 'OK'});                    
            }
        })
    }
    /* If not administrator just set Withdrawn = true */
    else {
        fields = {};
        fields.withdrawn = true;
        fields.id = productid;
        db.updateProduct(fields, (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: err
                })
            } else {
                if(result.affectedRows == 1)
                    return res.status(200).json({message: 'OK'});
                else
                    return res.status(404).json({message: "Not Found", err: "id not found"})
            }
        })
    }
}
module.exports = {getProducts, postProducts, putProducts, patchProducts, deleteProducts}