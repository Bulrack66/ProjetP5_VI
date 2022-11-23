// ETAPE 1 : Récupérer l'id dans l'URL
// https://www.sitepoint.com/get-url-parameters-with-javascript/

const queryString_url_id = window.location.search;

// ETAPE 2 : Récupérer les infos de l'api pour le produit ( ID : xxxx , fetch pour l'article xxx)

const urlSearchParams = new URLSearchParams(queryString_url_id);
const _id = urlSearchParams.get("id");

// fetch("localhost:3000/api/products/Id-De-Ton-Produit)

fetch("http://localhost:3000/api/products/" + _id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        displayProduct(value);
    })
    // Une erreur est survenue
    .catch(function (err) {
        let container = document.querySelector(".limitedWidthBlockContainer");
        container.innerText =
            "<h3>Nous n'avons pas réussi à afficher votre choix. Avez-vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.</h3>";
        container.style.textAlign = "center";
        container.style.padding = "15px 0";
    })

// ETAPE 3 : Afficher les informations du fetch dans le DOM
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

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();


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

            localStorage.setItem('products', JSON.stringify(cart))

            if (window.confirm(`Le canapé de référence ${product.name} et de couleur ${color}  a été ajouté au panier.
Consulter le panier OK ou rester sur la page`)) {
                document.location.href = './cart.html'
            }

        }
    });

};




