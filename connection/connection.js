const mysql= require("mysql");

const connection = mysql.createConnection({
    multipleStatements: true,
    host     : 'localhost', // your host
    user     : 'root', // mysql user
    password : 'password', // mysql password
    //database : 'nodemysql' // will be created automatically
  });
 
module.exports = connection;