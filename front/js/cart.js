//_________________Modification de la balise title du navigateur cart --> Page Panier (plus compréhensible par l'utilisateur)_____________________
document.title = "Page Panier";

// Récupération des informations des produits depuis l'API

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
        // JSON.parse transforme une chaîne JSON en un objet JavaScript
    })
    .catch(function (error) {
        console.log(error)
        // Une erreur est survenue
    });

// cette fonction affiche les produits du panier contenu dans le Local Storage
function displayItem(api, products) {
    //Affichage d'un panier vide
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
        getTotalQty(api, products);
        // L'appel à la fonction pour affichage
    }
};

//Création des fiches produits de la page panier
function createProductCard(localStorage, api) {
    const produitPanier =
        `<article class="cart__item" data-id="${localStorage.id}" data-color=${localStorage.color}>
            <div class="cart__item__img">
              <img src="${api.imageUrl}" alt="${api.altTxt}">
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

//------------Mise à jour du total ttc en fonction du nombre de produit pour la commande
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
        // On boucle sur products
        for (let product of products) {
            sumQty = sumQty + parseInt(product.quantity) ;
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
            console.log('Le panier est vide');
            // Si mon panier est vide
        }
    }
}
// ----------- modification de la quantité total du panier
function changeQty(api, products) {
    const inputs = document.querySelectorAll(".itemQuantity");
    inputs.forEach((input) => {
        // il faut écouter si il y a un changement
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
                if (input.valueAsNumber > 100) {
                   alert('100 Produits maximum')
                    return ;
                }
            }
            let productsJson = JSON.stringify(products);
            localStorage.setItem("products", productsJson);
            getTotalQty(api, products);
            //JSON.stringify transforme un objet JavaScript en une chaîne JSON.
        });
    });
}

// ----------Suppression du produit du panier
function deleteItem(api, products) {
    const itemDelete = document.querySelectorAll(".deleteItem");
    itemDelete.forEach((item) => {
        item.addEventListener("click", function () {
            const product = item.closest("article");
            product.remove();
            const productId = product.dataset.id;
            const productColor = product.dataset.color;
            alert("Le produit est supprimé ! ")
            if (
                products.some(
                    (e) => e.id === productId && e.color === productColor
                )
            ) {
                // ObjIndex correspond à l'index du produit dans le tableau
                let objIndex = products.findIndex(
                    (product) =>
                        product.id === productId &&
                        product.color === productColor
                );
                // splice supprime un élement dans le tableau
                products.splice(objIndex, 1);
                // Création d'une variable avec le nouveau tableau de produit ( avec le splice compris )
                let productsJson = JSON.stringify(products);
                // On ajoute les valeurs du panier dans "products" avec la valeur productsJson qui correspond au tableau de produit
                localStorage.setItem("products", productsJson);
                getTotalQty(api, products);
            }
        })
    })
}

//------------------------ F O R M U L AI R E --
// https://regex101.com/  / https://regexr.com/

let firstName = document.getElementById("firstName");
firstName.addEventListener("change", function () {
    validFirstName(this);
});

function validFirstName(inputFirstName) {
    let textRegExp = new RegExp("^([a-zA-Zàâäéèêëïîôöùûüç](?:. |-| |')?)*[a-zA-Zàâäéèêëïîôöùûüç]{2,15}$");

    if (!textRegExp.test(inputFirstName.value)) {
        //Pour récupéré l'input
        document.getElementById("firstNameErrorMsg").innerText = " Le prénom doit avoir 2 lettres minimum et pas de caractères spéciaux autre que le trait d'union ou chiffres."  +
            "Exemple : alex";
        document.getElementById('firstNameErrorMsg').style.color = 'red';
        return false;

    } else if (inputFirstName.value.length < 2) {
        document.getElementById("firstNameErrorMsg").innerText =
            "Vérifiez votre Prénom";
        document.getElementById('firstNameErrorMsg').style.color = 'red';
        return false;
    } else {
        document.getElementById("firstNameErrorMsg").innerText = "";
        return true;
    }
};

let lastName = document.getElementById("lastName");
lastName.addEventListener("change", function () {
    validLastName(this);
});

function validLastName(inputLastName) {
    let textRegExp = new RegExp("^([a-zA-Zàâäéèêëïîôöùûüç](?:. |-| |')?)*[a-zA-Zàâäéèêëïîôöùûüç]{2,15}$");

    if (!textRegExp.test(inputLastName.value)) {
        document.getElementById("lastNameErrorMsg").innerText = "Le nom doit avoir au moins deux caractères. Exemple : Dupond  ou Jean-marc";
        document.getElementById('lastNameErrorMsg').style.color = 'red';
        return false;
    } else if (inputLastName.value.length < 3) {
        document.getElementById("lastNameErrorMsg").innerText =
            "Vérifiez votre Nom";
        document.getElementById('lastNameErrorMsg').style.color = 'red';
        return false;
    } else {
        document.getElementById("lastNameErrorMsg").innerText = "";
        return true;
    }
};

let address = document.getElementById("address");
address.addEventListener("change", function () {
    validAddress(this);
});

function validAddress(inputAddress) {
    let textRegExp = new RegExp("^[a-zA-ZÀ-ÿ0-9 ,.'-]{2,30}$", "g");

    if (!textRegExp.test(inputAddress.value)) {
        document.getElementById("addressErrorMsg").innerText = "Merci de renseigner votre adresse d'au maximum 30 caractères. Exemple : 10 rue jean paul";
        document.getElementById('addressErrorMsg').style.color = 'red';
        return false;
    } else if (inputAddress.value.length < 2) {
        document.getElementById("addressErrorMsg").innerText =
            "Corriger votre adresse";
        document.getElementById('addressErrorMsg').style.color = 'red';
        return false;
    } else {
        document.getElementById("addressErrorMsg").innerText = "";
        return true;
    }
};

let city = document.getElementById("city");
city.addEventListener("change", function () {
    validCity(this);
});

function validCity(inputCity) {
    let textRegExp = new RegExp("^([A-Za-zéèàïêç\\- \\s]{1,50}\\s+[0-9]{5}){1,45}$");

    if (!textRegExp.test(inputCity.value)) {
        document.getElementById("cityErrorMsg").innerText = "Merci de renseigner votre ville et votre code postal. Exemple : « Paris 00000 »";
        document.getElementById('cityErrorMsg').style.color = 'red';
        return false;
    } else if (inputCity.value.length < 4) {
        document.getElementById("cityErrorMsg").innerText =
            "Corriger votre ville";
        document.getElementById('cityErrorMsg').style.color = 'red';
        return false;
    } else {
        document.getElementById("cityErrorMsg").innerText = "";
        return true;
    }
};

let email = document.getElementById("email");
email.addEventListener("change", function () {
    validEmail(this);
});

function validEmail(inputEmail) {
    let textRegExp = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
    if (!textRegExp.test(inputEmail.value)) {
        document.getElementById("emailErrorMsg").innerText = "Veuillez entrer une adresse mail valide. exemple@mail.com";
        document.getElementById('emailErrorMsg').style.color = 'red';
        return false;
    } else if (inputEmail.value.length < 4 || inputEmail.value.length > 50) {
        document.getElementById("emailErrorMsg").innerText =
            "Corriger votre adresse mail";
        document.getElementById('emailErrorMsg').style.color = 'red';
        return false;
    } else {
        document.getElementById("emailErrorMsg").innerText = "";
        return true;
    }
};


//Je sélectionne le btn.
const btnForm = document.querySelector("#order");

//je constate le clic du input. Je récupère ces données lors du click sur la bouton "commander"
btnForm.addEventListener("click", function (e) {
    // Stopper la propagation
    e.preventDefault();
    //si le panier est vide
    let products = JSON.parse(localStorage.getItem("products"))
    if (products.length === 0) {
        window.alert(" oups! le pannier est vide !")
        return
    } else if (validFirstName(firstName) === true && validLastName(lastName) === true && validAddress(address) === true && validCity(city) === true && validEmail(email) === true) {
        const cart = JSON.parse(localStorage.getItem('products'))
        const productsID = [];
        products.forEach((cart) => {
            productsID.push(cart.id)
        })
        alert('Commande envoyée!');

//  Créer un objet pour la route en POST
        const order = {
            contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
            },
            products: productsID
        }

        orderProduct(order)
    } else {
        alert("Veuillez compléter correctement votre formulaire !")
        console.log('erreur dans le formulaire')
    }

});

// Créer une fonction qui récupère l'objet créer et l'envoyer en POST sur l'API
function orderProduct(order) {
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
    })

        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        //vider le localStorage
        .then(function (value) {
            //diriger sur la page confirmation en passant l'id dans l'URL
            window.location.href = `./confirmation.html?orderId=${value.orderId}`
            localStorage.clear();
        })

        .catch(function (error) {
            console.log(error)
        });
}
