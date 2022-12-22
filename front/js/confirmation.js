const queryString_url_id = window.location.search;
const urlSearchParams = new URLSearchParams(queryString_url_id);
const _id = urlSearchParams.get("orderId");

console.log(_id)

document.getElementById('orderId').innerHTML = _id;
