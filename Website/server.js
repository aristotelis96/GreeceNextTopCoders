const https = require('https');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const config = require('./config/config.js');
const session = require('express-session');

//initialize database pool
const db = require('./models/index');
db.initialize();

//global app Dir
global.appDir = config.app.appDir;

// configure middleware
global.app = app;

app.set('port', config.app.port); // set express to use this port
app.set('views', config.app.views); // set express to look in this folder to render our view
app.set('view engine', config.app.viewEngine); // configure template engine

app.use(express.json());       // to support JSON-encoded bodies.
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies
app.use(fileUpload()); // configure fileupload

app.use(express.static(path.join(appDir, 'public'))); // configure express to use public folder

//session configuration
app.use(session(config.session));

/*header for cross origin if needed. Probably will not be used
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

// routes for the app. Check routing.js for routes
var router = require('./routing/routing.js');
app.use('/', router);

// HTTPS
https.createServer({
    key: fs.readFileSync('./../ssl/server.key'),
    cert: fs.readFileSync('./../ssl/server.crt')},
    app).listen(app.get('port'), () => {
    console.log(`Server running on port: ${config.app.port}`);});

/* Redirect http requests to https */
const http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);

var api = express();
var apiRouter = require('./routing/apiRouting.js');
api.use('/observatory/api', apiRouter);
https.createServer({
    key: fs.readFileSync('./../ssl/server.key'),
    cert: fs.readFileSync('./../ssl/server.crt')},
    api).listen(config.app.apiPort, () => {
    console.log(`API running on port: ` + config.app.apiPort);});
