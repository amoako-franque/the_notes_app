const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema
const UserSchema = new Schema({
    // Google OAuth fields (optional)
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    // Local authentication fields (optional)
    email: {
        type: String,
        sparse: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
    },
    // Common fields
    displayName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    profileImage: {
        type: String
    },
    authMethod: {
        type: String,
        enum: ['google', 'local'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.authMethod !== 'local') {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    if (this.authMethod !== 'local') {
        return false
    }
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)