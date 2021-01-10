// const JobDesc = require('../models/JobDesc')

const getProfile = async (req, res) => {
    res.send('user profile')
}

const getDashboard = async (req, res) => {
    res.send('user dashboard')
}

module.exports = { getProfile, getDashboard }
