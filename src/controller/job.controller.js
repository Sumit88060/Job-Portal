import JobApplyModel from "../model/job.model.js";
import JobModel from "../model/main.model.js";
export default class JobController{


    async getJobApplyForm(req, res) {
        try {
            const jobId = req.params.id;
            const job = await JobModel.getJobById(jobId); 
    
            console.log("Fetched Job:", job);  
    
            if (!job) {
                return res.status(404).send("Job not found");
            }
    
            return res.render("jobsForm", { job, errorMessage: null });  
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }
    
    
    async applyForJob(req, res) {
        console.log(req.body);
    
        const jobId = req.params.id;
        const { name, email, contact } = req.body;
        const resumePath = req.file ? req.file.filename : null;
    
        const applicant = { name, email, contact, resumePath };
        
        
        const job = await JobModel.getJobById(jobId); 
        if (!job) {
            return res.status(404).send("Job not found");
        }
    
        const result = JobModel.addapplicationForJob(jobId, applicant);
        console.log(result);
        if (!result.success) {
            return res.render("jobsForm", { job, errorMessage: result.message });  
        }
    
      
        return res.redirect(`/jobdetails/${jobId}`);
    }

    getApplicantsForJob = async(req, res)=>{
        const jobId = req.params.id;
        const job = await JobModel.getJobById(jobId);
    
        if (!job) {
            return res.status(404).send("Job not found!");
        }
    
        const applicants = job.applicants || []; 
    
        res.render("applicantsPage", { job, applicants });
    };
}
    
    
