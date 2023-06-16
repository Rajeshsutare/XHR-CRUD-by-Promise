
const cl = console.log;

let basseUrl = `http://localhost:3000`;

const postContainer = document.getElementById("postContainer")
const postForm = document.getElementById("postForm")
const titleControl = document.getElementById("title")
const contentControl = document.getElementById("content")
const submitBtn = document.getElementById("submitBtn")
const resetBtn = document.getElementById("resetBtn")
const UpdateBtn = document.getElementById("UpdateBtn")



const makeApiCall = (method,apiUrl,body) =>{
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method,apiUrl);
        xhr.setRequestHeader("Auth","Bearer Token form Localstorages")
        xhr.setRequestHeader("Content-Type","application/json")
        xhr.onload = function(){
            if(xhr.status >=200 || xhr.status <=300){
                resolve(xhr.response)
            }else{
                reject('something went wrong')
            }
        }
        xhr.send(body)
    })
}
makeApiCall("GET",`${basseUrl}/posts`)
    .then(res=>{
        cl(res)
        templating(JSON.parse(res))
    })
    .catch(cl)


const templating = (arr) =>{
    let result ='';
    arr.forEach(ele => {
        result += `
        <div class="card text-center mb-4" id="${ele.id}">
        <div class="card-header">
            <h3>${ele.title}</h3>
        </div>
        <div class="card-body">
            <p>${ele.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <button type="button" class="btn btn-warning" onClick='onEditBtn(this)'>Edit</button>
            <button type="button" class="btn btn-danger" onClick='onDeleteBtn(this)' >Delete</button>
        </div>
    </div>
        `;
    });
    postContainer.innerHTML=result;
}


const onEditBtn = (e) =>{
    let editId = e.closest('.card').id
    localStorage.setItem("editId", editId)
    let editUrl = `${basseUrl}/posts/${editId}`;

    makeApiCall('GET', editUrl)
        .then(res=>{
                cl(res)
        let data = JSON.parse(res)
                titleControl.value =  data.title ;
                contentControl.value =  data.body ;
                submitBtn.classList.add("d-none")
                resetBtn.classList.add("d-none")
                UpdateBtn.classList.remove("d-none")
        })
}

const onUpdatePost = (eve) =>{
    let updateId = localStorage.getItem('editId')
    let updateUrl = `${basseUrl}/posts/${updateId}`
    let obj ={
        title : titleControl.value,
        body : contentControl.value
    }
    cl(obj)
    makeApiCall("PATCH",updateUrl, JSON.stringify(obj))
        .then(res=>{
            cl(res)
            let card = JSON.parse(res)
            submitBtn.classList.remove("d-none")
            resetBtn.classList.remove("d-none")
            UpdateBtn.classList.add("d-none")
        })
        .catch(cl)
        .finally(()=>{
            postForm.reset();
        })
    
}


const onDeleteBtn = (e) =>{
    let deleteId = e.closest('.card').id;
    cl(deleteId)
    let deleteUrl = `${basseUrl}/posts/${deleteId}`
    cl(deleteUrl)

    makeApiCall('DELETE', deleteUrl)
        .then(res=>{
            cl(res)
            let card = document.getElementById('deleteId').remove();
        })
        .catch(err=>{
            cl(err)
        })

}

const onSubmitPost = (eve) =>{
    eve.preventDefault();
    let obj ={
        title : titleControl.value,
        body : contentControl.value,
        id : Math.ceil(Math.random() * 10 )
    }
    makeApiCall('POST',`${basseUrl}/posts`, JSON.stringify(obj))
        .then(res=>{
            cl(res)
            templating(JSON.parse(res))
        })
        .catch(cl)
        .finally(()=>{
            postForm.reset();
        })
}


postForm.addEventListener("submit",onSubmitPost)
UpdateBtn.addEventListener("click",onUpdatePost)
