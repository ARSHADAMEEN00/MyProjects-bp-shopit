import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { productDetailsReducer, productsReducer} from "./reducers/productReducers";
import {authReducer, userReducer} from "./reducers/userReducer"


const reducer = combineReducers({

products: productsReducer,
productDetails: productDetailsReducer,
auth : authReducer,
user : userReducer,

});

let initialState = {};
const middlware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;