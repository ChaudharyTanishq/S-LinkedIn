const People = require('../models/People')
const jwt = require('jsonwebtoken')
const { signupValidate, signinValidate } = require('./validate')

const postSignup = async (req, res) => {
    // validate all the requirement constraints
    const { error } = signupValidate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)

    // checking if a person already exists
    if(await People.findOne({email: req.body.email}))
        return res.status(400).send("email already exists!")

    // making a person
    const newPerson = new People({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isBoss: req.body.isBoss
    })


    // saving the person
    try {
        const savedPerson = await newPerson.save()
        res.status(200).json(savedPerson)
    } catch(error) {
        res.status(502).json({message: error})        
    }
}

const postSignin = async (req, res) => {
    // validate all the requirement constraints
    const { error } = signinValidate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)

    
    // checking if a person doesn't already exists
    const person = await People.findOne({email: req.body.email})
    if (!person){
        return res.status(401).send("email doesn't exists!")
    } else if (person.password != req.body.password) {
        return res.status(401).send("password is wrong!")
    }


    // create and assign token
    const token = jwt.sign({_id: person._id}, "TOKEN_SECRET")
    return res.status(200).json({token: token}).send("success!")
}

module.exports = { postSignup, postSignin }
