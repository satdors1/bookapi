var AWS = require('aws-sdk');
const config=require('./config/keys');
const awsconfig = config.awsconfig;
AWS.config.update(awsconfig);
const docClient = new AWS.DynamoDB.DocumentClient();
var params ={
    TableName: "Book",
    Key: {
       
    }
    
   };

module.exports = (app) => {
   
    app.get("", (req,res)=> {
        res.send({"title":"Books Api entry point"});
    });
    app.get("/books", (req,res,next)=> { 
                docClient.scan(params,function(err,data) {
                    if(err)
                    {                        
                        res.json(err);
                    }
                    else
                    { 
                        res.json(data);
                    }
                }
        );
    });
 

    app.get('/book/:bookUuid',(req,res) =>{
       
        
        var newparams ={
            TableName: "Book",
            Key:{
                "uuid": parseInt(req.params.bookUuid)
            },
        }
        docClient.get(newparams,function(err,data) { 
            if(err){
                res.json(err);
            }
            else{
                res.json(data);
            }
            
            } )
        
     });
     app.put('/book/:bookUuid/update',(req,res) =>{ 
        var updateparams = {
            TableName: "Book",
            Key: { "uuid": parseInt(req.params.bookUuid) },
            UpdateExpression: "SET #bn = :BookName,#authname=:AName,#reDate=:relDate",
            ExpressionAttributeValues: {
                ":BookName":JSON.stringify(req.body.name, null, 2) ,
                ":AName": JSON.stringify(req.body.authorName, null, 2) ,
                ":relDate": parseInt(req.body.releaseDate)
            },
            ExpressionAttributeNames:{
                "#bn":"name",
                "#authname":"authorName",
                "#reDate": "releaseDate"

            },
            ReturnValues: "UPDATED_NEW"
    
        };
        docClient.update(updateparams,function(err,data) { 
            if(err){
                res.json(err);
            }
            else{
                res.json(data);
            }
            
            } )

        console.log(req.params);
     });
    app.put('/book/add',(req,res)=>{


        var input={
            "uuid": req.body.uuid,
            "authorName":  JSON.stringify(req.body.authorName, null, 2) ,
            "name":JSON.stringify(req.body.name, null, 2) ,
            "releaseDate":parseInt(req.body.releaseDate)
        }
        var params ={
            TableName: "Book",
            Item:input
           
        };
        docClient.put(params,function(err,data) { 
            if(err){
                res.json(err);
            }
            else{
                res.json({"success": "New book added successfully"});
            }
            
            } )
         
     }) 
  

     app.delete('/book/delete/:bookUuid',(req,res)=>{

        var params ={
            TableName: "Book",
            Key:{
                "uuid": parseInt(req.params.bookUuid)
            }
           
        };
        
        docClient.delete(params,function(err,data) { 
            if(err){
                res.json(err);
            }
            else{
                res.json({"success": "Book has been removed successfully"});
            }
            
            } )
         
     }) 


}
