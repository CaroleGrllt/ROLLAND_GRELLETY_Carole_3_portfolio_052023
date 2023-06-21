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
        data.unshift({ // création du bouton "tous". 
                       //Dans le tableau renvoyé, on insère un nouvel objet en 1er avec unshift
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

        // console.log(works);
        btns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                let filterBtn = e.target.dataset.id;
                // console.log(filterBtn);
                works.forEach((work) => {
                    let filterImg = work.dataset.id;
                    // console.log(filterImg);
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

    .catch(function(err){ // on retourne une erreur si pb avec fetch
        alert('Erreur dans la création des filtres.');
    });




// ******************************************************************************
// ***************** Création des galeries (homepage et popup) ****************** 
// ******************************************************************************



let btns;
let works;

fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if(res.ok) { //vérification requête bien passée
            return res.json(); //récupération des données format json
        }
    })

    .then(function(value){//récupération d'une valeur intelligible !
        // console.log(value); // vérification dans la console que j'ai bien tous mes objets dans mon tableau
        value.forEach((work) => {

            let projets = work;


            // ********** Création de la galerie homepage **********


            let galerie = document.querySelector(".gallery"); // Sélection élément avec class = gallery
            
            let container = document.createElement("figure"); // création des diverses balises
            let elementImage = document.createElement("img");
            let elementTexte = document.createElement("figcaption");

            elementImage.src = work.imageUrl; // dans la balise image, on met en source l'url de l'image actuellement présente dans la variable work
            elementTexte.innerHTML = work.title; // idem pour la balise figcaption
            container.setAttribute("data-id", work.categoryId);
            container.setAttribute("id", work.id);
            container.classList.add("projets");
            elementImage.classList.add("img-projets");

            galerie.appendChild(container); // on indique que sont les diverses balises par rapport à la .gallery
            container.appendChild(elementImage);
            container.appendChild(elementTexte);

            galerie.appendChild(container); // on indique que sont les diverses balises par rapport à la .gallery


            // ********** Création de la galerie popup **********


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



            // *********************************************
            // ********** Suppression des travaux **********
            // *********************************************


                trash.addEventListener('click', (event) => deleteProjet(event));

                    const token = sessionStorage.getItem("token");
                    const idProject = projets.id;

                    function deleteProjet(event) {
                        let figure = event.target.closest('figure')
                        figure.remove();

                        let figureId = figure.id; // récupération id de l'image supprimée

                        let arrayGalerie = document.querySelectorAll('.gallery figure'); //on récupère dans un tableau toute la galerie principale
                        // console.log(Object.values(arrayGalerie).filter(projet => projet.id === figureId))
                        let deleteWork = Object.values(arrayGalerie).filter(projet => projet.id === figureId)
                        deleteWork[0].remove();
                       
                        fetch(`http://localhost:5678/api/works/${idProject}`, {
                            method: 'DELETE',
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        })
                        .then(resp => {
                            // console.log(resp);
                            if (resp.ok) { // Vérifiez si la réponse est ok avant de l'analyser en JSON
                                return resp.json();
                            } else {
                                throw new Error('La requête a échoué avec le statut ' + resp.status);
                            }
                        })

                        .then(function(data) {
                        })

                        .catch(function(error) {
                            console.log(error)
                        });
                    }
        })
    })

    .then(()=> {
        works = document.querySelectorAll(".projets");
    })

    .catch(function(err){ 
        alert('Erreur dans la création de la galerie. Veuillez réessayer');
    });



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

    //Arrête la propagation de la fonction closeModale au conteneur. 
    //Si on clique dedans, la fonction ne fonctionne plus
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
        //permet de revenir sur la première popup en cas de fermeture des popup
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

    //création d'une règle qui permet d'écarter tout autre type d'extension que celles souhaitées (jpeg/jpg et png (i : peu importe la casse)).
    let extension = /\.(jpe?g|png)$/i; 

    if(this.files.length === 0 || !extension.test(this.files[0].name)) { //.test() renvoie booléen
        //length = 0 ou 1, car pas attribut "multiple" à l'input. Donc 0 ou 1 élément.
        return; // si 0 élément ou si extension pas bonne => retourne sans exécuter code.
    }

    let file = this.files[0]; // je stocke mon objet
    let fileRead = new FileReader(); //constructeur qui permet de créer un nouvel objet FileReader. 
                                       //Permet de lire le contenu de fichiers
    fileRead.readAsDataURL(file);
    fileRead.addEventListener('load', (event) => displayWork(event, file));
}

function displayWork(event, file) { // permet de créer éléments pour afficher l'image
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
nvTitle.addEventListener('input', colorBtn);
nvProjet.addEventListener('input', colorBtn)
nvlCateg.addEventListener('input', colorBtn)


function colorBtn() {
    if(nvTitle.value != "" && imgPreview.firstChild && nvlCateg.value != "") {
        addBtn.classList.remove("not-allowed");
        addBtn.classList.add("allowed");
    }
    if (nvTitle.value === "" || !imgPreview.firstChild || nvlCateg.value === "") {
        addBtn.classList.remove("allowed");
        addBtn.classList.add("not-allowed");
    }
}


//*****//***** Création du message d'erreur *****//*****//

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


    //*****//***** Ajout du travail *****//*****//

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
        clearAfterSent();
        
    })

    .catch(error => {
        console.error("Erreur", error);
         errorMsg.textContent = 'Erreur lors de l\'ajout du projet';
    })
}

function clearAfterSent() {
        nvlCateg.value = ""
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





