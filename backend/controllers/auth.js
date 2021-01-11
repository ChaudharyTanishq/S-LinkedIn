const postSignup = async (req, res) => {
    res.send('signup!')
}

const postSignin = async (req, res) => {
    res.send('signin!')
}

module.exports = { postSignup, postSignin }
