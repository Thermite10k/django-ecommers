import React, { useState, useEffect } from "react";
import Loader from "../components/loader";
import Message from "../components/message";
import FormContainer from "../components/FormContainer";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
  unstable_HistoryRouter,
} from "react-router-dom";
import { Button, Form, Row, Col, Collapse } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constannts/productConstans";

function ProductEditScreen() {
  const dispatch = useDispatch();
  let history = useNavigate();
  const match = useParams();
  const productId = match.id;
  const [name, setName] = useState("");

  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history("/admin/productlist");
    } else {
      if (!product.name || product._id !== Number(productId)) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setPrice(product.price);
      }
    }
  }, [product, productId, history, dispatch, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        image,
        brand,
        category,
        price,
        countInStock,
        description,
      })
    );
  };

  return (
    <div>
      <Link to="/admin/productlist">Go back</Link>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

      <FormContainer>
        <h1>Edit Product</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="decimal"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="image"
                placeholder="Enter Image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default ProductEditScreen;
