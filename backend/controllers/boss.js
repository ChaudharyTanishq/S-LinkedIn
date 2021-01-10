const JobDesc = require('../models/JobDesc')

const getProfile = async (req, res) => {
    res.send('boss profile')
}

const createJob = async (req, res) => {
    console.log(req.body)
    res.send('ok')
}

module.exports = { getProfile, createJob }
