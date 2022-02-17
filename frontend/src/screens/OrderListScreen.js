import React, { useState, useEffect } from "react";
import Loader from "../components/loader";

import FormContainer from "../components/FormContainer";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Paginate from "../components/Paginate";
import Message from "../components/message";
import { useNavigate } from "react-router-dom";
import { listOrders } from "../actions/orderActions";

function OrderListScreen() {
  const history = useNavigate();
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders(searchParams.get("page")));
    } else {
      history("/login");
    }
  }, [dispatch, history, userInfo, searchParams]);

  return (
    <div>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Date</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i style={{ color: "red" }} className="fas fa-times"></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i style={{ color: "red" }} className="fas fa-times"></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} />
        </div>
      )}
    </div>
  );
}

export default OrderListScreen;
