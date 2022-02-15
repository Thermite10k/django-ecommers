import React, { useState } from "react";
import { Alert, Button, Col } from "react-bootstrap";

function Message({ variant, children }) {
  const [closed, setClosed] = useState(1);

  const close = () => {
    setClosed(2);
  };
  if (closed == 1) {
    return (
      <Alert variant={variant}>
        <Col md={11}>{children}</Col>
        <Col md={1}>
          <Button onClick={close} variant="success"></Button>
        </Col>
      </Alert>
    );
  } else {
    return <div>closed</div>;
  }
}

export default Message;
