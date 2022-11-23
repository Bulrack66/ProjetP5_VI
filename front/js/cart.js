const Title = document.querySelector("title");
Title.innerText = "Cart : Mon panier";

let cart = localStorage.getItem('products');
cart = JSON.parse(cart);

let cartItem = document.getElementById('cart__items');

if (cart === null) {
    // Message panier vide
    cartItem.innerText = "Votre panier est vide"
}
else {
    for (let item of cart) {
    console.log(item)

    fetch("http://localhost:3000/api/products/" + item.id)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (product) {
            console.log(product)

            let element = `
            <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
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
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${item.quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
            `;

            cartItem.innerHTML += element;

        })

        .then(function (delBasket) {
            // AddeventListener to delete item in Array
        })
}}
const selectElement = document.querySelector('.itemQuantity');
console.log(selectElement);
