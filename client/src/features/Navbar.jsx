import { useState, useEffect } from 'react';
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation, clearToken } from '../features/auth/authSlice';  
import { IoIosSearch } from "react-icons/io";

function CustomNavbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false); 
  
  // Check if the user is logged in and fetch user data from Redux store
  
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [logout] = useLogoutMutation();

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
        <Nav.Link as={Link} to="/freezer-logger" onClick={closeMenu}>Freezer Logger</Nav.Link>
        {isLoggedIn && (
          <>
          <Nav.Link as={Link} to="/add-recipe" onClick={closeMenu}>Add Recipe</Nav.Link>
          </>
        )}
      </Nav>
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
