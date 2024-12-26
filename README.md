# Recipe App

The Recipe App is a full-stack web application designed for restaurant staff and home cooks to easily view, add, edit, and manage recipes with detailed instructions, ingredients, and categories. It also includes a Freezer Logger to help track and manage inventory stored in freezers. The app provides both a public view for accessing recipes and an admin interface for managing them.

## Features

- **View Recipes**: Publicly accessible recipes with ingredients, instructions, and images.
- **Add Recipes**: Admins can add new recipes with ingredients, instructions, categories, and images.
- **Edit Recipes**: Admins can modify existing recipes, including updating ingredients, instructions, and images.
- **Delete Recipes**: Admins can delete recipes no longer in use.
- **Dynamic Inputs**: Add or remove ingredients and instructions dynamically.
- **Image Uploads**: Upload images to represent each recipe visually.
- **Category Management**: Recipes are organized into categories for easy filtering.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Freezer Logger

- **Inventory Tracking**: View a list of all freezer items, including name, quantity, and category.
- **Add Freezer Items**: Admins can add items to the freezer inventory, specifying name, quantity, and category.
- **Edit Freezer Items**: Admins can update existing freezer items, including their quantity and category.
- **Delete Freezer Items**: Admins can remove items no longer stored in the freezer.
- **Category Filtering**: Filter freezer items by category for easier management.
- **Search Capability**: Search for freezer items by name.
- **Responsive Design**: The Freezer Logger is fully responsive for mobile and desktop users.


- **

## Tech Stack

### Frontend
- **React.js**: UI development
- **React Router**: Client-side navigation
- **Redux**: State management
- **Bootstrap**: Styling and responsive design

### Backend
- **Node.js**: Server-side scripting
- **Express.js**: RESTful API
- **PostgreSQL**: Database for storing recipes, ingredients, and categories
- **Heroku**: Backend deployment
- **Multer**: File upload middleware for handling images

### Deployment
- **Frontend**: Deployed with Netlify
- **Backend**: Deployed with Heroku

