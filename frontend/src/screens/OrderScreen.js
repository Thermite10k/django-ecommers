import React, { useState, useEffect } from "react";

import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constannts/orderConstants";

import Message from "../components/message";
import loader from "../components/loader";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import Loader from "../components/loader";

function OrderScreen() {
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPayDetails = useSelector((state) => state.orderPay);
  const { success: paySuccess } = orderPayDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loadnig: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [pay, setPay] = useState();

  const match = useParams();
  const dispatch = useDispatch();
  const history = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = match.id;

  const showPay = () => {
    console.log(pay);
  };
  if (!loading && !error) {
    order.itemsPrice = Number(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    ).toFixed(2);
  }
  useEffect(() => {
    if (!userInfo) {
      history("/login");
    }
    if (!order || order._id !== Number(orderId) || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
    if (paySuccess) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
      setPay(paySuccess);
    }
  }, [order, orderId, dispatch, setPay, successDeliver, paySuccess]); //when the function is activated

  const payorderHandler = () => {
    dispatch(payOrder(orderId));
    if (paySuccess) {
      setPay(paySuccess);
    }
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup varint="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: {order.user.name}</strong>
              </p>
              <p>
                <strong>
                  Email:
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </strong>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>payment Method</h2>

              <p>
                <strong>Method: </strong>

                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message varinat="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summery</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Item: </Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total Price: </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
                <ListGroup.Item>
                  <Row>
                    <Button
                      type="button"
                      className="btn-block"
                      variant="success"
                      disabled={order.isPaid}
                      onClick={payorderHandler}
                    >
                      Pay!
                    </Button>
                  </Row>
                </ListGroup.Item>
              </ListGroup.Item>
            </ListGroup>
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Row>
                    {loadingDeliver && <Loader />}
                    <Button
                      type="button"
                      className="btn-block"
                      variant="success"
                      onClick={deliverHandler}
                    >
                      Mark ad delivered
                    </Button>
                  </Row>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
