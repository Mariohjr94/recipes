import { useState, useEffect } from 'react';
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation, clearToken } from '../features/auth/authSlice';  
import { IoIosSearch } from "react-icons/io";

function CustomNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check if the user is logged in and fetch user data from Redux store
  
  const [logout] = useLogoutMutation();
  const isLoggedIn = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [menuExpanded, setMenuExpanded] = useState(false);

const handleToggle = () => setMenuExpanded(!menuExpanded);
const closeMenu = () => setMenuExpanded(false);

  useEffect(() => {
    console.log("Is Logged In:", isLoggedIn);
    console.log("User:", user);
  }, [isLoggedIn, user]);

  // Handle Logout and redirect to home page
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearToken());  // Clear token and update Redux state
      navigate('/');  // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Handle Search
  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <Navbar bg="light" expand="lg" expanded={menuExpanded} onToggle={handleToggle} className="fixed-top px-3 navbar">
  <Container fluid>
    <Navbar.Brand as={Link} to="/" className="fw-bold">
      E<span style={{ color: '#ffc107' }}>CC</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" onClick={handleToggle} />
    <Navbar.Collapse id="navbarScroll">
      <Nav className="me-auto my-2 my-lg-0" navbarScroll>
        <Nav.Link as={Link} to="/" onClick={closeMenu}>Home</Nav.Link>
        {isLoggedIn && (
          <Nav.Link as={Link} to="/add-recipe" onClick={closeMenu}>Add Recipe</Nav.Link>
        )}
      </Nav>
      <Form className="d-flex me-2" onSubmit={(e) => { handleSearch(e); closeMenu(); }}>
        <FormControl
          type="search"
          placeholder="Search here..."
          className="me-2"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="secondary" type="submit">
          <IoIosSearch />
        </Button>
      </Form>
      <Nav>
        {isLoggedIn ? (
          <>
            <Nav.Link as={Link} to="/profile" onClick={closeMenu}>
              {user?.username || 'Profile'}
            </Nav.Link>
            <Button variant="secondary" onClick={() => { handleLogout(); closeMenu(); }} className="ms-2">
              Logout
            </Button>
          </>
        ) : null}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
  );
}

export default CustomNavbar;
