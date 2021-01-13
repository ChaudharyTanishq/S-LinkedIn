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
    
    //adding a new job request
    try {
        const job = await JobDesc.findById(req.params.jobId)
        job.appliedApplications.push(person._id)
        job.save()
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
    
    // going through all the jobs, and filling in the lists
    try {
        const person = await People.findOne({_id: req.user._id})
        res.send([
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
