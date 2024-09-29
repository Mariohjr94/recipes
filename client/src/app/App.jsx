import { Routes, Route } from 'react-router-dom';
import NavBar from "../features/Navbar"
import LandingPage from '../features/LandingPage';
import AuthForm from '../features/auth/AuthForm';
import Dashboard from '../features/dashboard/Dashboard';
import RecipeDetails from '../features/RecipeDetails';
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
    <NavBar/>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} />

      {/* Admin routes */}
      {loggedIn ? (
        <Route path="/dashboard" element={<Dashboard />} />
      ) : (
        // Redirect to login if not logged in and trying to access dashboard
        <Route path="/dashboard" element={<AuthForm />} />
      )}

      {/* Default fallback */}
      <Route path="*" element={loggedIn ? <Dashboard /> : <AuthForm />} />
    </Routes>
    </>
  );
}

export default App;
