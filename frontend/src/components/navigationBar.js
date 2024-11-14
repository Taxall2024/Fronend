import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";

function AppNavbar() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Tax all</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-Navbar-nav" />
        <Navbar.Collapse id="basic-Navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/analise/jcp">Juros sobre Capital Próprio (JCP)</Nav.Link>
            <Nav.Link as={Link} to="analise/about">Sobre</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}

export default AppNavbar;
