const express= require("express");
const router= express.Router();
const path= require("path");
const fs= require("fs");


//get the database connection
const connection= require("../connection/connection");

//multer upload
const upload= require("../multer/multer");

//passport
const passport= require("passport");


router.get("/addpost",authMiddleware(),(req,res,next)=>{
    res.render("./addpost");
    
});

router.post("/addpost", authMiddleware(),(req,res,next)=>{
      
 //since the data is being manage by multer
 //the request params will be available only
 //inside the upload function

 // if theres an error on the connection dont save anything
 if(connection.error == null || connection.error == undefined){
    upload(req, res, (error)=>{
        
        //check if theres data on the fields
        if(req.body.title== "" || req.body.description==""){
           //if not, render the form again 
           // with an error message
            res.render("./addpost", {
            error : "All input fields must contain data"
           }); 
        }else{
            //if theres data, here get the title and the description
            let $title= req.body.title;
            let $description = req.body.description;
           
            if(error){
                console.log(error);    
                res.render("./registration", {
                    err: "The image was not uploaded due an error: " + error 
                });
                
    
            }else{
                //manage what is going to happen
                // with the response parameters


                //get the filename of the image
                let $cover = req.file.filename;      
                
                //store the data in the database now
                //create the sql for INSERT
                let $sql="INSERT INTO nodemysql.posts SET ?"; 
                //create the set
                

                //if the user just registered the req.user.user_id wont be set
                //will be null in the table  
                if(req.user.user_id) {
                    $userId= req.user.user_id
                }else{
                    //else look for the id in the req.session.passport.user
                    $userId= req.session.passport.user
                }
                
                let $set= {
                    title: $title, 
                    description: $description,
                    thumb: $cover,
                    author: $userId 

                }
               
                // create the query
                let $query= connection.query($sql, $set, (err, result)=>{
                      //callback  
                      //check for errors
                      if(err) {
                          console.log("---- Error:" + err);

                          // if the image was still added to the uploads folder
                          // delete it
                          let $filePath= "./uploads/" + $cover;
                          fs.unlinkSync($filePath, (err)=>{
                              if(err){
                                   console.log("couldnt delete " + $cover + " image");
                              }else{
                                   console.log("Image was deleted successfully");
                              }
                                              
          
                          });
                        
                      }      
                      //redirect to index if there are no errors
                          res.redirect("./index");
                });     
             
               
            }
        }
        
      
    });
}else{
    // instead redirect and display the next error
    res.render("./addpost", {
        err: "The database could not be reached, no changes were saved."
    });
}
});



//authentication middleware
function authMiddleware(){
    return(req, res, next)=>{
        console.log(
          `req.session.passport: ${JSON.stringify(req.session.passport)}`
        );

        if(req.isAuthenticated()){ 
            return next();
            
        }else{
            res.redirect("/users/login");
        }
    }
}


module.exports= router;