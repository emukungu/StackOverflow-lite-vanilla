//BUSINESS LOGIC
let url =`http://localhost:5000/api/v1`

//TABLES
let tableDisplaysPostedQns = (data) =>{
    // This function displays every post and assigns questionId attribute
    let allquestionsTable = document.querySelector("#allquestionsTable")
    let row = document.createElement("tr") 
    row.innerHTML = `<td><a href="#">${data.title}</a></td><td>${data.username}</td><td>${data.date_created}</td>`
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
    description.innerHTML = `${data.desc}`
}
let tableDisplayQuestionAnswers = data =>{
    let answers = document.querySelector(".answers")
    let row = document.createElement("tr")
    row.innerHTML = `<td class="td1"><span class = "tip"></span>
                        <a href="#" class = "answers">${data.answer}</a>
                        <p></p>
                     </td>
                     <td>${data.answered_user} </td>
                     <td>
                        <div>
                            <button type="button">&#8593</button>
                            <button type="button">&#8595</button></div><a href="#" class="comment">Add Comment</a>
                     </td>`
    answers.appendChild(row)
}


//API ENDPOINTS
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
        let x = document.querySelectorAll("#allquestionsTable a")        
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
        window.location.href="questionDetails.html"
    })        
    .catch((error) => {return error})
}

const postAnswer = (questionId, data) =>{
    // This function add a question's answer to the database
    fetch(url + `/questions/${questionId}/answers`, {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)
    })
    .then((response) =>{return response.json();})
    .then((res) => {
        let data= res.Results
        alert(res.message) 
        window.location.reload()})
    .catch((error) => {return error})  
}
const deleteqn = (questionId)=>{
    fetch(url + `/questions/${questionId}`, {
        method: "DELETE",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")}      
    })
    .then(response =>{return response.json()})
    .then(data =>{ let res = data.message
        alert(res)
    })
    .catch(error =>{return error})
}

const answersPerQuestion = (questionId) =>{
    fetch(url + `/questions/${questionId}/answers`, {
        method: "GET",
        mode:"cors",
        headers: {"Content-Type":"application/json"}      
    })
    .then(res => {return res.json()})
    .then(data =>{let res = data.Results
        res.forEach(element =>{
            tableDisplayQuestionAnswers(element)
        })

        let updateForm = document.querySelector("#editForm #formFields")
        let x = document.querySelectorAll(".td1 a")// edit box on answers
        for(let i = 0; i<x.length; i++){
            x[i].addEventListener("click", ()=>{
                container.style.opacity= "0.1";
                editForm.style.display="block";
                commentForm.style.opacity= "0.1";

                updateForm.addEventListener("submit",(event)=>{
                    let ansId = `${res[i].ans_id}`
                    event.preventDefault()
                    updateAnswerHandler(questionId, ansId, updateForm)
                    editForm.style.display= "none";
                    })
                })
            }
        let comment = document.querySelectorAll(".comment")
        for(let i = 0; i<comment.length; i++){
            comment[i].addEventListener("click", ()=>{
                let heading = document.querySelector("#editForm h1")
                heading.innerHTML = `Comments`
                container.style.opacity= "0.1";
                editForm.style.display="block";
                commentForm.style.opacity= "0.1";

                updateForm.addEventListener("submit",(event)=>{
                    let ansIdcomment = `${res[i].ans_id}`
                    event.preventDefault()
                    postCommentHandler(ansIdcomment, updateForm)
                    editForm.style.display= "none";
                    })  
            })
        }
    })
    .catch(error => {return error})
}

const updateOrPreferredAnswer = (questionId, answerId, data) =>{
    fetch(url + `/questions/${questionId}/answers/${answerId}`, {
        method: "PUT",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)                 
    })
    .then(respone => {return response.json()})
    .then(data => {alert(data.message)})
    .catch(error => {return error})
}

const upVotedownVote = (data) =>{
    fetch(url + `/answers/${answerId}`, {
        method: "PUT",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)                 
    })
    .then(respone => {return response.json()})
    .then(data => { return data.message
        // alert(data.message)
    })
    .catch(error => {return error})
}

const comments = (answerId, data)=>{
    fetch(url + `/answers/${answerId}/comment`, {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)                 
    })
    .then(respone => {return response.json()})
    .then(data => { return data.message
        // alert(data.message)
    })
    .catch(error => {return error})
}

//USER DATA
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

let updateAnswerHandler = (questionId, answerId, form)=>{
    // This function retrieves the user input data for posting a question's answer
    let answer = form.edited_answer.value
    let answer_data = {answer: answer}

    updateOrPreferredAnswer(questionId, answerId, answer_data)
}

let postCommentHandler = (answerId, form)=>{
    // This function retrieves the user input data for posting a question's answer
    let answer = form.edited_answer.value
    let comment = {comment: answer}

    comments(answerId, comment)
}



//USER LOGIC
window.onload = function(){
    
    getAllQuestions()
    
    let useraccount = document.querySelector("#useraccount")
    useraccount.addEventListener("click", ()=>{
        window.location.href = "userProfile.html"       
    })

    const title = localStorage.getItem("title")
    const desc = localStorage.getItem("desc")
    const qn_id = localStorage.getItem("qn")
    let data = {
        title:title,
        desc:desc,
        qn_id: qn_id
        }
    tableDisplaysSpecificqn(data)
    answersPerQuestion(data.qn_id)

    const postAnswerForm = document.querySelector("#comment #formFields")
    postAnswerForm.addEventListener("submit", (event)=>{
        event.preventDefault()
        let qn_id = data.qn_id 
        postAnswerHandler(qn_id, postAnswerForm) 
    })
    
    let del =  document.querySelector("#delete")
        del.addEventListener("click", ()=>{
            let qn = data.qn_id
            deleteqn(qn)
        })
}