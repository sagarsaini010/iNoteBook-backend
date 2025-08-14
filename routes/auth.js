const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult,matchedData } = require('express-validator');
// Example route: GET /api/auth/test
// create a user using: POST "/api/auth/". Dosen't require auth
router.post('/',[body('email','enter a valid email').isEmail(),
    body('name','enter a valid name').isLength({min: 3}),
    body('password','enter a valid password').isLength({min: 5}),

], async(req, res) => {

// const user = User(req.body)
// user.save()
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
      try {
    const user = new User(data); // Create new user with validated data
    await user.save(); // Save to DB
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error',message: err.message });
  }

    // return res.send(req.body);
  }

//   res.send({ errors: result.array() });
// res.send(req.body)
});

module.exports = router;