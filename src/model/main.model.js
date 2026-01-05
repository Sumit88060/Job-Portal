export default class JobModel {
    constructor(id, companyName, applyDate, openings, field, position, location, salary, skills,postedBy) {
        this.id = id;
        this.companyName = companyName;
        this.applyDate = applyDate;
        this.openings = openings;
        this.position = position;
        this.address = location;
        this.salary = salary;
        this.skills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : []);
        this.field = field;
        this.applicants = [];
        this.applicantsCount = 0;
        this.postedBy = postedBy;
    }


    static searchResult(name){
        const jName= name.toLowerCase();
        const data = jobListings.filter((jobs)=>{
            if(jobs.companyName.toLowerCase() == jName){
                return jobs;
            }
        });

        return data;
    }

    static getJobById(jobId) {
        const job = jobListings.find(j => j.id == jobId);
        
        if (!job) return null;
    
        
        if (typeof job.applicantsCount !== "number") {
            job.applicantsCount = 0;
        }
    
        return job;
    }

    static getAllJobs() {
        return jobListings;
    }

    static update(updatedJob) {
        const index = jobListings.findIndex((j) => j.id == updatedJob.id);
        if (index !== -1) {
            console.log(`Updating Job ID ${updatedJob.id} in jobListings`);
            jobListings[index] = updatedJob;
        }else {
            console.log(` Failed to update: Job ID ${updatedJob.id} not found`);
        }
    }

    static updateJob(jobId, updateData) {
        const job = JobModel.getJobById(jobId);
        if (job) {

            console.log('before update',job);

            if (!updateData.postedBy) {
                updateData.postedBy = job.postedBy;
            }

            Object.assign(job, updateData);
            JobModel.update(job); 
            console.log("After Update:", job);
        }else {
            console.log("Job not found with ID:", jobId);
        }
    }

    static getNewJob(jobData) {
        let newJob = new JobModel(
            jobListings.length + 1,
            jobData.companyName,
            jobData.applyDate,
            jobData.openings,
            jobData.field,
            jobData.position,
            jobData.address,
            jobData.salary,
            Array.isArray(jobData.skills) ? jobData.skills : (typeof jobData.skills === 'string' ? jobData.skills.split(',').map(s => s.trim()) : []),
            jobData.postedBy
        );

        console.log("New Job Added:", newJob);
        jobListings.push(newJob);
    }

    static addapplicationForJob(jobId, applicant) {
        const job = JobModel.getJobById(jobId);
        
        if (!job){
            console.log(`Job with ID ${jobId} not found!`);
            return { success: false, message: "Job not found!" }};
            console.log(`🔍 Before Applying: Applicants Count for Job ${jobId} = ${job.applicantsCount}`);
    
        if (!Array.isArray(job.applicants)) {
            job.applicants = [];
        }
    
        const alreadyApplied = job.applicants.some(a => a.email === applicant.email);
        if (alreadyApplied) {
            console.log(`⚠️ User ${applicant.email} has already applied.`);
            return { success: false, message: "You have already applied for this job!" };
        }
    
        job.applicants.push(applicant);
        job.applicantsCount++; 

        JobModel.update(job); 
        
        console.log(` After Applying: Applicants Count for Job ${jobId} = ${job.applicantsCount}`);
        console.log(" Job Listings After Application:", JSON.stringify(jobListings, null, 2));
        return { success: true, message: "Application submitted successfully!" };
    }
    

    static getById(id) {
        return jobListings.find((i) => i.id == id);
    }

    static delete(id,recruiterEmail) {
        const index = jobListings.findIndex((i) => i.id == id);

        if (index === -1) {
            return { success: false, message: "Job not found!" };

        }
        
        const job = jobListings[index];

        if (job.postedBy !== recruiterEmail) {
            console.log(`Unauthorized: ${recruiterEmail} tried to delete job ${id}`);
            return { success: false, message: "Unauthorized: You can only delete your own jobs!" };
        }

        jobListings.splice(index, 1);
        return { success: true, message: "Job deleted successfully!" };
    }
    
}


const jobListings = [
    new JobModel(1, 'Coding Ninjas', '30 Aug 2025', 5, 'Tech', 'SDE', 'Gurgaon HR IND Remote', '₹14-20 LPA', ['React', 'NodeJS', 'JS', 'SQL', 'MongoDB', 'Express', 'AWS'],'recruiter1@example.com'),
    new JobModel(2, 'Go Digit', '30 Aug 2025', 6, 'Tech', 'Angular Developer', 'Pune IND On-Site', '₹6-10 LPA', ['Angular', 'JS', 'SQL', 'MongoDB', 'Express', 'AWS'],'recruiter2@example.com'),
    new JobModel(3, 'Juspay', '30 Aug 2025', 3, 'Tech', 'SDE', 'Bangalore IND', '₹20-26 LPA', ['React', 'NodeJS', 'JS', 'SQL', 'MongoDB', 'Express', 'AWS'],'recruiter3@example.com'),
];
