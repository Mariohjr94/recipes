import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from "../features/Navbar";
import LandingPage from '../features/LandingPage';
import AuthForm from '../features/auth/AuthForm';
import Dashboard from '../features/dashboard/Dashboard';
import RecipeDetails from '../features/RecipeDetails';
import RecipeForm from '../features/RecipeForm';
import SearchResults from '../features/SearchResult';
import { useMeQuery } from '../features/auth/authSlice';

function App() {
  const { data: me, isFetching } = useMeQuery();
  const loggedIn = !!me?.id;
  

  console.log("Me data:", me);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Login Route (accessible only if not logged in) */}
        <Route
          path="/auth/login"
          element={loggedIn ? <Navigate to="/dashboard" /> : <AuthForm />}
        />

        {/* Admin routes */}
        {loggedIn ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-recipe" element={<RecipeForm />} />
          </>
        ) : (
          <>
            {/* Redirect to login if trying to access dashboard or add recipe without being logged in */}
            <Route path="/dashboard" element={<Navigate to="/auth/login" />} />
            <Route path="/add-recipe" element={<RecipeForm/>} />
          </>
        )}

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
