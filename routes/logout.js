const express= require("express");
const router= express.Router();
const passport = require("passport");


router.get("/users/logout", (req, res, next)=>{
    //logoit the current user
    req.logout();
    //redirect
    res.redirect("/index");
});

module.exports = router;
