import mongoose from 'mongoose'
import Float from 'mongoose-float'

const jobSchema = mongoose.Schema({
    title: String,
    recruiterName: String,
    recruiterEmail: String,
    recruiterRating: Float,
    positionsCurrent: { type: Number, min: 0, default: 0 },
    positionsMax: { type: Number, min: 1, default: 1 },
    applicationsCurrent: { type: Number, min: 0, default: 0 },
    applicationsMax: { type: Number, min: 1, default: 1 },
    datePosting: { type: Date, default: Date.now},
    dateDeadline: Date,
    requiredSkillSet: [{ type: String}],
    jobType: String,
    duration: { type: Number, min: 0, max: 6 },
    salary: { type: Number, min: 0 }
})

const JobDesc = mongoose.model('JobDesc', jobSchema)

export default JobDesc
