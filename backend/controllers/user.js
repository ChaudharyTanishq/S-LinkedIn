const JobDesc = require('../models/JobDesc')
const jwt = require('jsonwebtoken')
const People = require('../models/People')

const getProfile = async (req, res) => {
    res.send('user profile')
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
            job.appliedApplications.push({personId: person._id, personName: person.name, SOP: req.body.SOP})
        // if(!person.appliedApplications.includes(JSON.stringify(job))) 
            person.appliedApplications.push({jobId: job._id, jobTitle: job.title})
        
        // console.log('PERSON ID', person._id)
        // console.log('JOB ID', req.params.jobId)
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
    getApplications
}
