const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");

router.get("/index",(req,res)=>{
    //get all the posts
    let $sql ="SELECT * FROM nodemysql.posts ORDER BY id DESC";

    //create the query
    let $query= connection.query($sql, (err, result)=>{
        //check for erros
        if(err){
            console.log("-------ERROR: " + err);
        }


        
        let $posts=[];
        // check if the result is null (connection not created or not reached)
        if(result != null){
            //loop through all the records
            for(let i=0; i < result.length; i++){
                $posts.push(result[i]);  
            }
            //render the view
            res.render("index",{
                posts: $posts     
            });
        }else{
            res.render("index");
        }
        
     
        
         
    

    });
    
  
});
module.exports= router;