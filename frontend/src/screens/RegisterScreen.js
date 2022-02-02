import React, {useState, useEffect} from 'react';
import Loader from '../components/loader'
import Message from '../components/message'
import FormContainer from '../components/FormContainer'
import {Link, useParams,useSearchParams , useNavigate} from 'react-router-dom'
import { Button, Form, Row, Col, Collapse } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';


function RegisterScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    let history = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") ? searchParams.get("redirect") : '/'

    const userRegister = useSelector(state=> state.userRegister) // from store .js checks to see if the user is logged in
    const {error, loading, userInfo} = userRegister
    useEffect(() =>{
        if(userInfo){
            history(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmPassword){
            setMessage('Password do not match')
        }else{
            dispatch(register(name,email, password))//action
        }
        
    }

  return <FormContainer>
            <h1>Sign In</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader /> }
                <Form onSubmit={submitHandler}>


                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                            <Form.Control required type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>


                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                            <Form.Control required type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>                            
                    </Form.Group> 


                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                            <Form.Control required type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>                            
                    </Form.Group>


                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label>Confirm Password</Form.Label>
                            <Form.Control required type='password' placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>                            
                    </Form.Group>

                    <Button type='submit' variant='primary'>Register</Button>
                    
                </Form>

                <Row className='py3'>
                    <Col>
                        Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/register'}>Sign in</Link>
                    </Col>
                </Row>                

        </FormContainer>;
}

export default RegisterScreen;
