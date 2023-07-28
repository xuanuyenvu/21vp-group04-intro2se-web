const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');


// Load env var
require('dotenv').config();
const port = process.env.PORT;
// Configuration
const connectDatabase = require('./config/database');
const tourCardRoutes = require('./routes/tourCardRoutes');
const tourRoutes = require('./routes/tourRoutes');
const homeRoutes = require('./routes/homeRoutes');
const provinceRoutes = require('./routes/provinceRoutes');
const authRoutes = require('./routes/authRoutes');



// Create express app
const app = express();

// Connect to dbs
connectDatabase();

// View engine setting
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

// Routes
app.use('/', homeRoutes);
app.use('/tourCards', tourCardRoutes);
app.use('/tours', tourRoutes);
app.use('/pronvices', provinceRoutes);
app.use('/auth', authRoutes);


//test route, cần test thì gắn tên file view vào ngay dòng res.render mà test
app.get('/test', (req, res)=>{
  //localhost:5000/test
  res.render('usersList');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});