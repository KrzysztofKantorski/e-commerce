const express = require("express");
const router = express.Router();
const auth = require("../validators/login");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { registerValidator } = require("../validators/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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
                    userEmail: user.email
                },
                process.env.JWT,
                {expiresIn: 60 * 60 }
                );
            
            res.status(201).send({
            message: "Login successfull",
            username: user.username,
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