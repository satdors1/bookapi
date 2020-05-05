const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const port = 6000;
app.use(bodyParser.json())
require('./routes')(app);

app.listen(port,()=>{ console.log("server is running at port " + port); })