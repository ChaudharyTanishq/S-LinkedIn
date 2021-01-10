const JobDesc = require('../models/JobDesc')

const getProfile = async (req, res) => {
    res.send('boss profile')
}

const createJob = async (req, res) => {
    const newJob = new JobDesc({
        title:  req.body.title,
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
        salary: req.body.salary
    })

    try {
        const savedNewJob = await newJob.save()
        res.status(200).json(savedNewJob)
    } catch(error) {
        res.status(502).json({message: err})        
    }
}

module.exports = { getProfile, createJob }
