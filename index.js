import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import ejsLayouts from 'express-ejs-layouts';
import fs from 'fs';

// Controllers
import JobController from './src/controller/job.controller.js';
import MainController from './src/controller/main.Controller.js';
import UserController from './src/controller/user.controller.js';

// Middleware
import { auth } from './src/middleware/auth.middleware.js';
import validateRequest from './src/middleware/validation.middleware.js';
import { uploadFile } from './src/middleware/fileUpload.middleware.js';
import { setlastVist } from './src/middleware/lastVisit.middleware.js';

const app = express();

/* =======================
   REQUIRED FOR RENDER
======================= */

// Create uploads folder if not exists (multer fix)
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

/* =======================
   MIDDLEWARE
======================= */

app.use(express.static('public'));
app.use(cookieParser());

app.use(
  session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// Make session data available in EJS
app.use((req, res, next) => {
  res.locals.userName = req.session.userName || 'Recruiter';
  res.locals.userEmail = req.session.userEmail || null;
  next();
});

// Parse form data
app.use(express.urlencoded({ extended: true }));

/* =======================
   VIEW ENGINE
======================= */

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src', 'views'));
app.use(ejsLayouts);

/* =======================
   CONTROLLERS
======================= */

const mainController = new MainController();
const jobController = new JobController();
const userController = new UserController();

/* =======================
   ROUTES
======================= */

// Main routes
app.get('/', setlastVist, mainController.getRoleSelection);
app.get('/job', mainController.getJobListings);
app.get('/jobdetails/:id', mainController.getJobDetails);
app.get('/postjob', auth, mainController.getPostJob);
app.get('/update-job/:id', auth, mainController.getUpdateJobView);
app.get('/error', mainController.errorMsg);

app.post('/postjob', mainController.addNewJob);
app.post('/update-job', mainController.postUpdateJob);
app.post('/delete-job/:id', mainController.deleteJob);
app.post('/search', mainController.search);

// Job application
app.get('/apply/:id', jobController.getJobApplyForm);
app.get('/job/:id/applicants', jobController.getApplicantsForJob);
app.post(
  '/apply/:id',
  uploadFile.single('resume'),
  validateRequest,
  jobController.applyForJob
);

// Auth routes
app.get('/register', userController.getRegisterForm);
app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);

app.post('/register', userController.postRegister);
app.post('/login', userController.postLogin);

// Static views (optional)
app.use(express.static('src/views'));

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 1100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
