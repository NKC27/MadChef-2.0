import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';
import './navbar.scss';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="collapseOnSelect nav-bar"
      >
        <Container fluid>
          <Navbar.Brand id="madchef-title" as={Link} to="/">
            <span className="brand-wordmark">
              <span className="brand-wordmark__mad">Mad</span>
              <span className="brand-wordmark__chef">Chef</span>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/RecipeBuilder">
                Build a Recipe
              </Nav.Link>
              <Nav.Link as={Link} to="/search">
                Search Recipes
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/saved">
                    Saved Recipes
                  </Nav.Link>
                  <Nav.Link onClick={() => Auth.logout()}>Log Out</Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="nav-link--cta"
                  onClick={() => setShowModal(true)}
                >
                  Log In / Sign Up
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link className="modal-button-custom" eventKey="login">
                    Log In
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="modal-button-custom" eventKey="signup">
                    Sign Up
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
