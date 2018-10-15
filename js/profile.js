//BUSINESS LOGIC
let url = `http://localhost:5000/api/v1`;

//TABLES
let tableDisplaysSpecificqn =(data) =>{
    let title = document.querySelector("#question h2")
    title.innerHTML = `${data.title}`
    let description = document.querySelector("#describe")
    description.innerHTML = `${data.desc}`
}
let tableDisplayQuestionAnswers = data =>{
    let answers = document.querySelector(".answers")
    let row = document.createElement("tr")
    row.innerHTML = `<td class="td1">
                        <a href="#" class = "answersqn">${data.answer}</a>
                        <div><select class="commentsperAnswer"><option>Comments</option></select></div>
                     </td>
                     <td>${data.answered_user} </td>
                     <td>
                        <div>
                            <button type="submit" class="up_vote" value="upvote">&#8593</button><span class="total_vote"></span>
                            <button type="submit" class="down_vote" value="downvote">&#8595</button></div>
                            <a href="#" class="comment">Add Comment</a>
                     </td>`
    answers.appendChild(row)
}

let tableDisplaysComments = data=>{
    let comments = document.querySelector(".commentsperAnswer")
    let opt = document.createElement("option")
    opt.innerHTML = `${data.comment}`
    comments.appendChild(opt)  
}


//API ENDPOINTS
const postAnswer = (questionId, data) =>{
    // This function add a question's answer to the database
    fetch(url + `/questions/${questionId}/answers`, {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)
    })
    .then((response) =>{
        if(response.status == 201){
            return response.json();
        }
        else if(response.status == 400){
            alert("Fill in the missing fields")
            window.location.reload()
        }
        else if(response.status == 409){
            alert("Answer already exists")
            window.location.reload()
        }
        else if(response.status == 401){
            alert("You have no access priviledges")
            window.location.reload()
        }
    })
    .then((res) => {
        alert(res.message) 
        window.location.reload()
    })
    .catch((error) => {return error})  
}
const deleteqn = (questionId)=>{
    fetch(url + `/questions/${questionId}`, {
        method: "DELETE",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")}      
    })
    .then(response =>{
        if(response.status == 204){
            alert("Question has been deleted")
            window.location.href = "allQuestions.html";
        }
        else if(response.status == 401){
            alert("You have no access priviledges")
            window.location.reload()
        }
        else if(response.status == 405){
            alert("Question does not exist OR check  if this is the question you posted.")
            window.location.href = "allQuestions.html"
        }
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
            commentsPerAnswer(element.ans_id)
        })
            
        let updateForm = document.querySelector("#editForm .formFields")
        let x = document.querySelectorAll(".td1 a")
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
                    container.style.opacity= "1";
                    commentForm.style.opacity= "1";
                    
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
                    container.style.opacity= "1";
                    commentForm.style.opacity= "1";                    
                    })  })

            let upVote = document.querySelectorAll(".up_vote")
            for(let i =0; i<upVote.length; i++){
                upVote[i].addEventListener("click", ()=>{
                    let ansId = `${res[i].ans_id}`
                    let upvote = upVote[i].value
                    let dbupvote = {vote:upvote}
                    totalVotes(ansId, dbupvote)
                })
            }
            let downVote = document.querySelectorAll(".down_vote")
            for(let i =0; i<downVote.length; i++){
                downVote[i].addEventListener("click", ()=>{
                    let ansId = `${res[i].ans_id}`
                    let downvote = downVote[i].value
                    let dbdownvote = {vote:downvote}
                    totalVotes(ansId, dbdownvote)
                })
            }

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
    .then(response => {return response.json()})
    .then((res) => {
        alert(res.message) 
        window.location.reload()       
    })        
    .catch(error => {return error})
}

const totalVotes = (answerId, data) =>{
    fetch(url + `/answers/${answerId}/vote`, {
        method: "POST",
        mode:"cors",
        headers: {"Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(data)                 
    })
    .then(respone => {return response.json()})
    .then(data => { 
        // display votes
        let votes = document.querySelector(".total_vote")
        votes.innerHTML = `${data.total_votes}`        
        
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
    .then(response => {
        if(response.status == 201){
            return response.json();
        }
        else if(response.status == 400){
            alert("Fill in the missing fields")
            window.location.reload()
        }
        else if(response.status == 409){
            alert("Comment already exists")
            window.location.reload()
        }
        else if(response.status == 401){
            alert("You have no access priviledges")
            window.location.reload()
        }
    })
    .then((res) => {
        alert(res.Successful)
        window.location.reload()
        
    })
    .catch(error => {return error})
}

const commentsPerAnswer = (answerId) =>{
    fetch(url + `/answers/${answerId}/comment`, {
        method: "GET",
        mode:"cors",
        headers: {"Content-Type":"application/json"}      
    })
    .then(res => {return res.json()})
    .then(data =>{let res = data.Results
        res.forEach(element =>{
            tableDisplaysComments(element)
        })        
    }).catch(error =>{return error})
}

//USER DATA

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
    // This function retrieves the user input data for commenting
    let answer = form.edited_answer.value
    let comment = {comment: answer}

    comments(answerId, comment)
}



//USER LOGIC
window.onload = function(){  
    
    let username = localStorage.getItem("username")
    let useraccount = document.querySelector("#useraccount")
    useraccount.innerHTML = username
    
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

    const postAnswerForm = document.querySelector("#comment .formFields")
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