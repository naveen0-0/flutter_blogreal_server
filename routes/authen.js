const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
    return jwt.sign(username, process.env.ACCESS_TOKEN);
}

//* SignUp Route
router.route('/signup').post( async (req,res) => {
    const { username, password } = req.body;
    let userWithUsername = await User.findOne({ username })
    if(userWithUsername) return res.send({ statusload : false , feedback : "Username Taken"})

    try {
        let user = await User.create({ username, password })
        console.log(user)
        return res.send({ statusload: true, feedback:"Account Created",token:generateAccessToken(username), user : { username : user.username, loggedIn : true } })
    } catch (error) {
        console.log(error);
        return res.send({ statusload : false , feedback : "Error happened creating account"})   
    }
})

//* Login User
router.route('/signin').post( async (req,res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username : username })
        if(user){
            if(user.password === password){
                jwt.sign({ username : username },process.env.ACCESS_TOKEN,(err,token) => {
                    if(err) return res.send({ statusload: false, feedback:"Error while creating token"})
                    res.send({ statusload: true, msg:"Successfully logged in",token:token,user:{ username:user.username, loggedIn:true}})
                })
            }else{
                return res.send({ statusload: false, feedback:"Incorrect Password"})
            }
        }else{
            return res.send({ statusload: false, feedback:"Incorrect Username"})
        }
    } catch (error) {
        return res.send({ statusload: false, feedback:"Error logging in"})
    }
})


router.route('/getuser').get( async (req,res) => {
    const logintoken = req.headers.token
    console.log(logintoken)
    if(logintoken){
        jwt.verify(logintoken,process.env.ACCESS_TOKEN,async (err,decoded) => {
            if(err) return res.send({ statusload:false,msg:"error getting the user" })
            const user = await User.findOne({ username : decoded.username })
            return res.send({ statusload:true, user:{ username : user.username, loggedIn:true }})
        })
    }
    else{
        res.send({ statusload:false, user:{ username : "", loggedIn:false }})
    }
})

module.exports = router;