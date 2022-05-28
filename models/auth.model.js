const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path');
const { stringify } = require('querystring');
const { reject } = require('bcrypt/promises');
const DB_URL = 'mongodb://localhost:27017/doctorat-webSite';
const userSchema = mongoose.Schema({
    userName: String,
    email: String,
    dateOfBirth: String,
    placeOfBirth: String,
    password: String,
    specialty: String,
})
const candidateSchema = mongoose.Schema({
    rate: Number,
    specialty: String
})
const User = mongoose.model('user', userSchema);
exports.createNewUser = (userName, email, dateOfBirth, placeOfBirth, password, specialty) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return User.findOne({ email: email })
        }).then((user) => {
            if (user) {
                mongoose.disconnect();
                reject('email is used...')
            } else {
                return bcrypt.hash(password, 10)
            }
        }).then((hashedPassword) => {
            let user = new User({
                userName: userName,
                email: email,
                dateOfBirth: dateOfBirth,
                placeOfBirth: placeOfBirth,
                password: hashedPassword,
                specialty: specialty
            })
            return user.save();
        }).then(() => {
            mongoose.disconnect();
            resolve('user saved...')
        }).catch((err) => {
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.signin = (email1, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, { useUnifiedTopology: true }).then(() => User.findOne({ email: email1 })).then(user => {
            if (!user) {
                mongoose.disconnect();
                reject('there is no user matches this email')
            } else {
                bcrypt.compare(password, user.password).then(same => {

                    if (!same) {
                        mongoose.disconnect();
                        reject('password is incorrect')
                    } else {
                        mongoose.disconnect();
                        resolve(user)
                    }
                })
            }
        })
    })
}
exports.getAllCorrectors = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return User.find({});
        }).then(correctors => {
            mongoose.disconnect();
            resolve(correctors)
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.deleteCorrector = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return User.findOneAndDelete({ _id: id })
        }).then(() => {
            mongoose.disconnect();
            resolve()
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        })
    })
}