import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducrs, productDetailsReducr } from './reducers/productREducers';
import { cartReducer } from './reducers/cartReducers';
;

;


const reducer = combineReducers({
    productList: productListReducrs, //3 calling productListReducrs
    productDetails: productDetailsReducr,
    cart: cartReducer,
})


const cartItemsFromStorage = localStorage.getItem('cartItems') ?
        JSON.parse(localStorage.getItem('cartItems')): []


const initialState = {
    cart:{cartItems: cartItemsFromStorage}
}

const middlewear = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewear)))

export default store
