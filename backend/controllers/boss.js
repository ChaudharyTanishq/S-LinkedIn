const JobDesc = require('../models/JobDesc')
const jwt = require('jsonwebtoken')
const People = require('../models/People')

const getProfile = async (req, res) => {
    try {
        const token = req.header('auth-token')    
        req.user = jwt.verify(token, "TOKEN_SECRET")
        const person = await People.findOne({_id: req.user._id})
        res.json(person)
    } catch(error) {
        res.status(502).send({message: error})
    }
}


// WORKS
const createJob = async (req, res) => {
    const newJob = new JobDesc({
        title: req.body.title,
        recruiterName: req.body.recruiterName,
        recruiterEmail: req.body.recruiterEmail,
        jobScoreCurr: 0,
        jobScoreTotal: 0,
        positionsCurrent: 0,
        positionsMax: req.body.positionsMax,
        applicationsCurrent: 0,
        applicationsMax: req.body.applicationsMax,
        datePosting: req.body.datePosting,
        dateDeadline: req.body.dateDeadline,
        requiredSkillSet: req.body.requiredSkillSet,
        jobType: req.body.jobType,
        duration: req.body.duration,
        salary: req.body.salary,
        appliedApplications: [],
        shortListedApplications: [],
        acceptedApplications: [],
        rejectedApplications: []
    })

    try {
        const savedNewJob = await newJob.save()
        res.status(200).json(savedNewJob)
    } catch(error) {
        res.status(502).json(error)        
    }
}


// WORKS
const deleteJob = async (req, res) => {
    try {
        // const job = await JobDesc.findOneAndDelete(req.params.jobId)
        const job = await JobDesc.findById(req.params.jobId)

        // logic to remove this listing from all applicants' lists
        

        // takes a list from this job, and kills any signs left of
        // this job for persons
        const killJob = async (applicationAll)=>{
            for(let i = 0; i < applicationAll.length; i++){
                let currentApplicantId = applicationAll[i].personId
                const person = await People.findById(currentApplicantId)
    
    
                // removin this job from all the lists this job could be in, 
                // for any person
                person.appliedApplications = person.appliedApplications.filter(
                    (application)=> application.jobId != job._id
                )
    
                person.shortListedApplications = person.shortListedApplications.filter(
                    (application)=> application.jobId != job._id
                )
    
                person.acceptedApplications = person.acceptedApplications.filter(
                    (application)=> application.jobId != job._id
                )
    
                person.rejectedApplications = person.rejectedApplications.filter(
                    (application)=> application.jobId != job._id
                )
                
                person.save()
            }
        }

        killJob(job.appliedApplications)
        killJob(job.shortListedApplications)
        killJob(job.acceptedApplications)
        killJob(job.rejectedApplications)
        
        const jobKilled = await JobDesc.findOneAndDelete(req.params.jobId)
        // console.log(job)
        res.json(jobKilled)
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
        const jobs = await JobDesc.find({recruiterEmail: person.email})
        res.json(jobs)
    } catch(error) {
        console.log(error)
        res.status(502).send({message: error.message})
    }
}

// ADD FUNCTIONALITY TO DISPLAY CURRENT STATUS OF ALL THE APPLICANTS
// for frontend 
const showJob = async (req, res) => {
    try {
        // shows all the lists
        const job = await JobDesc.findById(req.params.jobId)
        res.status(200).send(job)
    } catch(error) {
        res.status(502).send({message: error})
    }    
}

