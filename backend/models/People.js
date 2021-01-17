const { bool } = require('joi')
const mongoose = require('mongoose')
// const JobDesc = require('./JobDesc')

const peopleSchema = mongoose.Schema({
    name: { type: String, required: true, min:4, max: 32},
    email: { type: String, required: true}, 
    password: { type: String, required: true, min: 8, max: 128},
    
    bio: {type: String, required: false},
    
    rating: [{ type: Number, default: [0, 0] }],
    isBoss: {type: Boolean, required: true, default: false}, 

    profilePic: { type: String, required: false}, 
    resume: { type: String, required: false}, 
    
    contact: { type: String, required: false}, 
    education: [],
    skills: [{ type: String, required: false }],
    
    appliedApplications: [],
    shortListedApplications: [],
    acceptedApplications: [],
    rejectedApplications: []

})

module.exports = mongoose.model('People', peopleSchema)
