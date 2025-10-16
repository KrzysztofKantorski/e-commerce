# Ecommerce project:

-Online shop enables users to browse products. 
Once user logges in, he can add products to cart, create orders, browse orders history 
and add products to favorites. 


## Functionalities:

**User** 
  - Register and login 
  - browse products
  - add to cart 
  - add order 
  - order history 
  - add reviews

**Shopping** 
  - Add product to cart 
  - add to order 
  - add to favorites 
  - search by text

**Admin panel** 
  - Add new products 
  - delete products 
  - best selling products (graph) 
  - users with most orders, etc


## Technologies:

**Frontend** 
  - React (react router, useContext, useState, useEffect, useNavigate, universal-cookie, vite) 
  - axios (connect with api)
  - heroui (designed components)
  - magicui (animations)

**Backend**
  - express.js (building api) 
  - bcrypt (secure password)
  - jsonwebtoken (store user information)
  - cloudinary (store images)

**Database**
  - mongodb (connected with atlas)


## Requirements
  - Node.js (version 22.14.0 or later)
  - Mongodb
  - use npm


## Installation

  1. Clone repository
     
    git clone https://github.com/KrzysztofKantorski/e-commerce.git
    
    cd e-commerce

  3. Install backend dependencies
  cd backend
  npm install
  
  4. Configure environment
  Add .env file in /backend directory and add your variables:
  - URI = your mongodb connection string
  - JWT = your jwt secret
  - CLOUD_NAME = copy from cloudinary
  - CLOUDINARY_API_KEY = copy from cloudinary
  - CLOUDINARY_API_SECRET = copy from cloudinary

  4. Create uploads directory in /backend for temporary files (when user adds his photo), 
  they will be saved in cloudinary

  5. Create productImages directory in /backend for storing product images 
  - Add images and save them as: product_name.extension
  - After adding images run in /backend/srcipts: 
  node updateProductImages

## API Reference

**Authorization**
   
    POST  /api/auth/register   Register user 
    POST  /api/auth/login      Login 
    POST  /api/auth/verify     User verification 

**Products**
   
    GET     /api/products                       Display all products 
    GET     /api/products/:id                   Display product
    POST    /api/products                       **(Admin)** Add new product 
    PUT     /api/products/:productId            **(Admin)** Update product 
    DELETE  /api/products/:productId            **(Admin)** Delete product 
    PUT     /api/products/discount/:productId   **(Admin)** Add discount to product 
    POST    /api/products/:id/reviews           Add review to product  
    GET     /api/products/discount              Display products with discount 
    GET     /api/products/search                Display searched products (from user input) 
    GET     /api/products/category/count        Count items by cateory (for filters) 
    GET     /api/products/category/:category    Display products by category 
    GET     /api/products/:id/reviews           Display comments related to product 
    GET     /api/products/newest                Display the newest products 
    
**Cart**
      
    GET     /api/cart                           Display all products 
    POST    /api/cart/:productId                Add product to cart
    PUT     /api/cart/:productId                Change quantity of product
    DELETE  /api/cart/:productId                Delete product from cart

**Favorites**
      
    DELETE  /api/favorites/remove/:productId    Display all products 
    POST    /api/favorites/:productId           Add product to favorites
    GET     /api/favorites                      Display products added to favorites

**Orders**
      
    POST    /api/orders/                        Create order
    GET     /api/orders/:id                     Display order

**Stats**
      
    GET     /api/stats/                        Orders by status, top products
    GET     /api/stats/users                   New users, users with most orders
  






    
