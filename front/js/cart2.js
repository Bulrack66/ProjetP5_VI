const Title = document.querySelector("title");
Title.innerText = "Cart : Mon panier";

let cart = localStorage.getItem('products');
cart = JSON.parse(cart);
/*console.log(cart)*/

let cartItem = document.getElementById('cart__items');
let deleteButton = document.getElementsByClassName('deleteItem');
let modifQuantity = document.getElementsByClassName("itemQuantity")
let totalQuantity = 0;
let totalPrice = 0;
let elmtTotalPrice = document.getElementById('totalPrice');
let elmtTotalQuantity = document.getElementById('totalQuantity');


if (cart === null) {
    // Message panier vide
    cartItem.innerText = "Votre panier est vide"
} else {
    for (let item of cart) {
        fetch("http://localhost:3000/api/products/" + item.id)
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (product) {


                // ITEM = LOCALSTORAGE
                // PRODUCT = API

                if (item.quantity > 0) {
                    totalQuantity += item.quantity;
                    totalPrice += parseInt(product.price) * parseInt(item.quantity);
                }

                console.log(totalQuantity, totalPrice)

                let element = `
            <article class="cart__item" data-id="${product._id}" data-color="${item.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt=${product.altTxt}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${item.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${item.quantity} data-old-value=${item.quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
            `;

                cartItem.innerHTML += element;
                elmtTotalPrice.innerText = totalPrice;
                elmtTotalQuantity.innerText = totalQuantity;

            })
            // fonction de suppression
            // la boucle for qui montre combien de produits il y a dans mon tableau ( la lettre « i » (pour « iterator »))
            .then(function () {
                for (let i = 0; i < deleteButton.length; i++) {
                    deleteButton[i].addEventListener('click', function () {
                        deleteProduct(this)
                        // avertir de la suppression et recharger la page
                        alert('Votre article va bien être supprimé.');
                    })
                }
            })
            // je crée ma fonction pour la modif des quantités
            .then(function () {
                for (let k = 0; k < modifQuantity.length; k++) {
                    modifQuantity[k].addEventListener("change", function (e) {
                        addNewQuantity(this, e)
                    })
                }

            })
    }
}

//Selection de l'element à modifier en fonction de son id ET sa couleur
function addNewQuantity(element, event) {
    let article = element.closest('article');
    let productId = article.dataset.id;
    let productColor = article.dataset.color;
    let oldQuantity = element.dataset.oldValue;
    let quantity = event.target.valueAsNumber

    element.dataset.oldValue = quantity
    // value = event.taget.value === STRING donc parseInt(value) pour le transformer en int

    for (let u = 0; u < cart.length; u++) {
        if (cart[u].id === productId && cart[u].color === productColor) {
            cart[u].quantity = quantity;
            localStorage.setItem('products', JSON.stringify(cart))
        }
    }
    calculTotal(productId, oldQuantity, quantity)
}

// fonction de modification dulocalStorage après la suppression
function deleteProduct(element) {
    let article = element.closest('article');
    let productId = article.dataset.id;
    let productColor = article.dataset.color;

    let input = element.closest('article').querySelector('.itemQuantity');

    let oldQuantity = input.dataset.oldValue;


    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productId && cart[j].color === productColor) {
            cart.splice(j, 1)
            localStorage.setItem('products', JSON.stringify(cart))
        }
    }
    article.remove();
    calculTotal(productId, oldQuantity, 0)
}

function calculTotal(productId, oldQuantity, newQuantity) {
    // console.log(productId);
    // console.log(quantity);

    fetch('http://localhost:3000/api/products/' + productId)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (product) {


            console.log(oldQuantity, newQuantity);
            let quantityDifference = 0;
            let price = product.price;
            let priceDifference = 0;

            newQuantity = parseInt(newQuantity);
            oldQuantity = parseInt(oldQuantity);


            if (newQuantity > 0 && oldQuantity > 0) {
                quantityDifference = newQuantity - oldQuantity;
                priceDifference = quantityDifference * price;
                console.log('JE SUIS TOTO ' + quantityDifference, priceDifference)

            } else if (newQuantity > 0 && oldQuantity < 0) {


                quantityDifference = newQuantity;
                priceDifference = quantityDifference * price;
                console.log('JE SUIS TaTA ' + quantityDifference, priceDifference)

            } else if (newQuantity <= 0 && oldQuantity > 0) {

                quantityDifference = -oldQuantity;
                priceDifference = quantityDifference * price;
                console.log('JE SUIS TITI ' + quantityDifference, priceDifference)
            }


            elmtTotalPrice.innerText = parseInt(elmtTotalPrice.innerText) + priceDifference;
            elmtTotalQuantity.innerText = parseInt(elmtTotalQuantity.innerText) + quantityDifference;


        })


}


/*

fetch('httt:....)
.then(...res)
.then(function product(res..)
let products = localstorage.geti
    getTotalQty(api, products)





// On calcule le nombre de produit dans le panier

function getTotalQty(api, products) {
  // On créer une variable qu'on incrémente à chaque tour de boucle ( SUMQTY )
  let sumQty = 0;
  let priceTotal = 0;
  if (products === null) {
    document.getElementById("totalQuantity").innerText = "";
  } else {
    for (let product of products) {
      sumQty = sumQty + parseInt(product.productQuantity);
    }

    // Si j'ai au moins un produit dans le panier :
    if (sumQty > 1) {
      for (let product of products) {
        for (let data of api) {
          if (product.productId === data._id) {
            priceTotal = priceTotal + product.productQuantity * data.price;
          }
        }
      }
      document.getElementById("totalQuantity").innerText = sumQty;
      document.getElementById("totalPrice").innerText = priceTotal;
    } else {
      // Sinon le panier est vide donc j'informe le client
    }
  }
}



 */
