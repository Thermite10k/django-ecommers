import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducrs, productDetailsReducr } from './reducers/productREducers';
import { cartReducer } from './reducers/cartReducers';
import { userLoginReducer } from './reducers/userReducers';


const reducer = combineReducers({
    productList: productListReducrs, //3 calling productListReducrs
    productDetails: productDetailsReducr,
    cart: cartReducer,
    userLogin: userLoginReducer,
})


const cartItemsFromStorage = localStorage.getItem('cartItems') ?
        JSON.parse(localStorage.getItem('cartItems')): []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
        JSON.parse(localStorage.getItem('userInfo')) : null



const initialState = {
    cart:{cartItems: cartItemsFromStorage},
    userLogin:{userInfo: userInfoFromStorage}
}

const middlewear = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewear)))

export default store
