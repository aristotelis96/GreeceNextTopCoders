module.exports = output = function(req,res){
    results = [
        {shop: 'A', product:'AA', price: 1},{shop: 'B', product:'BB', price:2}
    ]
    res.render('output.ejs',{login: true,name:'catch', title: 'a', results:results})
}