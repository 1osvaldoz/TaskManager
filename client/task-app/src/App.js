import { Component } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import CompleteTasks from "./Components/CompleteTasks/CompleteTasks";
import UpdateTask from "./Components/UpdateTask/UpdateTask";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = {};
  render() {
    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark" fixed="top">
          <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/UpdateTask">Lista de tareas</Nav.Link>
              <Nav.Link href="/CompleteTasks">Tareas completadas</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container style={{ marginTop: "70px" }}>
          <BrowserRouter>
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<CompleteTasks />} path="/CompleteTasks" />
              <Route element={<UpdateTask />} path="/UpdateTask" />
            </Routes>
          </BrowserRouter>
        </Container>
      </>
    );
  }
}

export default App;
