import React, {useState, useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { listProductDetails } from '../actions/productActions.js';
import {Link, useParams, useNavigate} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/loader'
import Message from '../components/message'


function ProductScreen() {
    const match = useParams()
    const history = useNavigate()
    //const [product, setProduct] = useState([])
    const dispatch = useDispatch()
    const [qty, setQty] = useState(1)
    const productDetail = useSelector(state => state.productDetails) //from store
    const { loading, error, product } = productDetail
    useEffect(() => {
        dispatch(listProductDetails(match.id))
    }, [dispatch, useEffect])
    //const match = useParams()
    //const product = products.find((p) => p._id == match.id ) // match .id is from the router
    
    const addToCartHandler = () =>{
        history(`/cart/${match.id}?qty=${qty}`)
    }
    return (
        <div>
            
            <Link to='/' className='btn btn-success my-3'>Go back</Link>

            {loading ? 
                <Loader/>
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (
                        <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: ${product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description: {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Price:
                                    </Col>
                                    <Col>
                                        <strong>$ {product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Status:
                                    </Col>
                                    <Col className={product.countInStock == 0 ? 'ProductNptAvailable': 'ProductAvailable'}> 
                                        
                                        {product.countInStock > 0 ?'In stock' : 'out of stock'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            
                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col xs='auto' className='my-1'>
                                            <Form.Select as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                {
                                                    [...Array(product.countInStock).keys()].map((x) =>(
                                                        <option key={x+ 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                                }
                                                
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                
                                    <Row>
                                    
                                        <Button disabled={product.countInStock == 0 ? true : false} className='btn-block' type='button' onClick={addToCartHandler}>Add to cart</Button>
                                    
                                    
                                    </Row>
                                

                                
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
                    )
                }
                    

            
        </div>
    )
}

export default ProductScreen

