//BUSINESS LOGIC
let url = 'http://localhost:5000/api/v1';

const signup = (signup_data) =>{
    /*Signup a user*/
    fetch(url + '/auth/signup',{
        method:"POST",
        mode: "cors",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(signup_data)
    })
    .then((response) =>{
            return response.json();} 
    ).then(value =>{alert(value.message)})
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
    .then((response) =>{return response.json();})
    .then((data) => {
        localStorage.setItem("token", data.token)
        console.log(data.token)
        window.location.replace("home.html")}
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
    signup(signup_data)
}

let loginHandler = (form)=>{
     // This function retrieves the user input data for loging in a user
    let usernameLogin = form.usernameLogin.value
    let passwordLogin = form.passwordLogin.value
    let login_data = {username: usernameLogin,
        password: passwordLogin}

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
