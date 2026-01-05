import UserModel from '../model/user.model.js'
import JobModel from '../model/main.model.js';

export default class UserController{

  getRegisterForm(req,res){
    return res.render('registerForm', {errorMessage: null});
   }


   getLogin(req, res){
    return res.render('login', {errorMessage : null});
   }

   postRegister(req,res){
    const {name, email, password} = req.body;

    if(!name || name.length < 1 || !email || !email.includes('@') || !password){
      return res.send('Error check the details again')
    }
    
   UserModel.add(name, email, password);
         req.session.userName = name;
   res.render('login', {errorMessage : null});
  
   }


   postLogin(req, res) {
    const { email, password } = req.body;

    console.log(" Received Login Request:", email, password);

    if (!email || !email.includes('@') || !password) {
        return res.send('Error check the details again');
    }


    const user = UserModel.checkLogin(email, password);
   
    
    if (!user) {
        return res.render('login', { errorMessage: "Invalid credentials" });
    }

    req.session.userEmail = user.email;
    req.session.userName = user.name; 
    req.session.user = user;

    const addJob = JobModel.getAllJobs(); 

    return res.render('jobseeker', { addJob, userEmail: req.session.userEmail, userName: req.session.userName });
}



   logout(req,res){
    req.session.destroy((err)=>{
      if(err){
        console.log(err);
      }else{
        res.redirect('/');
      }
    });

    res.clearCookie('lastVisit');
   }
}