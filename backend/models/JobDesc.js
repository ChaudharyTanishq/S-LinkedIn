const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    title: { type: String, required: true},
    recruiterName: { type: String, required: true},
    recruiterEmail: { type: String, required: true},
    jobScoreCurr: { type: Number, required: true},
    jobScoreTotal: { type: Number, required: true},
    positionsCurrent: { type: Number, min: 0, default: 0 },
    positionsMax: { type: Number, min: 1, default: 1, required: true },
    applicationsCurrent: { type: Number, min: 0, default: 0},
    applicationsMax: { type: Number, min: 1, default: 1, required: true },
    datePosting: { type: Date, default: Date.now},
    dateDeadline: { type: Date, required: true},
    requiredSkillSet: [{ type: String }],
    jobType: { type:String, required: true },
    duration: { type: Number, min: 0, max: 6, required: true },
    salary: { type: Number, min: 0, required: true },
    appliedApplications: [],
    shortListedApplications: [],
    acceptedApplications: [],
    rejectedApplications: [],
    rating: []
})

module.exports = mongoose.model('JobDesc', jobSchema)