// changes whatever list the users belong to
// all the changes happen in the frontend
// CHECK WORKING
// UPDATE WORKING ACCORDING TO NEW ITEMS PUSHED
// CHECK USER ROUTE FOR APPLICATION
const updateApplicationsJob = async (req, res) => {
    try {
        const job = await JobDesc.findById(req.params.jobId)

        // updating all the application lists for the job
        job.appliedApplications = [...(new Set(req.body[0]))]
        job.shortListedApplications = [...(new Set(req.body[1]))]
        job.acceptedApplications = [...(new Set(req.body[2]))]
        job.rejectedApplications = [...(new Set(req.body[3]))]

        // console.log('job save karo yaaron', job);

        // updating current count of positions and applications
        job.applicationsCurrent = job.appliedApplications.length
        job.positionsCurrent = job.acceptedApplications.length
        const updatedJob = await job.save()

        // METHOD
        // updating the application lists for the users in them
        // case 1: applied -> shortlist
        for(let i = 0; i < job.shortListedApplications.length; i++){
            let currentApplicantId = job.shortListedApplications[i].personId
            const person = await People.findById(currentApplicantId)

            // remove that job from applied
            // old method
            // const index = person.appliedApplications.indexOf(req.params.jobId);
            // if (index > -1) person.appliedApplications.array.splice(index, 1)
            
            // new method
            person.appliedApplications = person.appliedApplications.filter(
                (application)=> application.jobId != job._id
            )
        
            // add that job to shortlist
            person.shortListedApplications.push(
                {jobId: job._id, jobTitle: job.title}
            )
            person.save()
        }

        // case 2: shortlist -> accept
        for(let i = 0; i < job.acceptedApplications.length; i++){
            let currentApplicantId = job.acceptedApplications[i].personId
            const person = await People.findById(currentApplicantId)

            // remove that job from applied
            // old method
            // const index = person.appliedApplications.indexOf(req.params.jobId);
            // if (index > -1) person.appliedApplications.array.splice(index, 1)
            
            // new method
            // accept can only happen after shortlisted
            // thus, below is not needed
            // person.appliedApplications = person.appliedApplications.filter(
            //     (application)=> application.jobId != job._id
            // )
        
            person.shortListedApplications = person.shortListedApplications.filter(
                (application)=> application.jobId != job._id
            )

            // note that now rest of the jobs for all person's list go into rejected
            // auto-reject
            // extension syntax: a.push.apply(a, b)
            person.rejectedApplications.push.apply(
                person.rejectedApplications, person.appliedApplications
            )
            person.appliedApplications = []
            person.rejectedApplications.push.apply(
                person.rejectedApplications, person.shortListedApplications
            )
            person.shortListedApplications = []

            // so its fine for the person now, 
            // but not for each and every job they belonged to

            // go over the rejected array to update all lists for the jobs
            for (let j = 0; j < person.rejectedApplications.length; j++) {
                const element = person.rejectedApplications[j];
                // console.log("TROUBLE: ",element)
                const tempJob = await JobDesc.findById(element.jobId)
                
                // now inside of the temp job, we go through all the valid lists
                // and then remove this guy
                tempJob.appliedApplications = tempJob.appliedApplications.filter(
                    (applicationPerson)=>applicationPerson.personId != person._id
                )

                tempJob.shortListedApplications = tempJob.shortListedApplications.filter(
                    (applicationPerson)=>applicationPerson.personId != person._id
                )
                // should not be needed, but eh 
                tempJob.acceptedApplications = tempJob.acceptedApplications.filter(
                    (applicationPerson)=>applicationPerson.personId != person._id
                )


                // what if the guy is already in rejected?
                // well, WE FUCKING REJECT HIM AGAIN 
                tempJob.acceptedApplications = tempJob.acceptedApplications.filter(
                    (applicationPerson)=>applicationPerson.personId != person._id
                )

                // now, add this guy in rejected list
                tempJob.rejectedApplications.push({
                    personId: person._id,
                    name: person.name,
                    SOP: req.body.SOP,
                    rating: person.rating,
                    date: new Date(),
                    resume: person.resume,
                    skills: person.skills
                })

                tempJob.save()
            }

            // FINALLY add that original source job to accepted in the person's list
            person.acceptedApplications.push(
                {jobId: job._id, jobTitle: job.title, time: new Date()}
            )
            person.save()
        }

        // old function to do the above shit
        // also, wtf just happened
        // // case 2: shortlist -> accept
        // for(let i = 0; i < job.shortListedApplications.length; i++){
        //     let currentApplicantId = job.shortListedApplications[i]
        //     const person = await People.findById(currentApplicantId)

        //     // remove that job from shortlisted
        //     const index = person.shortListedApplications.indexOf(req.params.jobId);
        //     if (index > -1) person.shortListedApplications.array.splice(index, 1)
            
        //     // add that job to accepted, saving the time as well
        //     person.acceptedApplications.push((req.params.jobId, new Date()))
        //     person.save()
        // }

        // case 3: any -> reject
        for(let i = 0; i < job.rejectedApplications.length; i++){
            let currentApplicantId = job.rejectedApplications[i].personId
            const person = await People.findById(currentApplicantId)

            // remove that job from applied
            person.appliedApplications = person.appliedApplications.filter(
                (application)=> application.jobId != job._id
            )     

            // remove that job from shortlisted
            person.shortListedApplications = person.shortListedApplications.filter(
                (application)=> application.jobId != job._id
            )

            // remove that job from accepted
            person.acceptedApplications = person.acceptedApplications.filter(
                (application)=> application.jobId != job._id
            )

            // WHY FUCKING NOT
            person.rejectedApplications = person.rejectedApplications.filter(
                (application)=> application.jobId != job._id
            )

            // and now add that job to rejected
            person.rejectedApplications.push(
                {jobId: job._id, jobTitle: job.title, time: new Date()}
            )
            person.save()
        }

        res.status(200).json(updatedJob)
    } catch(error) {
        console.log(error)
        res.status(502).send({message: error.message})
    }    
}

