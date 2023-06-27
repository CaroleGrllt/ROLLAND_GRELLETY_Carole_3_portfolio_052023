// ******************************************************************************
// *********************** Création des boutons "filtre" ************************ 
// ******************************************************************************

fetch("http://localhost:5678/api/categories")
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })

    .then((data) => {
        data.unshift({ // création du bouton "tous". Dans le tableau renvoyé, on insère un nouvel objet en 1er avec unshift
            id: 0,
            name: 'Tous'
        })

        data.forEach((theme) => {

            let filtre = document.querySelector("#filters");
            let filterButton = document.createElement("button");
            filterButton.textContent = theme.name;
            filterButton.setAttribute("data-id", theme.id);
            filterButton.classList.add("categorie");
            filtre.appendChild(filterButton);
        })
    })

    .then(()=> {
        btns = document.querySelectorAll(".categorie");
        btns[0].classList.add("selected");
        btns.forEach((selectedBtn) => {
            selectedBtn.addEventListener('click', () => {
                btns.forEach((otherBtn) => {
                    if(otherBtn !== selectedBtn) {
                        otherBtn.classList.remove('selected');
                    }
                });
                selectedBtn.classList.add('selected');
            })
        })

        btns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                let filterBtn = e.target.dataset.id;
                works.forEach((work) => {
                    let filterImg = work.dataset.id;
                    if(filterBtn == 0) {
                        work.style.display = "block"
                    } else {
                        if(filterBtn === filterImg) {
                            work.style.display = "block"
                        } else {
                            work.style.display = "none"
                        }
                    }
                })
            })
        })
    })

    .catch(function(err){ 
        alert('Erreur dans la création des filtres.');
    });



// ******************************************************************************
// ***************** Création des galeries (homepage et popup) ****************** 
// ******************************************************************************

let btns;
let works;

function displayProjects() {
    fetch("http://localhost:5678/api/works")
      .then(function(res) {
        if(res.ok) {
            return res.json();
        }
      })

      .then(function(value) {
        const galerie = document.querySelector(".gallery");
  
        value.forEach((work) => {
            let container = document.createElement("figure"); 
            let elementImage = document.createElement("img");
            let elementTexte = document.createElement("figcaption");

            elementImage.src = work.imageUrl; 
            elementTexte.innerHTML = work.title; 
            container.setAttribute("data-id", work.categoryId);
            container.setAttribute("id", work.id);
            container.classList.add("projets");
            elementImage.classList.add("img-projets");

            galerie.appendChild(container);
            container.appendChild(elementImage);
            container.appendChild(elementTexte);

            galerie.appendChild(container);
        })
      })

      .catch(function(err){ 
            alert('Erreur dans la création de la galerie. Veuillez réessayer');
        });
    }

displayProjects()

  
function displayProjectsModal() {
    fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if(res.ok) { 
            return res.json(); 
        }
    })

    .then(function(value){
        value.forEach((work) => {
            let projets = work;

            let galeriePopup = document.querySelector(".gallery-popup"); 
            let containerPopup = document.createElement("figure");
            let elementImagePopup = document.createElement("img");
            let arrow = document.createElement("i");
            let trash = document.createElement("i");
            let elementTextePopup = document.createElement("figcaption");

            elementImagePopup.src = work.imageUrl; 
            arrow.classList.add("fa-solid", "fa-arrows-up-down-left-right");
            trash.classList.add("fa-solid", "fa-trash-can", "icon");
            elementTextePopup.innerHTML = "éditer" 
            elementTextePopup.classList.add("edit");
            containerPopup.setAttribute("id", work.id);
            trash.setAttribute("id", work.id);
            containerPopup.setAttribute("data-id", work.categoryId);
            elementImagePopup.classList.add("img-projets", "img-projets-popup");
            containerPopup.classList.add("projets-popup");
            
            galeriePopup.appendChild(containerPopup); 
            containerPopup.appendChild(elementImagePopup);
            containerPopup.appendChild(arrow);
            containerPopup.appendChild(trash)
            containerPopup.appendChild(elementTextePopup);



            //  *********************************************
            //  ********** Suppression des travaux **********
            //  *********************************************

                trash.addEventListener('click', (event) => deleteProjet(event));

                    const token = sessionStorage.getItem("token");
                    const idProject = projets.id;

                    function deleteProjet(event) {
                        let figure = event.target.closest('figure')
                        figure.remove();

                        let figureId = figure.id;

                        let arrayGalerie = document.querySelectorAll('.gallery figure'); 
                        let deleteWork = Object.values(arrayGalerie).filter(projet => projet.id === figureId)
                        deleteWork[0].remove();
                       
                        fetch(`http://localhost:5678/api/works/${idProject}`, {
                            method: 'DELETE',
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        })

                        .catch(function(error) {
                        });
                    }
        })
    })

    .then(()=> {
        works = document.querySelectorAll(".projets");
    })

    .catch(function(err){ 
        alert('Erreur dans la création de la galerie popup.');
    });
}

