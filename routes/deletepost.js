const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");
const fs= require("fs");


router.get("/posts/delete/:id",authMiddleware(),(req, res, next)=>{
    let $id=req.params.id;    
    
    //user must be login so the variable shouldnt be null or undefined
    let $requestId = req.session.passport.user.user_id;
    console.log("REQUEST");    
    console.log($requestId);
    

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
           
                // get the image from the post before is deleted
                let $sql = "SELECT thumb FROM nodemysql.posts WHERE id= ?";
                let $query= connection.query($sql,[$id], (err, result)=>{
                    //check for errros
                    if(err){
                        console.log("-------ERROR: " + err);
                    }
                    let $filePath= "./uploads/" + result[0].thumb;
                    fs.unlinkSync($filePath, (err)=>{
                        if(err){
                            console.log("couldnt delete " + result[0].thumb + " image");
                        }
                                        
                        res.send("image should be deleted");
                        
                    });

                    
                });


                let $deleteSql = "DELETE FROM nodemysql.posts WHERE id= ?";
                
                let $deleteQuery= connection.query($deleteSql,[$id], (err, result)=>{
                    //check for errros
                    if(err){
                        console.log("-------ERROR: " + err);
                    }
                    res.redirect("/index");

                });
        


                
        }else{
            res.redirect("/index");
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