const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const auth = require("../validators/login");


//display products
router.get("/", async (req, res)=>{
    try{
      
      const {sort = "newest"} = req.query;
      const {page=1, limit = 10} = req.query;
        const products = await Product.find();
        
        const displayInOrder = [...products];
        displayInOrder.sort((a,b)=>{

        if (sort === "alphabetical") {
        return a.name.localeCompare(b.name); // A-Z
        }

        if (sort === "ratingAsc") {
          return a.averageRating - b.averageRating; // od najniższej oceny
        }

        if (sort === "ratingDesc") {
          return b.averageRating - a.averageRating; // od najwyższej oceny
        }

        if (sort === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt); // najnowsze
        }

      return 0; // default (jeśli ktoś poda zły parametr)
        })
        
        const start = (page -1)*limit;
      const end = start + Number(limit);
      const paginatedProducts = displayInOrder.slice(start, end);
        res.status(201).send({
           message: "Success",
            products: paginatedProducts, 
            order: sort,
            page: Number(page),
            limit: Number(limit),
            totalProducts: displayInOrder.length,
            totalPages: Math.ceil(displayInOrder.length / limit)
        })
    }
    catch(error){
        res.status(500).send({
            message: "Cannot display products",
            error: error.message
        })
    }
})





//add product
router.post("/", async(req, res)=>{
try{

const {name, description, price, stock, category, images} = req.body;
   
const found = await Product.findOne({name: name})
if(found){
    return res.json({message: `Product with name: ${name} alerdy exists`})
}
    const product = new Product({
    name: name,  // nazwa produktu
    description: description,                  // opis
    price: price,  // cena
    stock: stock,      // ile sztuk na stanie
    category: category,                  // np. elektronika, moda
    images: images, 
    });

    await product.save()
   res.json({
    message: "Product created successfully",
    product: product
   })


    }
catch(error){
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Product was not added",
      error: error.message
    });
    }
})


//display searched products (from text input)
router.get("/search", async(req, res)=>{
  try{
  const {q} = req.query; //...?
  if(!q || q.trim() === ""){
    res.status(400).json({
      message: "Query is required"
    })
  }

  const queryProducts = await Product.find({name: {$regex: q, $options: "i"}}).sort({ name: 1 });
  if(!queryProducts || queryProducts.length === 0){
  return(
      res.status(200).json({
      message: "Try searching something else"
    })
  )  
  }

  res.status(200).json({
    message: "Products matching your query",
    products: queryProducts
  })
  
  }

  catch(error){
    res.status(500).json({
      message: "An error occured",
      error: error
    })
  }

})



//count items by category
router.get("/category/count", async(req, res)=>{
  try{
 
const categories = await Product.distinct('category');
const categoryCounts = []

// Dla każdej kategorii policz produkty
for (const category of categories) {
  const count = await Product.countDocuments({ category });
  categoryCounts.push({
    cat: category,
    count: count
  });
}
   
//Add all filters 
  if(!categoryCounts || categoryCounts.length === 0){
    return(
      res.status(404).json({
      message: "No products found in this category"
    })
    )
  }
  res.status(200).json({
    message: `Counted products by category`,
    count: categoryCounts
  })
  }

  catch(error){
    res.status(500).json({
      message: "An error occured",
      error: error.message
    })
  }

})

router.get("/category/:category", async(req, res)=>{
 try {
    const { category } = req.params;
    const { sort = "newest", page = 1, limit = 10 } = req.query;
    
    const products = await Product.find({ category: category });
    
    const displayInOrder = [...products];
        displayInOrder.sort((a,b)=>{

        if (sort === "alphabetical") {
        return a.name.localeCompare(b.name); // A-Z
        }

        if (sort === "ratingAsc") {
          return a.averageRating - b.averageRating; // od najniższej oceny
        }

        if (sort === "ratingDesc") {
          return b.averageRating - a.averageRating; // od najwyższej oceny
        }

        if (sort === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt); // najnowsze
        }

      return 0; // default (jeśli ktoś poda zły parametr)
        })
    
    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedProducts = displayInOrder.slice(start, end);
    
    res.status(200).send({
      message: "Success",
      products: paginatedProducts,
      order: sort,
      page: Number(page),
      limit: Number(limit),
      totalProducts: displayInOrder.length,
      totalPages: Math.ceil(displayInOrder.length / limit)
    });
    
  } catch (error) {
    res.status(500).send({
      message: "Cannot display products",
      error: error.message
    });
  }
})

