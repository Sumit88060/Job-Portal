


export default class JobApplyModel{
 static add(id,applicant){
const application = {id, applicant}
           jobsApplications.push(application);

           return { success: true, message: "Application submitted successfully" };
 }
}

let jobsApplications = [];