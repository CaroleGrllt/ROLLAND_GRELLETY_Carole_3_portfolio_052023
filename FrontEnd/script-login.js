function connexion() {
    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: document.querySelector("#emailLogin").value,
            password: document.querySelector("#passwordLogin").value,
        }),
    })

    .then(function(res) {
        
        if(res.ok) {
            return res.json();
        }
    })

    .then(function(data) {
        // console.log(data);
            sessionStorage.setItem("token", data.token); 
            //propriété sessionStorage valable pour la session de navigation en cours. 
            // console.log(data.token);
            window.location.replace("index.html");
    })
    
    .catch(function(err){
        let messageErreur = document.querySelector(".error-cnx");
        messageErreur.innerHTML = "Erreur dans l'identifiant ou le mot de passe"
    });
}

let loginFormulaire = document.getElementById("submitLogin");
loginFormulaire.addEventListener("click", connexion);

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    }
    )
})

