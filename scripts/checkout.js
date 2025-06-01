import {cart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

function generateHTML(){
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        let matchingProduct = null;
        products.forEach((product) => {
            if(productId === product.id)
                matchingProduct = product;
        });

        cartSummaryHTML += `
        <div class="cart-item-container">
            <div class="delivery-date">
                Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                    Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-quantity"
                                data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                        FREE Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                        $4.99 - Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                        $9.99 - Shipping
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        `;
    });

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    /* this delete feature from cart is done entirely by me without any help , but it is
    different from the supersimple.dev video that starts at time 13:32:46 */
    let deleteButtons = document.querySelectorAll('.js-delete-quantity');
    for(let i=0 ; i<deleteButtons.length ; i++){
        deleteButtons[i].addEventListener('click', function () {
            const productId = deleteButtons[i].dataset.productId;
            deleteFromCart(productId);
            generateHTML();
        });
    }
}


/* this delete feature from cart is done entirely by me without any help , but it is
    different from the supersimple.dev video that starts at time 13:32:46 */
function deleteFromCart(productId){
    let matchingProductIndex;
    for(let i=0 ; i<cart.length ; i++){
        if(cart[i].productId === productId)
            matchingProductIndex = i;
    }
    cart.splice(matchingProductIndex, 1);
    // Update localStorage after deletion
    localStorage.setItem('cart', JSON.stringify(cart));

}

generateHTML();
