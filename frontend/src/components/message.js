import React, { useState } from 'react';
import { Alert, Button, Col  } from 'react-bootstrap';



function Message({variant, children}) {

  
    return <Alert variant={variant}>
    
    <Col md={11}>
    {children}
    </Col>
    <Col md={1}>

    </Col>
      
  </Alert>;  



  
}

export default Message;
