const JobDesc = require('../models/JobDesc')

const getProfile = async (req, res) => {
    res.send('user profile')
}

const getDashboard = async (req, res) => {

    try {
        const jobs = await JobDesc.find()
        res.json(jobs)
    } catch(error) {
        res.json({message: error.message})
    }

}

module.exports = { getProfile, getDashboard }
