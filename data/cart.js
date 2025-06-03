export const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
  let MatchingItem = null;
  for(let i=0 ; i<cart.length ; i++){
    if(cart[i].productId === productId){
      MatchingItem = cart[i];
    }
  }

  if(MatchingItem !== null){
    MatchingItem.quantity += 1;
  }
  else{
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId : 1
    });
  }

  // Save cart to localStorage
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId)
        matchingItem = cartItem;
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}
