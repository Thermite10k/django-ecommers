import React, {useState, useEffect} from 'react';

import FormContainer from '../components/FormContainer'
import { useParams,useSearchParams , useNavigate} from 'react-router-dom'
import { Button, Form, Collapse,Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';

import CheckoutSteps from '../components/CheckoutSteps'


function PaymentScreen() {

    const [paymentMethod, setPaymentMethod] = useState()

    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart
    const dispatch = useDispatch()
    let history = useNavigate()

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history(`/placeorder`)
    }

    if(!shippingAddress.address){
        history('/shipping')
    }
  return <FormContainer>
            <CheckoutSteps step1 step2 step3 />
        
         
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>
                        Select Method
                    </Form.Label>
                    <Col>
                        <Form.Check type='radio' value='PayPayl' label='PayPal or Credit Card' id='paypal' name='paymentMethod' onChange={(e) => setPaymentMethod(e.target.value)}>

                        </Form.Check>
                    </Col>
                    <Col>
                        <Form.Check type='radio' value='Test' label='Test method' id='testMethod' name='paymentMethod'  onChange={(e) => setPaymentMethod(e.target.value)}> 

                        </Form.Check>
                    </Col>
                </Form.Group>




                <Button type='submit' variant='primary' >
                    Continue
                </Button>

            </Form> 
      
      
  </FormContainer>;
}

export default PaymentScreen;
