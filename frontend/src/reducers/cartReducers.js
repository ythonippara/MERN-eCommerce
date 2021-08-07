import { CART_ADD_ITEM } from "../constants/cartConstants"

export const cartReducer = (state = { cartItems: []}, action) => {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload
            // Check if item already exists in the cart
            const existItem = state.cartItems.find(x => x.product === item.product)

            if(existItem) {
                return { 
                    ...state.cartItems,
                    // Map through the current cart items, if item exist, return id
                    cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
                }
            } else { 
                // If an item doesn't exist in a cart, push to an array
                return {
                    ...state,
                    // Array of current items, plus a new item
                    cartItems: [...state.cartItems, item]
                }
            }
        default:
            return state
    }
}