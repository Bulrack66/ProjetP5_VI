// on récupère les id avec l'url courante
const queryString_url_id = window.location.search;
const urlSearchParams = new URLSearchParams(queryString_url_id);
// la propriété "searchParams" de "url" nous retourne un objet de type "URLSearchParams". on récupérer sa valeur.
const _id = urlSearchParams.get("id");

//la fonction fetch ci-dessous permettra d’envoyer une requête GET sur le serveur localhost:
fetch("http://localhost:3000/api/products/" + _id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
        console.log()
    })
    .then(function (value) {
        displayProduct(value);
    })
    // Une erreur est survenue
    .catch(function (err) {
        let container = document.querySelector(".limitedWidthBlockContainer");
        container.innerText =
            "Nous n'avons pas réussi à afficher votre choix. Avez-vous bien lancé le serveur local (Port 3000) ? " +
            "Si le problème persiste, contactez-nous.";
        container.style.border = "solid 2px red ";
        container.style.textAlign = "center";
        container.style.padding = "15px 5px";


    })

// Afficher les informations du fetch dans le DOM
    // Affichage du nom de produit dans la balise h1
function displayProduct(product) {

    let parentTitle = document.getElementById("title")
    parentTitle.innerText = product.name
    //Affichage du nom de la page dans la balise Title pour l'onglet
    const Title = document.querySelector("title");
    Title.innerText = product.name;

    // Affichage de l'image
    let img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    // Ajout de l'image dans la balise correspondante
    document.querySelector('.item__img').appendChild(img);
    // Insertion du Prix dans le span dédié
    document.getElementById('price').innerText = product.price
    let prix = product.price
    // Description du produit
    document.getElementById("description").innerText = product.description

    for (let color of product.colors) {
        let productColor = document.createElement('option');
        document.querySelector('#colors').appendChild(productColor);
        productColor.value = color;
        productColor.innerText = color;
    }
    // Activation du bouton
    let addBtn = document.querySelector('#addToCart');
        //écouteur d'évènements
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //preventDefault(): comment bloquer ce comportement par défaut.
        let color = document.querySelector('#colors').value;
        let quantity = document.querySelector('#quantity').value;

        if (color === "") {
            alert("veuillez indiquer la couleur choisie!")
        } else if (quantity <= 0 || quantity > 100) {
            alert("veuillez indiquer la quantité entre 1 et 100")
        } else {

            let productOrder = {
                id: _id,
                color: color,
                quantity: Number(quantity)
            };

            console.log(productOrder);
            let cart = localStorage.getItem("products");


            if (cart === null) {
                cart = [];
            } else {
                cart = JSON.parse(cart);
            }

            let newItem = true;
            for (let produit of cart) {

                if (produit.id === _id && produit.color === color) {
                    produit.quantity += productOrder.quantity;
                    newItem = false;
                }
            }

            if (newItem === true) {
                cart.push(productOrder)
            }
//La méthode setItem() ajoute le duo clé-valeur à l'emplacement de stockage et JSON.stringify() convertit une valeur JavaScript en chaîne JSON
            localStorage.setItem('products', JSON.stringify(cart))
//La fonction $() remplace la fonction document.getElementById() du DOM
            if (window.confirm(
                `Le canapé de référence ${product.name} et de couleur ${color}  a été ajouté au panier.
                 Consulter le panier OK ou rester sur la page`
            )) {
                document.location.href = './cart.html'
            }

        }
    });

};




