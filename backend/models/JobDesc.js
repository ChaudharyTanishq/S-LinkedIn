import mongoose from 'mongoose'

const jobSchema = mongoose.Schema({
    title: { type: String, required: true},
    recruiterName: { type: String, required: true},
    recruiterEmail: { type: String, required: true},
    recruiterScoreCurr: { type: Number, required: true},
    recruiterScoreTotal: { type: Number, required: true},
    positionsCurrent: { type: Number, min: 0, default: 0, required: true },
    positionsMax: { type: Number, min: 1, default: 1, required: true },
    applicationsCurrent: { type: Number, min: 0, default: 0, required: true },
    applicationsMax: { type: Number, min: 1, default: 1, required: true },
    datePosting: { type: Date, default: Date.now},
    dateDeadline: { type: Date, required: true},
    requiredSkillSet: [{ type: String, required: true}],
    jobType: { type:String, required: true },
    duration: { type: Number, min: 0, max: 6, required: true },
    salary: { type: Number, min: 0, required: true }
})

module.exports = mongoose.model('JobDesc', jobSchema)
