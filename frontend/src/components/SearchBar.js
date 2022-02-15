import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const [keyWord, setKeyWord] = useState();
  let history = useNavigate();
  let location = useLocation();
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyWord) {
      history(`/?keyword=${keyWord}`);
    } else {
      setKeyWord("null");

      history(location);
    }
  };

  return (
    <span>
      <Form onSubmit={submitHandler} className="d-flex ">
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyWord(e.target.value)}
          className="mr-sm-2 ml-sm-5"
        ></Form.Control>

        <Button type="submit" variant="outline-success" className="p-2">
          Submit
        </Button>
      </Form>
    </span>
  );
}

export default SearchBar;
