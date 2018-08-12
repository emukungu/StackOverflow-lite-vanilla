window.onload = function(){
    var post = document.getElementById("post");
    var postForm = document.getElementById("postForm");
    var container = document.getElementsByClassName("flex-container2")[0];
    var close = document.getElementsByClassName("close")[0];

    post.onclick = function(){
        container.style.opacity= "0.1";
        postForm.style.display="block";
    }
    close.onclick = function(){
        container.style.opacity= "1";
        postForm.style.display="none";
    }
}

