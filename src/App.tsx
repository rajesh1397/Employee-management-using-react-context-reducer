import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FcCancel } from "react-icons/fc";
import { v4 } from "uuid";

import { user } from "./models/user";

import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";

const userRemoveReducer = (state:user[], action:any):user[] => {
  console.log(state);
  if (action.type === "ADD_USER") {
    return [
      ...state,
      {
        first: !action.payload.first ? "Nil" : action.payload.first,
        last: !action.payload.last ? "Nil" : action.payload.last,
        email: !action.payload.email ? "Nil" : action.payload.email,
        id: v4(),
      },
    ];
  }
  if (action.type === "REMOVE_USER") {
    return state.filter((user) => user.id !== action.payload);
  }
  if (action.type === "LOAD_USER") {
    return JSON.parse(action.payload);
  }
  return state;
};

function App() {
  const [first, setFirst] = useState<string>("");
  const [last, setLast] = useState<string>("");
  const [email, setemail] = useState<string>("");

  const [newUserList, dispatchUser] = useReducer(userRemoveReducer, []);

  useEffect(() => {
    const localUsers = localStorage.getItem("users");
    if (localUsers) {
      dispatchUser({ type: "LOAD_USER", payload: localUsers });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(newUserList));
  }, [newUserList]);

  const handledelete = (id:any) => {
    dispatchUser({ type: "REMOVE_USER", payload: id });
  };

  const handlesubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if (!first && !last && !email) {
      return;
    }

    dispatchUser({ type: "ADD_USER", payload: { first, last, email } });

    setFirst("");
    setLast("");
    setemail("");
  };

  return (
    <Container fluid className="bg-light vh-100 py-4">
      <Form inline className="mt-5" onSubmit={handlesubmit}>
        <FormGroup floating className="w-md-50 mx-auto">
          <Input
            id="firstname"
            name="email"
            placeholder="First Name"
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
          <Label for="firstname">First Name</Label>
        </FormGroup>{" "}
        <FormGroup floating className="w-md-50 mx-auto">
          <Input
            id="lastname"
            name="email"
            placeholder="Last Name"
            type="text"
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
          <Label for="lastname">Last Name</Label>
        </FormGroup>{" "}
        <FormGroup floating className="w-md-50 mx-auto">
          <Input
            id="email"
            name="email"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <Label for="email">Email</Label>
        </FormGroup>
        <Button className="d-block mx-auto btn btn-success w-md-50">
          Add User Details
        </Button>
      </Form>

      <Container className="mt-3">
        <Table hover responsive bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email id</th>
            </tr>
          </thead>
          <tbody>
            {newUserList.map((user, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{user.first}</td>
                <td>{user.last}</td>
                <td>{user.email}</td>
                <td onClick={() => handledelete(user.id)}>
                  <FcCancel />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Container>
  );
}

export default App;
