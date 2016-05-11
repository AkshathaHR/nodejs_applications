var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
var mysql = require('mysql');

// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  var html = '<form action="/" method="post">' +
               '<h1> Employee Form </h1>' +
               '<br>' +  
               'Enter your name:' +
               '<input type="text" name="empName" placeholder="Name" />' +
               '<br>' +
			   'Enter your empid:' +
               '<input type="text" name="emp_id" placeholder="Employee id" />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/', function(req, res){
  var empName = req.body.empName;
  var empId = req.body.emp_id;
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
			var insertRecord = 'INSERT INTO employee(name,empid) VALUE(?,?)';
			 con.query(insertRecord,[empName,empId],function(err,rows){
			  if(err) throw err;

			  console.log('row  inserted successfully:\n');
			  console.log(rows);
			});
			
			var selectQuery = 'SELECT * FROM employee '
con.query(
    selectQuery,
    function select(error, results) {
        if(error) {
            console.log(error);
            con.end();
            return;
        }

        if(results.length > 0) {
            console.log(results);
			  var html = 'Hello: ' + empName + '.<br>' +
			'Total number of employee :'+results.length+'.<br>'+
             '<a href="/">Try again.</a>';
  res.send(html);
        } else {
            console.log('No data');
        }
        con.end();
    });
  

});

app.listen(8000);