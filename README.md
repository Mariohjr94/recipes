Restaurant Recipe Management Application
A full-stack recipe management application for restaurant staff, allowing easy access to categorized recipes. The application includes an admin-protected backend while providing a publicly accessible front-end for easy recipe access.

Table of Contents
Features
Tech Stack
Getting Started
Prerequisites
Installation
Environment Variables
Usage
Public Access
Admin Access
Folder Structure
Contributing
License
Features
Recipe Categorization: Recipes are organized by category for easy browsing.
Admin Access: Protected login for administrators to add, edit, or delete recipes.
Public Access: Employees and users can view recipes without needing an account.
Dynamic Content Management: Recipes and categories are updated dynamically in the front-end.
Responsive Design: Optimized for mobile and desktop using Vite and Bootstrap.
Tech Stack
Frontend: React, Redux, Vite, Bootstrap
Backend: Node.js, Express
Database: PostgreSQL (with pg library for database operations)
Authentication: Session-based authentication with token storage in session storage
Getting Started
To get a local copy up and running, follow these steps.

Prerequisites
Ensure you have the following installed:

Node.js: v14+ (LTS version recommended)
PostgreSQL: A PostgreSQL server setup for database handling
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/restaurant-recipe-app.git
cd restaurant-recipe-app
Install dependencies for both frontend and backend:

bash
Copy code
# Install backend dependencies
npm install

# Navigate to frontend directory if separated, then install frontend dependencies
cd frontend
npm install
Set up the PostgreSQL database and run migrations if any exist.

Run the app:

bash
Copy code
# Start backend
npm run server

# Start frontend
npm run client
Environment Variables
Create a .env file in the project root with the following variables:

env
Copy code
# Server Port
PORT=3000

# Database connection
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Secret
JWT_SECRET=your_jwt_secret
Usage
Public Access
Users can view recipes and browse by category.
The /recipes route allows access to all recipes, while the /api/recipes/:id route provides detailed recipe data.
Admin Access
Admin can log in at /auth/login with credentials.
Admin features include adding, editing, and deleting recipes.
Navigation State
A dynamic navbar updates to show login/logout based on the admin’s logged-in state.
Folder Structure
bash
Copy code
restaurant-recipe-app
├── backend
│   ├── controllers     # Request handlers
│   ├── models          # Database models
│   ├── routes          # API routes
│   └── server.js       # Server entry point
├── frontend
│   ├── src
│   │   ├── components  # React components
│   │   ├── hooks       # Custom React hooks
│   │   └── App.jsx     # Main app entry
└── README.md
Troubleshooting
Common Errors
401 Unauthorized Error: This usually happens when the token is not stored correctly or expired. Check session storage and the Redux state to ensure the token is present after login.

Token Persistence Issue: If the app is not recognizing logged-in users after refresh, verify that sessionStorage contains the correct token and Redux state is updated.
