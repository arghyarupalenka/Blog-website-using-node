const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registrationForm', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  title:String,
  author:String,
  date:String,
  content:String
});

app.use(express.static('public'));

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
  });

  const BlogPost = mongoose.model('BlogPost', userSchema);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.get('/admin', async (req, res) => {
    try {
      // Fetch all blog posts from MongoDB
      const blogPosts = await BlogPost.find();
  
      // Render the HTML template and pass the data
      res.send(renderTable(blogPosts));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }

    res.sendFile(__dirname + '/dashboard.html');
  });


  app.get('/addblog', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

// Handle form submissions
app.post('/add', async (req, res) => {
  const { title, author, date, content } = req.body;

  
  // Create a new user instance
  const newUser = new User({
    title,
    author,
    date,
    content
  });

  try {
    // Save the user to the database
    await newUser.save();
    res.sendFile(__dirname + '/success.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// New route to fetch and display registered users
app.get('/blogs', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  


  
  app.get('/oneblog', async (req, res) => {
    const postId = req.query.id;
    try {
      const oneb = await User.findOne({ _id: postId });
      res.json(oneb);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  app.get('/blogpost', async (req, res) => {
      res.sendFile(__dirname + '/blogpost.html');
  
  });
  



  app.delete('/delete-all-users', async (req, res) => {
    try {
      await User.deleteMany({});
      res.send('All users deleted successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


  app.get('/deleteone', async (req, res) => {
    const poid = req.query.id;
  console.log(poid);
    try {
      const deletedPost = await User.findByIdAndDelete(poid);
      if (!deletedPost) {
        return res.status(404).send('Blog post not found');
      }
  
      res.send('Blog post deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/count', async (req, res) => {
    try {
      const count = await BlogPost.countDocuments();
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
