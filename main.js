let form = document.querySelector("#createVacationForm");
let formBtn = document.querySelector("#formBtn");
let alertsContainer = document.querySelector("#alerts");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createVacation);
getVacations();

function createVacation(event){
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements){
        if(field.name){
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/createVacation`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response =>{
            if(response.ok){
                showAlert("sukurtas");
                form.reset();
                getVacations();
            }
        })
}

function getVacations(){
    fetch(`${baseUrl}${port}/getVacations`)
        .then(response => response.json())
        .then(data  => {
            fillTable(data);
        })
}

function fillTable(data){
    let tbody = document.querySelector("#tbody");
    let HTML = "";
    let counter = 1;
    data.forEach(user =>{
        HTML += `<tr>
                    <td>${counter++}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td><img src="${user.avatar}" alt="Avatar" class="img-thumbnail"></td>
                    <td>
                        <a href="" userId="${user.id}"class="btn btn-sm btn-primary update"><i class="fas fa-edit"></i> Edit</a>
                        <a href="" userId="${user.id}" class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i> Delete</a>
                    </td>
                </tr>`;
    }
);
    tbody.innerHTML = HTML;
    addEventListenersOnDelete();
    addEventListenersOnUpdate();
}

function addEventListenersOnUpdate(){
    let updateBnts = document.querySelectorAll(".update");
    updateBnts.forEach(btn => {
        btn.addEventListener("click", function (event){
            event.preventDefault();
            editVacation(btn.getAttribute("vacationId"));
            window.scrollTo(0, 0);
        })
    });
}

function addEventListenersOnDelete(){
    let deleteBnts = document.querySelectorAll(".delete");
    deleteBnts.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            deleteVacation(btn.getAttribute("vacationId"));
            window.scrollTo(0, 0);
        })
    });
}

function deleteVacation(vacationId){
    event.preventDefault();
    const formData = {"id" : vacationId };
    fetch(`${baseUrl}${port}/deleteVacation`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if(response.ok){
                showAlert("Ištrintas");
                getVacations();
            }
        })
    window.scrollTo(0, 0);
}

function editVacation(id){
    toggleForm(true);
    getVacation(id);
}

function getVacation(id){
    fetch(`${baseUrl}${port}/getVacation?id=${id}`)
        .then(response => response.json())
        .then(data => {
            fillForm(data);
        })
}

function fillForm(vacation){
    document.querySelector("#id").value = vacation.id;
    document.querySelector("#title").value = vacation.title;
    document.querySelector("#country").value = vacation.country;
    document.querySelector("#city").value = vacation.city;
    document.querySelector("#season").value = vacation.season;
    document.querySelector("#photos").value = vacation.photos;
    document.querySelector("#price").value = vacation.price;
    document.querySelector("#description").value = vacation.description;
    document.querySelector("#rating").value = vacation.rating;
}

function updateUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements){
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/updateVacation`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
    .then(response => {
        if(response.ok){
            showAlert("atnaujintas");
            form.reset();
            getVacations();
            toggleForm(false);
        }
    })
}

function toggleForm(state){
    formBtn.classList.toggle("btn-success");
    formBtn.classList.toggle("btn-primary");
    document.querySelector("id").value = "";
    if(state){
        formBtn.innerText = "Atnaujinti";
        form.removeEventListener("submit", createVacation);
        form.addEventListener("submit", updateVacation);
    }else{
        formBtn.innerText = "Įrašyti";
        form.removeEventListener("submit", updateVacation);
        form.addEventListener("submit", createVacation);
    }
}

function showAlert(status){
    alertsContainer.innerHTML = `
    <div class="alert alert-success">
            <strong>Success!</strong> Kelionė sėkmingai ${status}.
        </div>`;
    setTimeout(() => {
        alertsContainer.innerHTML = '';//clear the alert message
    }, 3000);
}
