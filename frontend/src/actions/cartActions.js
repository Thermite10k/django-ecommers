import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constannts/cartConstants';

export const addToCart = (id, qty) => async(dispatch, getState) =>{ 
    const {data} = await axios.get(`/api/products/${id}`)
    
    dispatch(
        {
            type: CART_ADD_ITEM,
            payload:{
                product:data._id,
                image: data.image,
                price: data.price,
                countInStock : data.countInStock,
                qty,
                name: data.name,
            }
        }
    )
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}