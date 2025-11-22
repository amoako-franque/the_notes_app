const User = require('../models/User')
const passport = require('passport')
const { validationResult } = require('express-validator')

/**
 * GET /register
 * Registration page
 */
exports.registerPage = async (req, res) => {
    const locals = {
        title: "Register - Notes App",
        description: "Create a new account",
    }
    res.render('auth/register', {
        locals,
        errors: [],
        formData: {},
        hasGoogleAuth: !!process.env.GOOGLE_CLIENT_ID
    })
}

/**
 * POST /register
 * Handle user registration
 */
exports.register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body
    const errors = []
    const formData = { firstName, lastName, email }

    // Validation
    if (!firstName || !lastName || !email || !password) {
        errors.push({ msg: 'Please fill in all fields' })
    }
    if (password && password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' })
    }
    if (password !== confirmPassword) {
        errors.push({ msg: 'Passwords do not match' })
    }

    if (errors.length > 0) {
        return res.render('auth/register', {
            locals: {
                title: "Register - Notes App",
                description: "Create a new account",
            },
            errors,
            formData,
            hasGoogleAuth: !!process.env.GOOGLE_CLIENT_ID
        })
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { googleId: email }]
        })

        if (existingUser) {
            errors.push({ msg: 'Email already registered' })
            return res.render('auth/register', {
                locals: {
                    title: "Register - Notes App",
                    description: "Create a new account",
                },
                errors,
                formData,
                hasGoogleAuth: !!process.env.GOOGLE_CLIENT_ID
            })
        }

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            displayName: `${ firstName } ${ lastName }`,
            authMethod: 'local'
        })

        await newUser.save()

        // Auto login after registration
        req.login(newUser, (err) => {
            if (err) {
                console.error('Login error:', err)
                return res.redirect('/login')
            }
            return res.redirect('/dashboard')
        })
    } catch (error) {
        console.error('Registration error:', error)
        errors.push({ msg: 'Registration failed. Please try again.' })
        res.render('auth/register', {
            locals: {
                title: "Register - Notes App",
                description: "Create a new account",
            },
            errors,
            formData,
            hasGoogleAuth: !!process.env.GOOGLE_CLIENT_ID
        })
    }
}

/**
 * GET /login
 * Login page
 */
exports.loginPage = async (req, res) => {
    const locals = {
        title: "Login - Notes App",
        description: "Login to your account",
    }
    res.render('auth/login', {
        locals,
        errors: [],
        formData: {},
        hasGoogleAuth: !!process.env.GOOGLE_CLIENT_ID
    })
}

/**
 * POST /login
 * Handle user login
 */
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.render('auth/login', {
                locals: {
                    title: "Login - Notes App",
                    description: "Login to your account",
                },
                errors: [{ msg: info.message || 'Invalid email or password' }],
                formData: { email: req.body.email },
                hasGoogleAuth: !!process.env.GOOGLE_CLIENT_ID
            })
        }
        req.login(user, (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/dashboard')
        })
    })(req, res, next)
};

