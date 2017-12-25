
$(function(){
   //on load check if the window is determined size
    if(window.innerWidth < 729 ){
        $(".menu").next("UL").slideUp();
    }else{
        
        $(".menu").next("UL").slideDown();
        
    }



    //check if the window is determined height and react on resize 
    $(window).on("resize", ()=>{
        if(window.innerWidth < 729 ){
            $(".menu").next("UL").slideUp();
        }else{
            $(".menu").next("UL").slideDown();
        }

    });
    
    $("#cover").on("change", (function(){
        readURL(this);
    }));

    $("body").on("click", ".menu", ()=>{
       $(".menu").next("UL").slideToggle();
    });




});





function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
           $('#new-cover').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}
