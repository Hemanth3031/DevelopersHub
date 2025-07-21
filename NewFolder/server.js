const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ReviewModel = require('./reviewmodel');
const DevUser = require('./models/devUser');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' })); // to handle base64 images
app.use(cors({ origin: '*' }));

// In-memory token blacklist (for logout)
const blacklistedTokens = [];

const mongoURI = 'mongodb+srv://hemanthh8270:ibrX5jMhCDa64eOL@cluster0.ggd0acp.mongodb.net/developerhub?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

const auth = (req, res, next) => {
  try {
    const token = req.header('x-token');
    if (!token) return res.status(400).json({ message: 'Token not found' });

    if (blacklistedTokens.includes(token)) {
      return res.status(401).json({ message: 'Token is invalidated. Please log in again.' });
    }

    const decoded = jwt.verify(token, 'jwtsecret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Authentication error' });
  }
};

// ✅ REGISTER route
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, mobile, skill, password, confirmPassword, image } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobile || !skill || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await DevUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new DevUser({
      fullName,
      email,
      mobile,
      skill,
      password,
      confirmPassword,
      image // Base64 image string
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// ✅ Update profile
app.put('/updateprofile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, mobile, skill, image } = req.body;

    const updatedUser = await DevUser.findByIdAndUpdate(
      userId,
      { fullName, mobile, skill, image },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// ✅ Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await DevUser.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user._id } };
    jwt.sign(payload, 'jwtsecret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Logout
app.post('/logout', auth, (req, res) => {
  const token = req.header('x-token');
  if (!token) return res.status(400).json({ message: 'No token provided' });

  blacklistedTokens.push(token);
  return res.status(200).json({ message: 'Logout successful' });
});

// ✅ All Profiles
app.get('/allprofiles', auth, async (req, res) => {
  try {
    const profiles = await DevUser.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ My Profile
app.get('/myprofile', auth, async (req, res) => {
  try {
    const user = await DevUser.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Individual Profile
app.get('/profile/:id', async (req, res) => {
  try {
    const profile = await DevUser.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// ✅ Add Review
app.post('/addreview', auth, async (req, res) => {
  try {
    const { taskworker, rating } = req.body;

    const user = await DevUser.findById(req.user.id);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const newReview = new ReviewModel({
      taskprovider: user.fullName,
      taskworker,
      rating
    });

    await newReview.save();
    return res.status(200).send('Review updated successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// ✅ My Reviews
app.get('/myreview', auth, async (req, res) => {
  try {
    const allreviews = await ReviewModel.find();
    const myreview = allreviews.filter(review =>
      review.taskworker.toString() === req.user.id.toString()
    );
    return res.status(200).json(myreview);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// ✅ Delete Own Profile
app.delete('/deleteprofile', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedUser = await DevUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    return res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    return res.status(500).json({ message: 'Server error while deleting profile' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
