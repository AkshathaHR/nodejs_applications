var http = require('http'),
    fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');



fs.readFile('/nodejsPrograms/index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {

	console.log("received client request");
	var clientRequestPath = url.parse(request.url).pathname;
	switch(clientRequestPath){
			 case '/emp':
			console.log("form submited");
			
			var con = mysql.createConnection({
			  host: "localhost",
			  user: "root",
			  password: "",
			  database: "tismo"
			});
			
			con.connect(function(err){
			  if(err){
				console.log('Error connecting to Db');
				return;
			  }
			  console.log('Connection established');
			});
			
			
			
			app.use(express.bodyParser());
			
			app.post("/emp", function(req, res){
			 var insertRecord = 'INSERT INTO employee(name,empid) VALUE(?,?)';
			 con.query(insertRecord,[req.body.employee_name,req.body.employee_id],function(err,rows){
			  if(err) throw err;

			  console.log('row  inserted successfully:\n');
			  console.log(rows);
			});
			});
			
			break;		
	}
    
	
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});
console.log("Listening to 127.0.0.1:8000 ");