const express = require("express");
const router = express.Router();
const auth = require("../validators/login");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { registerValidator } = require("../validators/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const upload = require("../uploadUserImage/multer")
const fs = require("fs")
const cloudinary = require("../uploadUserImage/cloudinary")
const path = require('path');

//add user image
router.post("/uploadImage", auth, upload.single("file"), async (req, res) => {
    const userId = req.user.id;
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const uploader = async (path) => await cloudinary.uploads(path, "Images");
        
        // Upload to Cloudinary
        const newPath = await uploader(req.file.path);
        
        
        const user = await User.findByIdAndUpdate(
            userId,
            { image: newPath.url },
            { new: true }
        );

        if (!user) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        //Delete temporary file
        fs.unlinkSync(req.file.path);
        
        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: user
        });

    } catch (error) {
        //Delete temporary fie
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        console.error("Upload error:", error);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

//display user image
router.get("/uploadImage", auth, async(req, res)=>{
    const userId = req.user.id;
    try{
        const user = await User.findById(userId);
        const image = user.image;
        if(!image){
            return res.status(404).json({
                message: "Image not found",
                error: error
            })
        }
        return res.status(200).json({
            message: "Image displayed successfully",
            image: image
        })
    } catch (error){
        return res.status(500).json({
            message: "An error occured",
            error: error.message
        })
    }
})



//register user
router.post("/register", registerValidator, async(req, res)=>{
try{
    const {password, email, username} = req.body;
    //validating email and pasword
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({
        message: "Validation errors",
        errors: errors.array(),
      });
    }
        await bcrypt.hash(password, 10)
        .then(async(hashedPassword)=>{
            //creating new user
            let role = req.body.role;
           if(!role){
            role = "user"
           }
          
                const user = new User({
                    username: username,
                    email: email,
                    role: role == "" ? "user": role,
                    password: hashedPassword
                });

                //save user to database
                await user.save()
                .then((result)=>{
                    res.status(201).send({
                        message: "User created successfully",
                        result
                    })
                })
                .catch((error)=>{
                res.status(500).send({
                    message: "error",
                    error: error.message
                });
                })
                
                })
       .catch((error)=>{
        res.status(500).send({
            message: "Password was not hashed successfully",
            error: error.message
        })
       })
}

catch(error){
     res.status(500).send({
            message: "User was not created successfully",
            error: error.message
        })
}
})


//user login
router.post("/login", (req, res)=>{

    //check if username exists in database
   User.findOne({username: req.body.username})

    .then((user)=>{

        //check if the password is correct
        bcrypt.compare(req.body.password, user.password)
        .then((checkPassword)=>{
            if(!checkPassword){
                return res.status(400).send({
                    message: "Passwords do not match"
                })
            }

            //create jwt token
            const token = jwt.sign(
                {
                    userId: user._id,
                    userName: user.username,
                    userEmail: user.email,
                    userRole: user.role
                },
                process.env.JWT,
                {expiresIn: 60 * 60 }
                );
            
            res.status(200).send({
            message: "Login successfull",
            username: user.username,
            role:  user.role,
            token
            })


        })
        .catch((error)=>{
            res.status(400).send({
            message: "Wrong password",
            error: error.message
            })
        })
    })

    .catch((error)=>{
        res.status(404).send({
            message: "Username not found",
            error: error.message
        })
    })

})
//user verification
router.get("/verify", auth, (req, res)=>{
    res.status(200).send({message: "Authorized to access"
       
    });
})
module.exports = router