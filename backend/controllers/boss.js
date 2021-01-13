const JobDesc = require('../models/JobDesc')
const jwt = require('jsonwebtoken')
const People = require('../models/People')
const { json } = require('express')

// COMPLETE IT
const getProfile = async (req, res) => {
    res.send('boss profile')
}


// WORKS
const createJob = async (req, res) => {
    const newJob = new JobDesc({
        title: req.body.title,
        recruiterName: req.body.recruiterName,
        recruiterEmail: req.body.recruiterEmail,
        recruiterScoreCurr: req.body.recruiterScoreCurr,
        recruiterScoreTotal: req.body.recruiterScoreTotal,
        positionsCurrent: req.body.positionsCurrent,
        positionsMax: req.body.positionsMax,
        applicationsCurrent: req.body.applicationsCurrent,
        applicationsMax: req.body.applicationsMax,
        datePosting: req.body.datePosting,
        dateDeadline: req.body.dateDeadline,
        requiredSkillSet: req.body.requiredSkillSet,
        jobType: req.body.jobType,
        duration: req.body.duration,
        salary: req.body.salary,
        appliedApplications: req.body.appliedApplications,
        shortListedApplications: req.body.shortListedApplications,
        acceptedApplications: req.body.acceptedApplications,
        rejectedApplications: req.body.rejectedApplications
    })

    try {
        const savedNewJob = await newJob.save()
        res.status(200).json(savedNewJob)
    } catch(error) {
        res.status(502).json({message: err})        
    }
}


// WORKS
const deleteJob = async (req, res) => {
    try {
        const job = await JobDesc.findOneAndDelete(req.params.jobId)
        res.json(job)
    } catch(error) {
        res.status(502).send({message: error})
    }
}


// WORKS
const updateJob = async (req, res) => {
    try {
        const job = await JobDesc.findOneAndUpdate(req.params.jobId, {
            positionsMax: req.body.positionsMax,
            applicationsMax: req.body.applicationsMax,
            dateDeadline: req.body.dateDeadline
        })
        const updatedJob = await job.save()
        res.json(updatedJob)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

// WORKS
const getMyJobs = async (req, res) => {
    // getting the token
    const token = req.header('auth-token')


    // getting hold of the boss
    req.user = jwt.verify(token, "TOKEN_SECRET")
    let person = await People.findOne({_id: req.user._id})

    // getting that boss's job list
    try {
        const jobs = await JobDesc.findOne({recruiterEmail: person.email})
        res.json(jobs)
    } catch(error) {
        console.log(error)
        res.status(502).send({message: error})
    }
}

// ADD FUNCTIONALITY TO DISPLAY CURRENT STATUS OF ALL THE APPLICANTS
// for frontend 
const showJob = async (req, res) => {
    try {
        // shows all the lists
        const applications = await JobDesc.findById(req.params.jobId)
        res.status(200).send([
            applications.appliedApplications,
            applications.shortListedApplications,
            applications.acceptedApplications,
            applications.rejectedApplications
        ])
    } catch(error) {
        res.status(502).send({message: error})
    }    
}

// changes whatever list the users belong to
// all the changes happen in the frontend
// CHECK WORKING
const updateApplicationsJob = async (req, res) => {
    try {
        const job = await JobDesc.findById(req.params.jobId)

        // updating all the application lists for the job
        job.appliedApplications = [...(new Set(req.params.appliedApplications))]
        job.shortListedApplications = [...(new Set(req.params.shortListedApplications))]
        job.acceptedApplications = [...(new Set(req.params.acceptedApplications))]
        job.rejectedApplications = [...(new Set(req.params.rejectedApplications))]
        
        // // updating current count of positions and applications
        // job.applicationsCurrent = job.appliedApplications.length
        // job.positionsCurrent = job.acceptedApplications.length
        const updatedJob = await job.save()

        // updating the application lists for the users in them
        // case 1: applied -> shortlist
        for(let i = 0; i < job.shortListedApplications.length; i++){
            let currentApplicantId = job.shortListedApplications[i]
            const person = await People.findById(currentApplicantId)

            // remove that job from applied
            const index = person.appliedApplications.indexOf(req.params.jobId);
            if (index > -1) person.appliedApplications.array.splice(index, 1)
            // add that job to shortlist
            person.shortListedApplications.push(req.params.jobId)
            person.save()
        }

        // case 2: shortlist -> accept
        for(let i = 0; i < job.shortListedApplications.length; i++){
            let currentApplicantId = job.shortListedApplications[i]
            const person = await People.findById(currentApplicantId)

            // remove that job from shortlisted
            const index = person.shortListedApplications.indexOf(req.params.jobId);
            if (index > -1) person.shortListedApplications.array.splice(index, 1)
            
            // add that job to accepted, saving the time as well
            person.acceptedApplications.push((req.params.jobId, new Date()))
            person.save()
        }

        // case 3: any -> reject
        for(let i = 0; i < job.rejectedApplications.length; i++){
            let currentApplicantId = job.rejectedApplications[i]
            const person = await People.findById(currentApplicantId)

            // remove that job from applied
            const index1 = person.appliedApplications.indexOf(req.params.jobId);
            if (index1 > -1) person.appliedApplications.array.splice(index1, 1)
            

            // remove that job from shortlisted
            const index2 = person.shortListedApplications.indexOf(req.params.jobId);
            if (index2 > -1) person.shortListedApplications.array.splice(index2, 1)
            

            // remove that job from accepted
            const index3 = person.acceptedApplications.indexOf(req.params.jobId);
            if (index3 > -1) person.acceptedApplications.array.splice(index3, 1)
            

            // and now add that job to rejected
            person.rejectedApplications.push(req.params.jobId)
            person.save()
        }

        res.status(200).json(updatedJob)
    } catch(error) {
        console.log(error)
        res.status(502).send({message: error.message})
    }    
}

module.exports = {
    getProfile,
    createJob,
    deleteJob,
    updateJob,
    showJob,
    getMyJobs,
    updateApplicationsJob
}
