const express= require("express");
const router= express.Router();

// bring in the connection
const connection= require("../connection/connection");

router.get("/user/profile", authMiddleware(),(req,res)=>{
    //a property called user_id is being passed by passport
    //on the user object, which contains the current user id
    let $id = req.user.user_id || req.session.passport.user;
   
    
    //need to find the user data inside the database
    let $userId = "SELECT * from nodemysql.users WHERE id = ?";
     
    let $queryUserId = connection.query($userId, [$id], (err, result)=>{
        if(err){
            console.log(err);
            //if theres an error redirect
            res.redirect("/login");
        } else{  
           
                         
                // send the entire object to manage the data on the view
                // this is not the same as the user inside passport
                res.render("./dashboard", {
                    user: result[0]
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


module.exports= router