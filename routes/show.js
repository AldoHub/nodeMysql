const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");

router.get("/posts/:id",(req,res)=>{
    let $id= req.params.id;
    let $sql= "SELECT title, description, thumb, author , id FROM nodemysql.posts WHERE id= ?";
    let $x; // x depends on varous factors 
    
    //first check if the req.user is defined and not null
    //we need the property inside of it
    if(req.user != null || req.user != undefined){
        
        //if its set with a value get the value
        //which is the user_id 
        if(req.user.user_id){
            //if the user logs in using the login form this variable will be used
            $x = req.user.user_id
            
        }else if(req.session.passport.user){
            //if the user adds a post after registering and automatically login in
            //this variable will be set
            $x=req.session.passport.user;
        }else{
            //else make x explicit null
            //we will check for null in the show.pug
            //meaning the user doesnt own the post or is not authenticated
            $x = null
        }
        console.log(req.user.user_id);
        console.log(req.session.passport.user);
    }
        

    let $query= connection.query($sql, [$id], (err, result)=>{
        //check for errors
        if(err){
            console.log("-------ERROR: " + err);
        }


        // if no errors render with the data
        if(result != undefined || result != null){

                           
            let $userId= result[0].author; // this variable contains only the author
            let $data = result[0]; // this variable contains the entire object that the db returned
            
            //search for the username
            let $sqlUser= "SELECT username FROM nodemysql.users WHERE id= ?"; 
            let $findUsername= connection.query($sqlUser, [$userId], (err, result)=>{

                if(err){
                    console.log(err)
                }else{
                    res.render("show", {
                        user: result[0], // username only
                        post: $data, // entire post object
                        x: $x    // x defined with the id or null
                    });    

                }


            });    

            

        }else {
            res.send("sorry an error ocurred");
        }

        
        
       
    });

});
module.exports= router;