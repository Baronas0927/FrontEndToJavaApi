let form = document.querySelector("#createVacationForm");
let formBtn = document.querySelector("#formBtn");
let alertsContainer = document.querySelector("#alerts");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createVacation);
getVacations();

function createVacation(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    formData['photos'] = [];
    for (let field of form.elements) {
        if (field.name) {
            if (field.name == "photo1") {
                formData["photos"][0] = field.value;
            }
            else if (field.name == "photo2") {
                formData["photos"][1] = field.value;
            } else {
                formData[field.name] = field.value;
            }
        }
    }
    fetch(`${baseUrl}${port}/createVacation`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("sukurtas");
                form.reset();
                getVacations();
            }
        })
}

function getVacations() {
    fetch(`${baseUrl}${port}/getVacations`)
        .then(response => response.json())
        .then(data => {
            fillTable(data);
        })
}

function fillTable(data) {
    let tbody = document.querySelector("#tbody");
    let HTML = "";
    let counter = 1;
    data.forEach(vacation => {
        /*
        A serial number which increments for each user.
        The user's first name
        */
        HTML += `<tr>
                    <td>${counter++}</td>
                    <td>${vacation.title}</td>
                    <td>${vacation.country}</td>
                    <td>${vacation.city}</td>
                    <td>${vacation.season}</td>
                    <td>${vacation.photos}</td>
                    <td>${vacation.price}</td>
                    <td>${vacation.description}</td>
                    <td>
                        <a href="" vacationId="${vacation.id}"class="btn btn-sm btn-primary update"><i class="fas fa-edit"></i> Edit</a>
                        <a href="" vacationId="${vacation.id}" class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i> Delete</a>
                    </td>
                </tr>`;
    }
    );
    tbody.innerHTML = HTML;
    addEventListenersOnDelete();
    addEventListenersOnUpdate();
}

function addEventListenersOnUpdate() {
    let updateBnts = document.querySelectorAll(".update");
    updateBnts.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            editVacation(btn.getAttribute("vacationId"));
            window.scrollTo(0, 0);
        })
    });
}

function addEventListenersOnDelete() {
    let deleteBnts = document.querySelectorAll(".delete");
    deleteBnts.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            deleteVacation(btn.getAttribute("vacationId"));
            showAlert("Ištrintas");
            window.scrollTo(0, 0);
        })
    });
}

function deleteVacation(vacationId) {
    console.log(vacationId);
    const formData = { "id": vacationId };
    fetch(`${baseUrl}${port}/deleteVacation`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                getVacations();
                showAlert("Ištrintas");
            }
        })
}

function editVacation(id) {
    toggleForm(true,id);
    getVacation(id);
}

function getVacation(id) {
    fetch(`${baseUrl}${port}/getVacation?id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fillForm(data);
        })
}

function fillForm(vacation) {
    document.querySelector("#userId").value = vacation.id;
    document.querySelector("#title").value = vacation.title;
    document.querySelector("#country").value = vacation.country;
    document.querySelector("#city").value = vacation.city;
    document.querySelector("#season").value = vacation.season;
    // document.querySelector("#photos").value = vacation.photos;
    document.querySelector("#price").value = vacation.price;
    document.querySelector("#description").value = vacation.description;
}

function updateVacation(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    formData['photos'] = [];
    for (let field of form.elements) {
        if (field.name) {
            if (field.name == "photo1") {
                formData["photos"][0] = field.value;
            }
            else if (field.name == "photo2") {
                formData["photos"][1] = field.value;
            } else {
                formData[field.name] = field.value;
            }
        }
    }
    console.log(formData);
    fetch(`${baseUrl}${port}/updateVacation`, {
        method: "POST",
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                showAlert("sukurtas");
                form.reset();
                getVacations();
            }
        })
}

function toggleForm(state,id) {
    formBtn.classList.toggle("btn-success");
    formBtn.classList.toggle("btn-primary");
    // document.querySelector("#createVacationForm").value = "edit";
    if (state) {
        formBtn.innerText = "Atnaujinti";
        form.removeEventListener("submit", createVacation);
        form.addEventListener("submit", updateVacation);
        form.innerHTML += `<input type="hidden" id="userId" name="id">`;

    } else {
        formBtn.innerText = "Įrašyti";
        form.removeEventListener("submit", updateVacation);
        form.addEventListener("submit", createVacation);
        
        try{
            document.querySelector("#userId").remove();
            }catch(e){}
    }
}

function showAlert(status) {
    alertsContainer.innerHTML = `
    <div class="alert alert-success">
            <strong>Success!</strong> Kelionė sėkmingai ${status}.
        </div>`;
    setTimeout(() => {
        alertsContainer.innerHTML = '';
    }, 3000);
}
