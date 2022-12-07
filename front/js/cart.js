// Récupération des informations des produits depuis l'API

// https://codeshare.io/efesfsse
// la fonction getKanap à travers api. ma variable products récupère le json et complète product

fetch("http://localhost:3000/api/products/")
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    //Storage.getItem() est utilisée pour obtenir les données de l'élément depuis le stockage
    .then(function getKanap(api) {
        let products = JSON.parse(localStorage.getItem("products"));
        displayItem(api, products);

    })

    .catch(function (error) {

    });

function displayItem(api, products) {
    if (products === null || products.length === 0) {
        const emptyCart = document.createElement("p");
        emptyCart.innerText = "Votre panier est vide";
        document.querySelector('#cart__items').appendChild(emptyCart);
    } else {
        for (let product of products) {
            for (let data of api) {
                if (product.id === data._id) {
                    createProductCard(product, data);
                }
            }
        }
        changeQty(api, products);
        deleteItem(api, products);
        getTotalQty(api,products);

    }
}

function createProductCard(localStorage, api) {
    const produitPanier =
        `<article class="cart__item" data-id="${localStorage.id}" data-color=${localStorage.color}>
    <div class="cart__item__img">
      <img src="${api.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${api.name} - ${localStorage.color}</h2>
        <p id="partielPrice">${api.price} €</p>
     </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input type="number" class="itemQuantity" data-id="${localStorage.id}" name="itemQuantity" min="1" max="100" pattern="[0-9]+" value="${localStorage.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p id="deleteItem" class="deleteItem">Supprimer</p>
       </div>
      </div>
    </div>
       </article>`;
    document
        .getElementById("cart__items")
        .insertAdjacentHTML("beforeend", produitPanier);
    //'beforeend' : Juste à l'intérieur de l'element , après son dernier enfant.
}


function getTotalQty(api, products) {
    // création d'une variable à 0 par défaut
    let sumQty = 0;
    // idem création d'une variable à 0
    let priceTotal = 0;
    // si le panier est vide alors message au visiteur
    if (products === null) {
        document.getElementById("totalQuantity").innerText
           // else ( sinon )
    } else {
        for (let product of products) {
            sumQty = sumQty + parseInt(product.quantity);
        }


        // Si la somme du panier est supérieur à 1
        if (sumQty >= 1) {
            // On boucle sur le localstorage
            for (let product of products) {
                // On boucle également sur l'api
                for (let data of api) {
                    // Si le produit dans mon localstorage correspond à mon produit dans l'api je rentre dans le IF
                    if (product.id === data._id) {
                        // Je reprendre priceTotal et j'incrémente la valeur avec la quantité présent dans le localstorage multipler par le prix unitaire récupérer dans l'api
                        priceTotal = priceTotal + product.quantity * data.price;
                    }
                }
            }
            // Manipulation du DOM
            document.getElementById("totalQuantity").innerText = sumQty;
            document.getElementById("totalPrice").innerText = priceTotal;
        } else {
            // Si mon panier est vide
        }
    }
}

function changeQty(api, products) {
    const inputs = document.querySelectorAll(".itemQuantity");
    inputs.forEach((input) => {
        input.addEventListener("change", function () {
            const product = input.closest("article");
            const productId = product.dataset.id;
            const productColor = product.dataset.color;

            if (
                products.some(
                    (e) => e.id === productId && e.color === productColor
                )
            ) {
                let objIndex = products.findIndex(
                    (product) =>
                        product.id === productId && product.color === productColor
                );
                products[objIndex].quantity = input.valueAsNumber;
            }
            let productsJson = JSON.stringify(products);
            localStorage.setItem("products", productsJson);
            getTotalQty(api, products);
        });
    });
}

function deleteItem(api, products) {
    const itemDelete = document.querySelectorAll(".deleteItem");
    itemDelete.forEach((item) => {
        item.addEventListener("click", function () {
            const product = item.closest("article");
            product.remove();
            const productId = product.dataset.id;
            const productColor = product.dataset.color;


            if (
                products.some(
                    (e) => e.id === productId && e.color === productColor
                )
            ) {
                let objIndex = products.findIndex(
                    (product) =>
                        product.id === productId &&
                        product.color === productColor
                );
                // splice supprime un élement dans le tableau
                // ObjIndex correspond à l'index du produit dans le tableau
                products.splice(objIndex, 1);
                // Création d'une variable avec le nouveau tableau de produit ( avec le splice compris )
                let productsJson = JSON.stringify(products);

                // On ajoute les valeurs du panier dans "products" avec la valeur productsJson qui correspond au tableau de produit
                localStorage.setItem("products", productsJson);
                // getTotalQty(api, products);
            }
        });
    });

}


// Vérifier le formulaire
// https://regex101.com/  / https://regexr.com/
let firstName = document.getElementById("firstName");
firstName.addEventListener("change", function () {
    validFirstName(this);
});

function validFirstName(inputFirstName) {
    let textRegExp = new RegExp("^([a-zA-Z]+(?:. |-| |'))*[a-zA-Z]*$");

    if (!textRegExp.test(inputFirstName.value)) {
        document.getElementById("firstNameErrorMsg").innerText = "Exemple : alex";
        return false;
    } else if (inputFirstName.value.length < 2) {
        document.getElementById("firstNameErrorMsg").innerText =
            "Vérifiez votre Nom";
        return false;
    } else {
        document.getElementById("firstNameErrorMsg").innerText = "";
        return true;
    }
}


/// Prochaine étape : Validation de tous les inputs 

// 1 : Ajouter un event Listener sur le bouton Commander
        // Lors du clic sur le bouton 
            // a : Stopper la propagation 
            // b : Vérifier que le panier n'est pas vide 
            // c : Vérifier la bonne saisies des inputs ( formulaire ) 
            // d : Créer un objet pour la route en POST 
// e : Créer une fonction qui récupére l'objet créer en (d) et l'envoyer en POST sur l'API
    // order = {
    // contact = {
    //     name: ...
    //     firstname : ...
    // }
    // products : ["11111", "22222"]
    // }
/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */