//BUSINESS LOGIC
let url ='http://localhost:5000/api/v1'

let tableDisplaysPostedQns = (data) =>{
    let allquestionsTable = document.querySelector("#allquestionsTable")
    let row = document.createElement("tr") 
    row.innerHTML = `<td><a href='questionDetails.html' data-qnId = ${data[3]}>
    ${data[1]} </a></td><td>  ${data[0]}</td><td>${data[2]}</td>`
    allquestionsTable.appendChild(row) 
}

let tableDisplaysAllQns = data =>{
    let allquestionsTable = document.querySelector("#allquestionsTable")
    let row = document.createElement("tr")
    row.innerHTML = `<td><a href='questionDetails.html'>${data[1]}</a></td><td>${data[0]}</td><td>${data[2]}</td>`
    allquestionsTable.appendChild(row) 

}
const postQuestion = (data) =>{
    fetch(url + '/questions', {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)
    })
    .then((response) =>{return response.json()})
    .then((data) => {
        let res= data.Results
        tableDisplaysPostedQns(res)
        window.location.reload()   
    })
    .catch((error) => {return error})  
}

const getAllQuestions = ()=>{
    fetch(url + '/questions',{
        method:"GET",
        mode:'cors',
        headers:{"Content-Type":"application/json"}
    } )
    .then((response) => {return response.json()})
    .then((data) => {let res = data.Results 
        res.forEach(element =>{
            tableDisplaysAllQns(element)
        })                 
        })
    .catch((error) => {return error})
}
  
let postQuestionHandler = (form)=>{
    let title = form.title.value
    let description = form.description.value
    let question_data = {title: title,
        description: description}

    postQuestion(question_data)
}


//USER LOGIC
window.onload = function(){
    var post = document.getElementById("post");    
    var postForm = document.getElementById("postForm");
    var container = document.getElementsByClassName("flex-container2")[0];
    var closeHome = document.getElementById("closeHome");
    var comment = document.getElementById("comment");
    let specificQn = document.querySelector("a")[0]
  
    post.addEventListener("click", function(){
        container.style.opacity= "0.1";
        postForm.style.display="block";
        comment.style.opacity= "0.1";
    })
    closeHome.addEventListener("click", function(){
        container.style.opacity= "1";
        postForm.style.display="none";
        comment.style.opacity= "1";
    })

    const postQuestionForm = document.querySelector("#postForm #formFields")
    postQuestionForm.addEventListener("submit", (event)=>{
        event.preventDefault()
        postQuestionHandler(postQuestionForm)
    })
    
    getAllQuestions()

}

