import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/loader";
import Message from "../components/message";
import Paginate from "../components/Paginate";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions.js";
function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); //1  .productList is the reducer form the store.js
  const { error, loading, products, page, pages } = productList; //2 productList has an error, loading and a product as a payload.

  const [searchParams, setSearchParams] = useSearchParams();
  let keyword = searchParams.get("keyword");

  useEffect(() => {
    dispatch(listProducts(keyword, searchParams.get("page")));
  }, [dispatch, searchParams]);

  return (
    <div>
      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
