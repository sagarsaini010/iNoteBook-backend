const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "Sagarsainiisgoodboy";

// create a user using: POST "/api/auth/createuser". Dosen't require login
router.post(
  "/createuser",
  [
    body("email", "enter a valid email").isEmail(),
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("password", "enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // const user = User(req.body)
    // user.save()
    // if error send bad request and the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const data = matchedData(req);
    try {
      // 🔒 Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Replace plain password with hashed one
      data.password = hashedPassword;

      const user = new User(data); // Create new user with validated data
      await user.save(); // Save to DB

      // sending jwt webtoken
      const Userdata = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(Userdata, JWT_SECRET);
      // for checking what token are generated
      // console.log(authtoken)
      // no need to send user only send token
      // res.status(201).json({ message: "User registered successfully", user });

      res.status(201).json({ authtoken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error", message: err.message });
    }

    // return res.send(req.body);
  }

  //   res.send({ errors: result.array() });
  // res.send(req.body)
);

// Authenticate a user using: POST "/api/auth/login". no require login
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if error send bad request and the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const {email,password} = req.body;
    try {
      let user = await User.findOne({email})
      if(!user){
        return res.status(400).json({error: "Please enter a valid email and password"})
      }
      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        return res.status(400).json({error: "Please enter a valid email and password"})
      }
      const payload = {
        user:{
          id: user.id
        }
      }

      const authtoken = jwt.sign(payload,JWT_SECRET);
      res.json({authtoken})

    } 
    
    catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server error", message: err.message });
    }



  }
);

module.exports = router;
