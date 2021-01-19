const JobDesc = require('../models/JobDesc')
const jwt = require('jsonwebtoken')
const People = require('../models/People')

const postRating = async (req, res) => {
    try {
        const token = req.header('auth-token')    
        req.user = jwt.verify(token, "TOKEN_SECRET")
        
        // console.log(req.body)
        // console.log(req.body.jobId)
        const job = await JobDesc.findById(req.body.jobId)

        if(!job.rating.length){
            job.rating = [0, 0]
        }

        let temp = [
            job.rating[0] + parseInt(req.body.rating),
            job.rating[1] + 5
        ]

        job.rating = temp

        // console.log('rating:', job.rating)
        job.save()
        res.status(200).send('success')
    } catch(error) {
        res.status(502).send({message: error})
    }
}

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
        person.skills = req.body.skills

        person.save()
        res.json(person)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

const updateEducation = async (req, res) => {
    try {
        const token = req.header('auth-token')    
        req.user = jwt.verify(token, "TOKEN_SECRET")
        const person = await People.findById({_id: req.user._id})

        // console.log('this is the request', req)

        // do something
        person.education = req.body
        // console.log(person.education)

        person.save()
        res.json(person)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

// lists all the jobs
const getDashboard = async (req, res) => {
    try {
        const jobs = await JobDesc.find()
        res.json(jobs)
    } catch(error) {
        res.json({message: error.message})
    }
}

// shows a specific job
const showJob = async (req, res) => {
    try {
        const job = await JobDesc.findById(req.params.jobId)
        res.json(job)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

// NOTE: ACCESS THIS ONLY AFTER THAT BIG ASS SWITCH STATEMENT 
const applyJob = async (req, res) => {
    // NOTE: VERIFICATION NOT NEEDED, WE CAN DIRECTLY USE!
    // getting the token
    const token = req.header('auth-token')    
    req.user = jwt.verify(token, "TOKEN_SECRET")
    const person = await People.findOne({_id: req.user._id})
    
    // console.log('IMPORTANT  REQUEST CHECK KEYS', req.body.SOP)

    //adding a new job request
    try {
        const job = await JobDesc.findById(req.params.jobId)
        // if(!job.appliedApplications.includes(JSON.stringify(person))) 
            job.appliedApplications.push({
                personId: person._id,
                name: person.name,
                SOP: req.body.SOP,
                rating: person.rating,
                date: new Date(),
                resume: person.resume,
                skills: person.skills
            })
        // if(!person.appliedApplications.includes(JSON.stringify(job))) 
            person.appliedApplications.push({jobId: job._id, jobTitle: job.title})
        
        // console.log('PERSON ID', person._id)
        // console.log('JOB ID', req.params.jobId)
        
        // console.log(job.appliedApplications)
        // console.log(person.appliedApplications)
        
        job.applicationsCurrent = job.appliedApplications.length

        job.save()
        person.save()
        // console.log(job.appliedApplications)
        // console.log(person.appliedApplications)
        res.json(job)
    } catch(error) {
        res.status(502).send({message: error})
    }
}

const getApplications = async (req, res) => {
    // NOTE: VERIFICATION NOT NEEDED, WE CAN DIRECTLY USE!
    // getting the token
    const token = req.header('auth-token')    
    req.user = jwt.verify(token, "TOKEN_SECRET")
    const person = await People.findOne({_id: req.user._id})
    
    // going through all the person's jobs list,
    // and filling in
    try {
        res.status(200).send([
            person.appliedApplications,
            person.shortListedApplications,
            person.acceptedApplications,
            person.rejectedApplications
        ])
    } catch(error) {
        res.status(502).send({message: error})
    }
}

module.exports = {
    getProfile,
    getDashboard,
    showJob,
    applyJob,
    getApplications,
    updateProfile,
    updateEducation,
    postRating
}
