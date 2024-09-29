import { useState } from 'react';
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../features/auth/authSlice';  

function CustomNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Assume you're storing login status and user data in Redux
  const isLoggedIn = useSelector(state => !!state.auth.token);
  const user = useSelector(state => state.auth.user);  // Adjust based on how you're storing the user
  
  // Handle Search
  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Brand<span style={{ color: '#00c2b2' }}>Name</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
          <Form className="d-flex me-2" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search here..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary" type="submit">
              <i className="bi bi-search"></i>
            </Button>
          </Form>
          <Nav>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  {user?.username || 'Profile'}
                </Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Button variant="outline-success" as={Link} to="/signup" className="ms-2">
                  Sign up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