//update specific product
router.put("/:id", async(req, res)=>{
    try{
    const productId = req.params.id;
    
     if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }
     const checkProduct = await Product.findOne({ _id:  productId});
     if(!checkProduct){
        return res.status(400).json({
        message: "Product with provided id was not found"
      });
     }
     const {name, description, price, stock, category, images} = req.body;

  await Product.updateOne( 
  {_id:  productId}, 

  {
    name: name,  // nazwa produktu
    description: description,                  // opis
    price: price,  // cena
    stock: stock,      // ile sztuk na stanie
    category: category,                  // np. elektronika, moda
    images: images, 
    updatedAt: new Date() 
  })
  res.status(201).send({
    message: "Product updated successfully"
  })
}

   catch(error){
    res.status(500).send({
        message: "Erron when updating product",
        error: error.message
    })
   }

})



//delete specific product
router.delete("/:id", async (req, res)=>{
    try{
    const productId = req.params.id;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

 const deletedProduct = await Product.findOneAndDelete({ _id: productId });
  if (!deletedProduct) {
       return res.status(404).json({
        message: "Product does not exist"
      });
    }

     res.status(200).json({
      message: `Product "${deletedProduct.name}" was deleted successfully`,
      deletedProduct: {
        id: deletedProduct._id,
        name: deletedProduct.name,
        price: deletedProduct.price
      }
    });
    }

    catch(error){
        res.status(500).send({
            message: "Cannot delete product",
            error: error.message
        })
    }
})



//display specific product
router.get("/:id", async (req, res)=>{
    try{
    const productId = req.params.id;

     if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

     const checkProduct = await Product.findOne({ _id:  productId});
     if(!checkProduct){
        return res.status(400).json({
        message: "Product with provided id was not found"
      });
     }
    
  res.status(200).send({
    message: `Product: ${checkProduct.name} displayed successfully`,
    product: checkProduct
  })
}

   catch(error){
    res.status(500).send({
        message: "Erron when updating product",
        error: error.message
    })
   }
})






//add comment to product
router.post("/:id/reviews", auth, async(req, res)=>{
  try{
  const {id} = req.params;
  const user = req.user.id
  const {comment, rating} = req.body;
  const productToFind = await Product.findById(id);
  if(!productToFind){
    return(
      res.status(404).json({
      message: "User not found"
    })
    )
  }
  if(!comment || comment.length === 0){
     return(
      res.status(400).json({
      message: "Comment is required"
    })
    )
  }

  productToFind.reviews.push({
    user: user,
    comment, 
    rating
  })

  //calculate avg rating
  const addValues = productToFind.reviews.reduce((total, r)=> total + r.rating, 0);
  const avgRating = addValues/productToFind.reviews.length;
  productToFind.averageRating = avgRating;

  await productToFind.save();
  res.status(200).json({
    message: `Review added successfully`,
    product: productToFind.reviews
  })
  }

  catch(error){
    res.status(500).json({
      message: "An error occured",
      error: error.message
    })
  }

})

//display comments related to specific product 
router.get("/:id/reviews",  async(req, res)=>{
  try{
  const {id} = req.params;
  const {page=1, limit = 5, sort = "newest"} = req.query;
  const productToFind = await Product.findById(id).populate({
    path: "reviews.user",
    select: "username"
  });
  if(!productToFind){
    return(
      res.status(404).json({
      message: "User not found"
    })
    )
  }

  //sort by date or ratings

  const reviews = [...productToFind.reviews];
  reviews.sort((a,b)=>{
    if(sort === "ratingAsc"){
      return a.rating - b.rating;
    }
    if(sort === "ratingDesc"){
      return b.rating - a.rating;
    }

  return new Date(b.createdAt) - new Date(a.createdAt);
  });

  //pagination

  const start = (page -1)*limit;
  const end = start + Number(limit);
  const paginated = reviews.slice(start, end);


  res.status(200).json({
    message: `Reviews displayed successfully`,
    reviews: paginated,
    totalReviews: reviews.length,
    averageRating: productToFind.averageRating,
    page: Number(page),
    totalPages: Math.ceil(reviews.length / limit),
  })
  }

  catch(error){
    res.status(500).json({
      message: "An error occured",
      error: error.message
    })
  }

})

module.exports = router