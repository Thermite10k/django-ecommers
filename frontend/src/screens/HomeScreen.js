import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
//import products from '../products.js'
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/loader";
import Message from "../components/message";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions.js";
function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); //1  .productList is the reducer form the store.js
  const { error, loading, products } = productList; //2 productList has an error, loading and a product as a payload.

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div>
      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;
