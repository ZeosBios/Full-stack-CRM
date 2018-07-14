const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

const options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT
}

module.exports = passport => {
    passport.use(
        new jwtStrategy(options, async (payload, done) =>{
            try{
            const user = await User.findById(payload.userId).select('email id')
            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        }catch(e){
            errorHandler(res, e)
        }
        })
    )
}