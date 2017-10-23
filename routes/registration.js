const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");
const fs=require("fs");

//multer for the users
const upload= require("../multer/users");

//bcrypt
var bcrypt = require('bcrypt');
const saltRounds = 10;

//require passport
let passport= require("passport");

router.get("/users/register",(req,res)=>{
      
    res.render("./registration");
});



router.post("/users/register", (req,res, next)=>{
 

    
    if(connection.error == null || connection.error == undefined){

      
        upload(req, res, (error)=>{
         
       
            //check if theres data on the fields
            if(req.body.email== "" || req.body.password==""){
               //if not, render the form again 
               // with an error message
                res.render("./registration", {
                err : "All input fields must contain data"
               }); 
            }else{
                // if theres an error
                if(error){
                    console.log(error);    
                    res.render("./registration", {
                        err: "The image was not uploaded due an error: " + error 
                    });
        
                }else{
                //else form was sent correctly    
                let $username= req.body.username;
                let $email= req.body.email;
                let $password = req.body.password;


                //get the avatar
                let $avatar = req.file.filename;  

                //use bcrypt to hash the password
                var $hash = bcrypt.hashSync($password, saltRounds);        
                
                //add the user to the database
                let $sql="INSERT INTO nodemysql.users SET ?"; 
                //create the set
                let $set= {
                   username: $username,
                   email: $email,
                   password: $hash,
                   avatar:$avatar

                }
               
                // create the query add user
                let $query= connection.query($sql, $set, (err, result)=>{
                    //callback  
                    //check for errors
                    if(err) {
                        console.log("---- Error:" + err)
                        
                        //if somehow the image was uploaded look for it and delete it
                        let $filePath= "./users/avatars/" + $avatar;
                        fs.unlinkSync($filePath, (err)=>{
                            if(err){
                                 console.log("couldnt delete " + $avatar + " image");
                            }else{
                                 console.log("Image was deleted successfully");
                            }
                                            
        
                        });

                        res.render("./registration", {
                            err: "Unable to connect to the database, the user was not saved"
                        });   
                    }else{      
                        //login the user right away
                        //get the last added user's id    
                        let $login = "SELECT LAST_INSERT_ID() as user_id";    
                        
                        //retrieve the id
                        let $loginQuery= connection.query($login, (err, result)=>{
                            if(err){
                                console.log("---- Error:" + err);
                            }        
                        //get the user id inside the result
                        const user_id = result[0].user_id;
                        console.log(result[0].user_id);

                        //login using passport login()
                        req.login(user_id, ()=>{
                            //send a response if there are no errors
                            
                            res.redirect("/user/profile");    

                        });    
                        });
                      
                        
                    }
                });       
             
                }
            }
            
          
        });
    }else{
        // instead redirect and display the next error
        res.render("./registration", {
            err: "The database could not be reached, no changes were saved."
        });
    }
 
});

//passport serializeUser and deserializeUser
//passing the user_id
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

module.exports= router;