export const cart = [];

export function addToCart(productId){
      let MatchingItem = null;
      for(let i=0 ; i<cart.length ; i++){
        if(cart[i].productId == productId){
          MatchingItem = cart[i];
        }
      }
      if(MatchingItem !== null)
          MatchingItem.quantity += 1;
      else{
          cart.push({
            productId : productId,
            quantity : 1
          });
        }
    }