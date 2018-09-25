//BUSINESS LOGIC
let url =`http://localhost:5000/api/v1`

//TABLES
let tableDisplaysPostedQns = (data) =>{
    // This function displays every post and assigns questionId attribute
    let allquestionsTable = document.querySelector("#allquestionsTable")
    let row = document.createElement("tr") 
    row.innerHTML = `<td><a href="#">${data.title} </a></td><td>${data.username}</td><td>${data.date_created}</td>`
    allquestionsTable.appendChild(row) 
}

let tableDisplaysAllUserQns = data =>{
    // The function displays all questions in a table
    let allUserQuestionsTable = document.querySelector(".user_qns ul")
    let listed = document.createElement("li")
    listed.innerHTML = `<input type="checkbox" class="check">
                      <a href="#">${data.title}</a>
                      <label>Answers Given</label><button>0</button>`
    allUserquestionsTable.appendChild(list)      
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
    row.innerHTML = `<td class="td1">${data.answer} </td><td>${data.answered_user} </td>
                     <td>
                        <div>
                            <button type="button" id="upvote">UPVOTE</button>
                            <button type="button" id="downvote">DOWNVOTE</button>
                            <button type="button" class="edit_answers">EDIT</button>
                        </div>
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
            
        let checkQns = document.querySelectorAll(".check")
        let del = document.querySelector("#delete")
        for(let i = 0; i<checkQns.length; i++){
            checkQns[i].addEventListener("change", ()=>{
                del.addEventListener("click", ()=>{
                    let qnid = `${res[i].qn_id}`
                    deleteqn(qnid)
                })
            })
        } //get questions with most answers first then delete
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
        console.log(res)
    })
    .catch(error =>{return error})
}

const allQnsUserAsked = () =>{
    fetch(url + `/user/questions`, {
        method: "GET",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")}      
    })
    .then(respone => {return response.json()})
    .then((data) => {
        let res = data.Results 
        localStorage.setItem("title", res.title)
        res.forEach(element =>{
            tableDisplaysAllUserQns(element)
        })
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
        let x = document.querySelectorAll(".edit_answers")// edit box on answers
        for(let i = 0; i<x.length; i++){
            x[i].addEventListener("click", ()=>{
                container.style.opacity= "0.1";
                editForm.style.display="block";
                comment.style.opacity= "0.1";

                updateForm.addEventListener("submit",(event)=>{
                    let ansId = `${res[i].ans_id}`
                    event.preventDefault()
                    updateAnswerHandler(questionId, ansId, updateForm)
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



//USER LOGIC
window.onload = function(){
    
    getAllQuestions()
    
    let useraccount = document.querySelector("#useraccount")
    useraccount.addEventListener("click", ()=>{
        localStorage.getItem("token")
        window.location.href = "userProfile.html"
        allQnsUserAsked()        
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
    
}