const mongoose = require('mongoose')
const JobDesc = require('./JobDesc')

const educationSchema = mongoose.Schema({
    instituteName: { type: String, required: true},
    yearStart: { type: Date, required: true},
    yearEnd: { type: Date, required: false},
})

const peopleSchema = mongoose.Schema({
    name: { type: String, required: true, min:4, max: 32},
    email: { type: String, required: true}, 
    password: { type: String, required: true, min: 8, max: 128},
    education: [{ type: educationSchema, required: false }],
    profilePic: { type: String, required: false}, 
    resume: { type: String, required: false}, 
    contact: { type: String, required: false}, 
    skills: [{ type: String, required: false }], 
    rating: [{ type: Number, default: [0, 0] }],
    // validApplications: [{ type: JobDesc.ObjectIds, required: false }],
    // invalidApplications: [{ type: JobDesc.ObjectId, required: false }]
})

module.exports = mongoose.model('People', peopleSchema)
