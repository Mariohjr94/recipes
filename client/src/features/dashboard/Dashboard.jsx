import React from "react";
import { useMeQuery } from "../auth/authSlice";
import RecipeForm from "../RecipeForm"; 
import LogoutButton from "../auth/LogoutButton"; 

function Dashboard() {
  const { data: me } = useMeQuery();


  return (
    <main className="container mt-5">
      <h1>Welcome, {me?.username}!</h1>
      <LogoutButton />

      <div className="mt-4">
        <h2>Manage Recipes</h2>
        <RecipeForm />
      </div>
    </main>
  );
}

export default Dashboard;