const updateProfile = async (req, res) => {
    try {
        const token = req.header('auth-token')    
        req.user = jwt.verify(token, "TOKEN_SECRET")
        const person = await People.findById({_id: req.user._id})

        // updating each field
        person.email = req.body.email
        person.name = req.body.name
        person.contact = req.body.contact
        person.password = req.body.password
        person.bio = req.body.bio

        person.save()
        res.json(person)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

const getAccepted = async (req, res) => {
    try {
        const token = req.header('auth-token')    
        req.user = jwt.verify(token, "TOKEN_SECRET")
        // here the person is the boss, 
        // whoose application list we are going to read out
        const person = await People.findOne({_id: req.user._id})
        
        // lists out all the jobs
        let jobs = await JobDesc.find()
        jobs = jobs.filter((job)=>{
            // console.log('one job email:', job.recruiterEmail)
            return job.recruiterEmail == person.email
        })

        
        // console.log('person email:', person.email)
        // console.log('shortlisted jobs:', jobs)

        let acceptedUsers = []
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            for (let j = 0; j < job.acceptedApplications.length; j++) {
                let element = job.acceptedApplications[j];
                element.jobType = job.jobType
                element.jobTitle = job.title
                acceptedUsers.push(element)
            }
        }

        console.log(acceptedUsers)

        res.json(acceptedUsers)
    } catch(error) {
        res.status(502).send({message: error})
    }
}


const getSkills = async (req, res) => {
    try {
        let skills = []

        // adding skills listed out required for jobs
        const jobs = await JobDesc.find()
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            
            for (let j = 0; j < job.requiredSkillSet.length; j++) {
                const skill = job.requiredSkillSet[j];
                skills.push(skill)
            }
        }

        // console.log('after', skills)

        // adding skills listed out by other users
        const people = await People.find()
        for (let i = 0; i < people.length; i++) {
            const person = people[i];

            for (let j = 0; j < person.skills.length; j++) {
                const skill = person.skills[j];
                skills.push(skill)
            }
        }

        // console.log('after', skills)
        

        skills = [...(new Set(skills))]

        // console.log(skills)

        res.json(skills)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

module.exports = {
    getProfile,
    createJob,
    deleteJob,
    updateJob,
    showJob,
    getMyJobs,
    updateApplicationsJob,
    updateProfile,
    getAccepted,
    getSkills
}
