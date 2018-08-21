window.onload = function(){
    var post = document.getElementById("post");    
    var postForm = document.getElementById("postForm");
    var container = document.getElementsByClassName("flex-container2")[0];
    var close = document.getElementsByClassName("close")[0];
    var comment = document.getElementById("comment");
    
    post.onclick = function(){
        container.style.opacity= "0.1";
        postForm.style.display="block";
        comment.style.opacity= "0.1";
    }
    close.onclick = function(){
        container.style.opacity= "1";
        postForm.style.display="none";
        comment.style.opacity= "1";
    }
}

