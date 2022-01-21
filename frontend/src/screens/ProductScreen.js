import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card, ListGroupItem} from 'react-bootstrap'
import Rating from '../components/Rating'
import axios from 'axios'
//import products from '../products'





function ProductScreen() {
    const match = useParams()
    const [product, setProduct] = useState([])

    useEffect(() => {

        async function fetchProduct(){
            const { data } = await axios.get(`/api/products/${match.id}`)
            setProduct(data)
        }
        fetchProduct()
       
    }, [])
    //const match = useParams()
    //const product = products.find((p) => p._id == match.id ) // match .id is from the router
    return (
        <div>
            
            <Link to='/' className='btn btn-success my-3'>Go back</Link>
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

                            <ListGroup.Item>
                                <Link to='/'>
                                    <Row>
                                    
                                        <Button disabled={product.countInStock == 0 ? true : false} className='btn-block' type='button'>Add to cart</Button>
                                    
                                    
                                    </Row>
                                </Link>

                                
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen

