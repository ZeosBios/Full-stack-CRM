const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
   
    const candidate = await User.findOne({email: req.body.email})
    if (candidate){
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult){
            const token = jsonwebtoken.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.JWT, {expiresIn: 60 * 60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        }else{
            res.status(401).json({
                message: 'Passwords do not match. Try it again.'
            })
        }
    }else{
        res.status(404).json({
            message: 'User with this name is not found'
        })
    }
}

module.exports.register = async function(req, res){
   
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        res.status(409).json({
            message: 'This email is already taken'
        })
    } else {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password 
    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(password, salt)
    })

    try {
    await user.save()
    res.status(201).json(user)
    } catch(e){
        errorHandler(res, e)
    }
    }
}