displayProjectsModal()



// ******************************************************************************
// *********** Modification du design de la homepage en mode édition ************ 
// ******************************************************************************

if(sessionStorage.token !== null) {
    let modeEdition = document.querySelectorAll(".mode-edition");
    modeEdition.forEach((edition) => {
        edition.style.display = "flex";
    })

    document.querySelector(".filter-buttons").style.display = "none";
    document.querySelector(".projects-div").style.margin = "0 0 90px 0";

    function logout() {
        sessionStorage.clear();
        window.location.href = "index.html";
    }

    document.querySelector(".login-button").style.display = "none";
    let logoutBtn = document.querySelector(".logout-button");
    logoutBtn.style.display="block";

    logoutBtn.addEventListener('click', () => {
        logout();
    });
} 

if (sessionStorage.token == null) {
    let modeEditionNone = document.querySelectorAll(".mode-edition");
    modeEditionNone.forEach((none) => {
        none.style.display = "none";
    })

    document.querySelector(".logout-button").style.display = "none";
    document.querySelector(".login-button").style.display = "block";
    document.querySelector(".filter-buttons").style.display = "flex";
}



// ******************************************************************************
// ***************** Ouverture / fermeture de la popup au clic ****************** 
// ******************************************************************************

let modal = null;

document.querySelector('.open').addEventListener('click', (e) =>{
    e.preventDefault();
    const target = document.querySelector('.popup'); 
    target.style.display = "flex";
    modal = target;
    modal.addEventListener('click', closeModale);
    let closeBtn =  modal.querySelectorAll('.close');

    closeBtn.forEach((cross) => {
        cross.addEventListener('click', closeModale);
    })  

    modal.querySelector('.popup-container-delete').addEventListener('click', stopPropagation);
    modal.querySelector('.popup-container-add').addEventListener('click', stopPropagation);
})

const closeModale = function(e) {
    if(modal === null) return
    e.preventDefault();

    modal.style.display = "none";
    modal.removeEventListener('click', closeModale);
    let closeBtn = modal.querySelectorAll('.close');

    closeBtn.forEach((cross) => {
        cross.removeEventListener('click', closeModale);    
    })  

    let deletePopup = document.querySelector('.popup-container-delete');
    let addPopup = document.querySelector('.popup-container-add');
    deletePopup.classList.remove('hide');
    addPopup.classList.add('hide');    
    modal.querySelector('.popup-container-delete').removeEventListener('click', stopPropagation);
    modal.querySelector('.popup-container-add').removeEventListener('click', stopPropagation);
    modal = null;

    clearInputs()
}

const stopPropagation = function (e) {
    e.stopPropagation();
}
  
function clearInputs() {
        nvTitle.value = "";
        nvProjet.value="";
        document.querySelector(".generique-container").style.display = "flex";
        imgPreview.innerHTML=""
        imgPreview.style.display = "none";
        document.querySelector('.success').textContent = ""
        document.querySelector('.failure').textContent = ""
}



// ******************************************************************************
// ************************** Popup "ajout de projet" *************************** 
// ******************************************************************************

let nvProjet = document.querySelector('.add-img-input');
let imgPreview = document.querySelector(".preview-projet");
let nvlCateg = document.querySelector(".categorie-input");
let nvTitle = document.querySelector(".title-input");
let addBtn = document.querySelector(".add-btn");
nvlCateg.value="1"


// ********** Passer d'une popup à l'autre **********


