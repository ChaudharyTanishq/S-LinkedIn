import JobDesc from '../models/jobs.js'

export const getProfile = async (req, res) => {
    console.log('slave profile')

    try {
        const jobdesc = JobDesc.find()
        res.status(200).json(jobdesc)
    } catch (error) {
        console.log(error)
        res.status(404).json({message: error.message})
    }

}

export const getDashboard = () => {
    console.log('slave dashboard')
}
