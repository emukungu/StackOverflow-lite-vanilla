window.onload = function(){
    var modal = document.getElementById('modal');
    var signin = document.getElementById('signin');
    var signup = document.getElementsByClassName("signupForm")[0];
    var close = document.getElementsByClassName("close")[0];
    var introduction = document.getElementsByClassName("introduction")[0];
    
    signin.onclick = function() {
        modal.style.display = "block";
        signup.style.display = "none";
        introduction.style.display = "none";
    }

    close.onclick = function(){
        modal.style.display = "none";
        signup.style.display = "block";
        introduction.style.display = "block";
    }

}