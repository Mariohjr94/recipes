import React from "react";
import { useMeQuery } from "../auth/authSlice";
import RecipeForm from "../RecipeForm"; 
import RecipeTable from "../RecipeTable"; 
import LogoutButton from "../auth/LogoutButton"; 

function Dashboard() {
  const { data: me } = useMeQuery();


  return (
    <main className="container mt-5">
      <h1>Welcome, {me?.username}!</h1>
      <LogoutButton />

      <div className="mt-4">
        <h2>Manage Recipes</h2>
        <RecipeForm />  {/* Form to add/edit recipes */}
        <RecipeTable /> {/* Table to display and manage recipes */}
      </div>
    </main>
  );
}

export default Dashboard;
