import multer from 'multer';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import JobController from './src/controller/job.controller.js';
import MainController from './src/controller/main.Controller.js'
import UserController from './src/controller/user.controller.js';
import express from 'express';
import { auth } from './src/middleware/auth.middleware.js';
import validateRequest from './src/middleware/validation.middleware.js';
import { uploadFile } from './src/middleware/fileUpload.middleware.js';
import session from 'express-session';
import { setlastVist } from './src/middleware/lastVisit.middleware.js';
import cookieParser from 'cookie-parser';


const app = express();


app.use(express.static('public'));
app.use(cookieParser());

app.use(
    session({
    secret : 'SecretKey',
    resave : false,
    saveUninitialized : true,
    cookie: {secure: false},
}))
app.use((req, res, next) => {
    res.locals.userName = req.session.userName || "Recruiter";
    res.locals.userEmail = req.session.userEmail || null;
    next();
});

//setup view engine setting
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src' , 'views'));

//ejs layout middleware
app.use(ejsLayouts);


//pass form data
app.use(express.urlencoded({extended : true}));


const mainController = new MainController();
const jobController = new JobController();
const userController = new UserController();


app.get('/',setlastVist, mainController.getRoleSelection);
app.get('/job', mainController.getJobListings);
app.get('/jobdetails/:id', mainController.getJobDetails);
app.get('/postjob',auth, mainController.getPostJob);
app.get('/update-job/:id',auth,mainController.getUpdateJobView);
app.get('/error', mainController.errorMsg);
app.post('/delete-job/:id', mainController.deleteJob);
app.post('/postjob',mainController.addNewJob);
app.post('/update-job', mainController.postUpdateJob)
app.post('/search', mainController.search);

app.get('/apply/:id', jobController.getJobApplyForm);
app.get('/job/:id/applicants',jobController.getApplicantsForJob);
app.post('/apply/:id', uploadFile.single('resume'),validateRequest,jobController.applyForJob);

app.get('/register',userController.getRegisterForm);
app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);
app.post('/register', userController.postRegister);
app.post('/login', userController.postLogin);

app.use(express.static('src/views'));


app.listen(1100, ()=>{
    console.log('port is running at 1100');
})