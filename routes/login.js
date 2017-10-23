const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");
const passport = require("passport");

router.get("/users/login",(req,res)=>{
    res.render("./login");
});

//auth the user using the local strategy
router.post("/users/login", passport.authenticate(
    "local", {
        successRedirect: "/user/profile",
        failureRedirect: "/users/login"
    }

));
module.exports= router;