import { cart, saveToStorage, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption = getDeliveryOption(deliveryOptionId);

        let today = dayjs();
        let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        let dateString = deliveryDate.format('dddd, MMMM D');


        cartSummaryHTML += `
        <div class="cart-item-container">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        ${matchingProduct.getPrice()}
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
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
            </div>
        </div>
        `;
    });

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    // Add event listeners to delete buttons
    let deleteButtons = document.querySelectorAll('.js-delete-quantity');
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function () {
            const productId = deleteButtons[i].dataset.productId;
            deleteFromCart(productId);
            renderOrderSummary(); 
            renderPaymentSummary();
        });
    }

    // Add event listeners to delivery option radio buttons
    let deliveryOptionButtons = document.querySelectorAll('.js-delivery-option');
    for (let i = 0; i < deliveryOptionButtons.length; i++) {
        deliveryOptionButtons[i].addEventListener('click', function () {
            const productId = deliveryOptionButtons[i].dataset.productId;
            const deliveryOptionId = deliveryOptionButtons[i].dataset.deliveryOptionId;
            updateDeliveryOption(productId, deliveryOptionId);
            saveToStorage();
            renderOrderSummary(); 
            renderPaymentSummary();
        });
    }


    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';

        for (let i = 0; i < deliveryOptions.length; i++) {
            const deliveryOption = deliveryOptions[i];
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = deliveryOption.priceCents === 0
                ? 'FREE Shipping'
                : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
            <div class="delivery-option js-delivery-option"
                data-product-id="${matchingProduct.id}"
                data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString}
                    </div>
                </div>
            </div>
            `;
        }

        return html;
    }

    function deleteFromCart(productId) {
        let matchingProductIndex;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productId === productId) {
                matchingProductIndex = i;
            }
        }
        cart.splice(matchingProductIndex, 1);
        saveToStorage();
    }
}

