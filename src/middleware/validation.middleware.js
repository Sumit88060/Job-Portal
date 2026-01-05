import JobModel from "../model/main.model.js"; 
import {
  body,
  validationResult,
} from 'express-validator';

const validateRequest = async (req, res, next) => {
  console.log(req.body);

  const rules = [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("contact")
      .notEmpty()
      .withMessage("Mobile number is required")
      .isMobilePhone("en-IN") 
      .withMessage("Invalid mobile number"),

    body("resume").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Resume is required");
      }
      const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        throw new Error("Only PDF, JPEG, and PNG files are allowed");
      }
      return true;
    }),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  console.log(validationErrors);

  if (!validationErrors.isEmpty()) {
    
    const jobId = req.params.id;
    const job = await JobModel.getJobById(jobId);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    return res.render("jobsForm", {
      job, 
      errorMessage: validationErrors.array()[0].msg,
    });
  }

  next();
};

export default validateRequest;
