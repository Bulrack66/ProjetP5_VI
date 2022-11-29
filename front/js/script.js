let items = document.getElementById('items');


// Création d'une fonction
// CRUD = CREATE (POST) , READ (GET) , UPDATE (PUT) , DELETE (DELETE)
function getProductList() {
    fetch("http://localhost:3000/api/products")
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        // products == res.json()
        .then(function (products){
            // Pour chaque lignes dans products tu me créer une variable product
            for (let product of products) {
                insertProduct(product)
            }
        })
}

// On boucle x fois en fonction du nombre de produits présent dans l'API
function insertProduct(product) {

    let anchor = document.createElement('a');
    anchor.href = "./product.html?id=" + product._id // ./product.html?id=xxxxxxx

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
