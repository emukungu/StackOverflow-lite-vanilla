//BUSINESS LOGIC
let url =`http://localhost:5000/api/v1`

let tableDisplaysPostedQns = (data) =>{
    // This function displays every post and assigns questionId attribute
    let allquestionsTable = document.querySelector("#allquestionsTable")
    let row = document.createElement("tr") 
    row.innerHTML = `<td><a href="#">${data.title} </a></td><td>${data.username}</td><td>${data.date_created}</td>`
    allquestionsTable.appendChild(row) 
}

let tableDisplaysAllQns = data =>{
    // The function displays all questions in a table
    let allquestionsTable = document.querySelector("#allquestionsTable")
    let row = document.createElement("tr")
    row.innerHTML = `<td><a href="#">${data.title}</a></td><td>${data.username}</td><td>${data.date_created}</td>`
    allquestionsTable.appendChild(row)      
}

let tableDisplaysSpecificqn =(data) =>{
    let title = document.querySelector("#question h2")
    title.innerHTML = `${data.title}`
    let description = document.querySelector("#describe")
    description.innerHTML = `${data.desc}` //`${data.Answers[2]}`${data.Answers[1]} ${data.Answers[0]}
    let answers = document.querySelector(".answers")
    let row = document.createElement("tr")
    row.innerHTML = `<td class="td1">sure</td><td>yes</td>
                    <td>
                        <div><button type="button" id="delete">UPVOTE</button><button type="button" id="delete">DOWNVOTE</button></div>
                    </td>`
    answers.appendChild(row)
    
}
const postQuestion = (data) =>{
    //This function add a question to the database
    fetch(url + `/questions`, {
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
        alert(data.Successful) 
        window.location.reload()
          
    })
    .catch((error) => {return error})  
}

const getAllQuestions = ()=>{
    //This function fetch all questions from the database
    fetch(url + `/questions`,{
        method:"GET",
        mode:'cors',
        headers:{"Content-Type":"application/json"}
    } )
    .then((response) => {return response.json()})
    .then((data) => {
        let res = data.Results 
        res.forEach(element =>{
            tableDisplaysAllQns(element)
            })  
        let x = document.querySelectorAll("#allquestionsTable tr td a")        
        for(let i = 0; i<x.length; i++){
            x[i].addEventListener("click", ()=>{
                let qnid = `${res[i].qn_id}`
                getSpecificQuestion(qnid)                
            }) }            
        })
    .catch((error) => {return error})
}
  
const getSpecificQuestion = (questionId) => {
    // This function retrieves a specific question details and answers
    fetch(url + `/questions/${questionId}`)
    .then((response) => {return response.json()})
    .then((data) => {
        localStorage.setItem("title", data.Question.title)
        localStorage.setItem("desc", data.Question.description)
        localStorage.setItem("qn", data.Question.qn_id)
        localStorage.setItem("answers", data.Answers)
        window.location.href="questionDetails.html"
        // tableDisplaysSpecificqn(data)
    })        
    .catch((error) => {return error})
}

const postAnswer = (questionId, ansData) =>{
    // This function add a question's answer to the database
    fetch(url + `/questions/${questionId}/answers`, {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)
    })
    .then((response) =>{return response.json();})
    .then((data) => {console.log(data)})
    .catch((error) => {return error})  
}
const deleteqn = (questionId)=>{

}


let postQuestionHandler = (form)=>{
    // This function retrieves the user input data for posting a question
    let title = form.title.value
    let description = form.description.value
    let question_data = {title: title,
        description: description}

    postQuestion(question_data)
}

let postAnswerHandler = (questionId, form)=>{
    // This function retrieves the user input data for posting a question's answer
    let answer = form.answer.value
    let answer_data = {answer: answer}

    postAnswer(questionId, answer_data)
}



//USER LOGIC
window.onload = function(){
    var post = document.getElementById("post");    
    var postForm = document.getElementById("postForm");
    var container = document.getElementsByClassName("flex-container2")[0];
    var closeHome = document.getElementById("closeHome");
    var comment = document.getElementById("comment");

    getAllQuestions()

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
        let postForm = document.querySelector("#postForm")
        postForm.style.display= "none";
    })
    
    const title = localStorage.getItem("title")
    const desc = localStorage.getItem("desc")
    const qn_id = localStorage.getItem("qn_id")
    const answers = localStorage.getItem("answers")
    let data = {
        title:title,
        desc:desc,
        qn_id:qn_id,
        answers: answers
        }
    tableDisplaysSpecificqn(data)

    const postAnswerForm = document.querySelector("#comment #postForm")
    postAnswerForm.addEventListener("submit", (event)=>{
        event.preventDefault()
        postAnswerHandler(data.qn_id, postAnswerForm) 
    })

}
