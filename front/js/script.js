// variable globale : variable créée normalement, en dehors d'une fonction et qui existe de partout.
let items = document.getElementById('items');


// Création d'une fonction
// CRUD = CREATE (POST) , READ (GET) , UPDATE (PUT) , DELETE (DELETE)
function getProductList() {
    // je prends l'URL pour recueillir les données. Récupérer les données de l'api.
    // Envoyer une requête HTTP de type GET (ce qui est le cas par défaut avec Fetch) au service web.
    fetch("http://localhost:3000/api/products")
        // then récupère la promesse. la promesse nous donne des données
        .then(function (res) {
            if (res.ok) {
                //les données sont envoyées en format json.
                return res.json();
            }
        })
        // products == res.json()
        .then(function (products) {
            // Pour chaque lignes dans products tu me crées une variable product
            for (let product of products) {
                insertProduct(product)
            }
        })
}


// On boucle x fois en fonction du nombre de produits présent dans l'API
function insertProduct(product) {

    let anchor = document.createElement('a');
    anchor.href = "./product.html?id=" + product._id

    let article = document.createElement('article');

    let img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    let title = document.createElement('h3');
    title.innerText = product.name;
    title.classList.add = "productName";

    let description = document.createElement('p');

    description.innerText = product.description;
    description.classList.add = "productDescription";

    article.appendChild(img);
    article.appendChild(title);
    article.appendChild(description)
    anchor.appendChild(article);

    items.appendChild(anchor);
}

getProductList()
