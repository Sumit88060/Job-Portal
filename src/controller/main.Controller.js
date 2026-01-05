import path from 'path';
import JobModel from '../model/main.model.js';
export default class MainController{
  
    getRoleSelection(req,res){

        res.render('index');
    }

    errorMsg(req,res){
    return res.render('errorpage');
    }

getJobListings(req, res) {
    try {
        
        let allJobs = JobModel.getAllJobs(); 

        console.log(" All Jobs Fetched: ", allJobs);
        
        return res.render('jobseeker', { addJob: allJobs, userEmail: req.session.userEmail });
    }catch (error) {
        console.error(" Error fetching jobs:", error);
        return res.status(500).send("Internal Server Error");
    }
}

 async getJobDetails(req,res){
    const jobId = req.params.id;

    const job = await JobModel.getJobById(jobId);
    console.log("Fetched Job Data:", job);
    console.log("Job Posted By:", job?.postedBy);

    if(!job){
        console.log("job not found");
     return res.status(404).send('404 not found');
    }

    res.render('jobDetails',{ job , userEmail : req.session.userEmail});

}

getPostJob(req,res){
    console.log('post job');
    if (!req.user) {
        return res.redirect('/login');
    }

    return res.render('post-job', { user: req.user })
}

addNewJob(req,res){
    const {field, position ,address,companyName,salary, openings, skills,applyDate} = req.body;

    const recruiterEmail = req.session.userEmail;
    console.log("Session User Email:", recruiterEmail); 

const jobData = {
    field,
    position,
    address,
    companyName,
    salary,
    openings,
    skills,
    applyDate,
     postedBy: recruiterEmail,
};

console.log("Job Data before saving:", jobData);

    const newJobs = JobModel.getNewJob(jobData);

    let jobs = JobModel.getAllJobs();

 return res.render('jobseeker', { addJob:jobs ,userEmail : req.session.userEmail});
}

getUpdateJobView(req,res,next){

const id = req.params.id;

const jobFound = JobModel.getById(id);
const loggedInUser = req.session.userEmail;
// const {address, salary, applyDate } = jobFound;

if (jobFound) {
  return res.render('updated-job', { job: jobFound,userEmail : req.session.userEmail }); 
} else {
    res.status(404).send('Job Not Found'); 
}

if (jobFound.postedBy !== loggedInUser) {
    return res.status(403).send('Unauthorized: You can only edit jobs you posted.');
}

res.render('updated-job', { job: jobFound, userEmail: loggedInUser });

}

postUpdateJob(req,res){
    let jobId = req.body.id;
  let existingJob = JobModel.getJobById(jobId);

    if (!existingJob) {
        console.log("Job not found!");
        return res.status(404).send("Job not found");
    }

    // Preserve `postedBy`
    req.body.postedBy = existingJob.postedBy;

    JobModel.update(req.body);

    console.log("PostUpdateJob",req.body);

    let jobs = JobModel.getAllJobs();

 return res.render('jobseeker', { addJob:jobs ,userEmail : req.session.userEmail });
}

search =(req,res)=>{
const jobName= req.body.name;
const check = JobModel.searchResult(jobName);
console.log("Job Found Name=",check);

res.render('jobseeker',{ addJob : check});
}

deleteJob(req,res){

    const id = req.params.id;
    const recruiterEmail = req.session.userEmail;
    const jobFound = JobModel.getById(id);
    

    if(!jobFound){
        res.status(404).send('Job Not Found'); 
    }

    if (jobFound.postedBy !== recruiterEmail) {
        return res.status(403).send('Unauthorized: You can only delete jobs you posted.');
    }

    JobModel.delete(id,recruiterEmail);
    let jobs = JobModel.getAllJobs();
    
    return res.render('jobseeker', { addJob:jobs ,userEmail : req.session.userEmail});
}


}
