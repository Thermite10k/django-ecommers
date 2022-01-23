import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducrs } from './reducers/productREducers';
;


const reducer = combineReducers({
    productList: productListReducrs,
})

const initialState = {}

const middlewear = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewear)))

export default store