let deletePopup = document.querySelector('.popup-container-delete');
let addPopup = document.querySelector('.popup-container-add');
let addProject = document.querySelector('.add');

addProject.addEventListener('click', (e) => {
    e.preventDefault();
    deletePopup.classList.add('hide');
    addPopup.classList.remove('hide');
})

let backArrow = document.querySelector(".fa-arrow-left");
backArrow.addEventListener('click', (e) => {
    e.preventDefault();
    deletePopup.classList.remove('hide');
    addPopup.classList.add('hide');
    clearInputs()
})


// ********** Prévisualisation d'un fichier **********


nvProjet.addEventListener('change', previewImg);

function previewImg() {

    let extension = /\.(jpe?g|png)$/i; 

    if(this.files.length === 0 || !extension.test(this.files[0].name)) { 
        return; 
    }

    let file = this.files[0]; 
    let fileRead = new FileReader();
    fileRead.readAsDataURL(file);
    fileRead.addEventListener('load', (event) => displayWork(event, file));
}

function displayWork(event, file) { 
    let previewWork = document.querySelector('.preview-projet');
    previewWork.style.display="flex"
    let addWork = document.querySelector('.generique-container')
    addWork.style.display = "none";
    let figureContainer = document.createElement('figure');
    figureContainer.classList.add('preview-container');
    let figureContent = document.createElement('img');
    figureContent.src = event.target.result;
    figureContent.classList.add('preview-img');

    previewWork.appendChild(figureContainer);
    figureContainer.appendChild(figureContent);
}


//*****//*****Changement couleur bouton quand formulaire rempli *****//*****//


nvTitle.addEventListener('input', colorBtn)
nvProjet.addEventListener('input', colorBtn)
nvlCateg.addEventListener('input', colorBtn)

function colorBtn() {
    if (!nvTitle.value || !imgPreview.firstChild || !nvlCateg.value) {
        addBtn.classList.remove("allowed");
        addBtn.classList.add("not-allowed");
        return
    }

    if(nvTitle.value != "" && imgPreview.firstChild && nvlCateg.value != "") {
        addBtn.classList.remove("not-allowed");
        addBtn.classList.add("allowed");
    }
}


//*****//***** Création du message d'erreur / ajout du projet *****//*****//


addBtn.addEventListener("click", (event) => ajouterProjet(event))

function ajouterProjet(event) {
    event.preventDefault();
    let errorMsg = document.querySelector('.failure');
    let successMsg = document.querySelector('.success');
    let tailleImgMax = 4*1024*1024;
    let imgToSend = nvProjet.files[0];

    if (nvTitle.value === "" || !imgPreview.firstChild || imgToSend.size > tailleImgMax ) {
        errorMsg.textContent = "Tous les champs doivent être remplis. La taille du fichier est limitée à 4 Mo"
        successMsg.textContent = "";
        return
    }

    colorBtn()

    let formData = new FormData();
    formData.append("image", nvProjet.files[0]);
    formData.append("title", nvTitle.value);
    formData.append("category", nvlCateg.value);
    let token = sessionStorage.getItem('token')

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
    })

    .then(response => {
        if (!response.ok) {
        throw new Error("Erreur de la requête");
        }
    })

    .then(function(data){
        const successMsg = document.querySelector(".success");
        successMsg.textContent = 'Image ajoutée avec succès !';

        document.querySelector('.gallery').innerHTML=""
        document.querySelector('.gallery-popup').innerHTML=""

        displayProjects()
        displayProjectsModal()
        clearAfterSent();
    })

    .catch(error => {
        console.error("Erreur", error);
         errorMsg.textContent = 'Erreur lors de l\'ajout du projet';
    })
}

function clearAfterSent() {
        nvlCateg.value = "1"
        nvTitle.value = "";
        nvProjet.value="";
        document.querySelector(".generique-container").style.display = "flex";
        imgPreview.innerHTML=""
        imgPreview.style.display = "none";
        addBtn.classList.remove('allowed')
        addBtn.classList.add('not-allowed')
}

nvProjet.addEventListener('change', clearMessage);
nvTitle.addEventListener("keydown", clearMessage);

function clearMessage() {
    document.querySelector('.failure').textContent="";
    document.querySelector('.success').textContent=""; 
}

// *****************
// ***** FIN JS ****
// *****************