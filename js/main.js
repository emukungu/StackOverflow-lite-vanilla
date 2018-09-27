//BUSINESS LOGIC
let url = 'http://localhost:5000/api/v1';

const signup = (signup_data, form) =>{
    /*Signup a user*/
    fetch(url + '/auth/signup',{
        method:"POST",
        mode: "cors",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(signup_data)
    })
    .then((response) =>{
        if(response.status == 201){
            return response.json();
        }
        else if(response.status == 400){
            alert("Fill in the missing fields")
        }
        else if(response.status == 403){
            alert("Please sign in instead!")
        }
    } 
    ).then(value =>{
        alert(value.message)
        signuploginHandler(form)
    })
    .catch((error)=>{
        return error
    })}

const login = (login_data)=>{
    /*Login a user*/
    fetch(url + '/auth/login', {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(login_data)
    })
    .then((response) =>{
        if(response.status == 200){
            return response.json();
        }
        else if(response.status == 400){
            alert("Fill in the missing fields")
        }
        else if(response.status == 405){
            alert("User doesnot exist on this platform")
        }
    })
    .then((res) => {let data = res.results
        localStorage.setItem("token", data.token)
        localStorage.setItem("username", data.username)
        window.location.replace("allQuestions.html")}
    )
    .catch((error) => {return error})
}


let signupHandler = (form)=>{
     // This function retrieves the user input data for signing up a user
    let usernameSignup = form.usernameSignup.value
    let emailSignup = form.emailSignup.value
    let passwordSignup = form.passwordSignup.value

    let signup_data = {username: usernameSignup,
                    email: emailSignup,
                    password: passwordSignup}
    signup(signup_data, form)

}

let loginHandler = (form)=>{
     // This function retrieves the user input data for loging in a user
    let usernameLogin = form.usernameLogin.value
    let passwordLogin = form.passwordLogin.value
    let login_data = {username: usernameLogin,
        password: passwordLogin}

    login(login_data)
}

let signuploginHandler = (form)=>{
    // This function attaches a token to a signuped up user
    let usernameSignup = form.usernameSignup.value
    let passwordSignup = form.passwordSignup.value
    let login_data = {username: usernameSignup,
       password: passwordSignup}

   login(login_data)
}


//USER LOGIC
window.onload = function(){
    var modal = document.getElementById('modal');
    var signinTop = document.querySelector('#signinTop')
    var signinBottom = document.querySelector('#signinBottom')
    var signup = document.getElementsByClassName("signupForm")[0];
    var close = document.getElementsByClassName("close")[0];
    var introduction = document.getElementsByClassName("introduction")[0];
    var inputFields = document.querySelectorAll("input")
    
    
    signinTop.addEventListener("click", function() {
        modal.style.display = "block";
        signup.style.display = "none";
        introduction.style.display = "none";
    })

    signinBottom.addEventListener("click", function() {
        modal.style.display = "block";
        signup.style.display = "none";
        introduction.style.display = "none";
    })
    
    close.addEventListener("click", function(){
        modal.style.display = "none";
        signup.style.display = "block";
        introduction.style.display = "block";
    })

    const signupForm = document.querySelector(".signupForm #formFields")
    const loginForm = document.querySelector(".modal #formFields")
    
    signupForm.addEventListener("submit", (event)=>{
        event.preventDefault()
        signupHandler(signupForm) 
        
    } )
    
    loginForm.addEventListener("submit", (event)=>{
        event.preventDefault()
        loginHandler(loginForm)
    })
   
}
