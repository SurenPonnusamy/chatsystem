const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Set up EJS for rendering views
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid name collisions
  }
});

const upload = multer({ storage });

// Simulating a simple in-memory "chat" array to store messages
let messages = [
];

// Serve the chat page
app.get('/', (req, res) => {
  res.render('index', { messages });
});

// Handle new chat message and image upload
app.post('/send', upload.single('image'), (req, res) => {
  const { user, message } = req.body;
  let imageUrl = null;

  if (req.file) {
    imageUrl = '/uploads/' + req.file.filename; // Store the image URL
  }

  // Add the new message to the chat
  messages.push({ user, message, imageUrl });

  // Redirect to the chat page
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
