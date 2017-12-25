const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");

//require fs to delete image on update
const fs= require("fs");

//multer upload
const upload= require("../multer/multer");

router.get("/posts/edit/:id", authMiddleware(),(req,res, next)=>{
    
    let $id= req.params.id;
    let $requestId ="";
    //user must be login so the variable shouldnt be null or undefined
    //NOTE: after first registering user_id variable wont be set
    //lets check and assign the passport user value if needed
    if(req.session.passport.user.user_id == null){
       $requestId= req.session.passport.user; 
    }else{
       $requestId = req.session.passport.user.user_id;
    }
    console.log("DATA AFTER USER MANUALLY LOGIN");    
    console.log($requestId);
    console.log("PASSPORT USER AFTER REGISTERING:");
    console.log(req.session.passport.user);
    
    //we need to find the posts author only
    let $sqlAuthor= "SELECT author FROM nodemysql.posts WHERE id= ?";
    let $queryAuthor= connection.query($sqlAuthor, [$id], (err, result)=>{
        //check for errors
        if(err){
            console.log("-------ERROR: " + err);
        }

        console.log("RESULT");
        console.log(result[0].author);

        //check if the author matches the req.user.user_id
        if(result[0].author == $requestId ){
           
            //if so just retrieve the form view
            let $sql= "SELECT title, description, thumb, author , id FROM nodemysql.posts WHERE id= ?";
            let $query= connection.query($sql, [$id], (err, result)=>{
                //check for errors
                if(err){
                    console.log("-------ERROR: " + err);
                }
                // if no errors render with the data
                res.render("editpost", {
                    post: result[0]    
                });
             
            });
        
        }else{
            res.redirect("/index");
        }    
    
     
    });

    
   
 
});


router.post("/posts/edit/:id", authMiddleware() ,(req,res, next)=>{
      
    
    upload(req, res, (error)=>{
    
    if(error){
        console.log(error);    
        res.render("./editpost", {
            error: "an error ocurred: " + error 
        });

    }else{
        //manage what is going to happen
        // with the response parameters


        //get the filename of the image
             
        let $id= req.params.id;
        let $title=req.body.title;
        let $desc= req.body.description;
        let $hidden= req.body.hidden;
             
        let $cover="";
        
            //if the file input comes as undefined
            if(req.file == undefined){
                //set the data to the hidden input which is the already uploaded image
                $cover= $hidden;    
            }else{
                //else set the value to the new file
                $cover=req.file.filename;

                //delete the previous image here
                let $filePath= "./uploads/" + $hidden;
                fs.unlinkSync($filePath, (err)=>{
                     if(err){
                         console.log("couldnt delete " + $hidden + " image");
                     }
                                    

                });

                
            }
            
            
       
        //store the data in the database now
        //create the sql for INSERT
        let $sql="UPDATE nodemysql.posts SET title = '"+ $title +"', description='"+ $desc+"', thumb='"+ $cover +"' WHERE id = ?"; 
        //create the set
             
        // create the query
        let $query= connection.query($sql, [$id], (err, result)=>{
              //callback  
              //check for errors
              if(err) {
                  console.log("---- Error:" + err)
              }      
              res.redirect("/posts/"+ $id);
        });     
     
     
    }
 
    });
    
    
   

   
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