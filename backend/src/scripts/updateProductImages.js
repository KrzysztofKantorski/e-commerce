const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../../.env'); 
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('Environment variables loaded from:', envPath);
} else {
  console.warn('.env file not found at:', envPath);
}
const mongoose = require('mongoose');

const User = require("../models/user");
const Product = require("../models/product");
const connect = require("../config/db");
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') //delete special marks
    .replace(/\s+/g, '_')     //change space to _
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); //delete polish marks
}

function findMatchingImage(productName, imageFiles){
    const normalizedName = normalizeName(productName);
    const match = imageFiles.find(image=> {
        const imageWithoutExt = path.parse(image).name;
        return normalizeName(imageWithoutExt) === normalizedName;
    })
    return match;
}


async function updateProductImages(){

    const results = {
    updated: [],
    notFound: [],
    summary: {
      updated: 0,
      notFound: 0,
      totalProducts: 0,
      totalImages: 0
    }
  };

    try{
    await connect();
    console.log("connected to database")
    const imagesDir = path.join(__dirname, '../../productImages');
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    
    console.log('Znalezione zdjęcia:', imageFiles);

    const products = await Product.find();
    results.summary.totalProducts = products.length;
    results.summary.totalImages = imageFiles.length;
   

    //change image to all products
    for(const product of products){
        const matchingImage = findMatchingImage(product.name, imageFiles);
        if(matchingImage){

           
            product.images = `/product-images/${matchingImage}`;
            await product.save();
            

            results.updated.push({
                productId: product._id,
                productName: product.name,
                image:  `/product-images/${matchingImage}`
            });
            results.summary.updated++;
           
        }
        else{
           results.notFound.push({
                productId: product._id,
                productName: product.name,
                image:  "image not found"
            });
            results.summary.notFound++
        }
    }
    return results;
    } 
    catch(error){
        console.error('Error:', error);

    }
    finally{
    await mongoose.connection.close();
    console.log('Connection closed');
    }
}

  updateProductImages()
    .then(results => {
      console.log('=== WYNIKI AKTUALIZACJI ===');
      console.log(` Zaktualizowano: ${results.summary.updated}`);
      console.log(` lista zaktualizowanych produktów:`)
      for(let i = 0; i<results.updated.length; i++){
        console.log(`${results.updated[i].productName}`)
      }
      console.log(` Nie znaleziono: ${results.summary.notFound}`);
      console.log(` lista niezaktualizowanych produktów:`)
       for(let i = 0; i<results.notFound.length; i++){
        console.log(`${results.notFound[i].productName}`)
      }
      console.log(` Łącznie produktów: ${results.summary.totalProducts}`);
      console.log(`  Łącznie zdjęć: ${results.summary.totalImages}`);
    })
    .catch(error => {
      console.error('Błąd:', error);
      process.exit(1);
    });





module.exports = {
  updateProductImages,
  normalizeName,
  findMatchingImage
}



