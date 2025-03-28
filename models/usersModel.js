const mongoose = require('mongoose');
// User model should have name, email, password, role

const userSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: true,
        trim: true,
    },
    email: {
        type: "String",
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: "String",
        required: true,
    },
    role: {
        type: "String",
        enum: ["admin", "user"],
        default: "user",
    },
    preferences: {
        type: {
            categories: {
                type: String,
                enum: ["business", "entertainment", "general", "health", "science", "sports", "technology"], // Define allowed categories
                // required: true, // Ensure it is always provided
            },
            languages: {
                type: String,
                enum: ["us","en"], // Define allowed languages
                // required: true, // Ensure it is always provided
            },
        },
        default: { categories: 'general', languages: 'en' }, // Ensures a default object is present
    },
    readArticles: {
        // type: [String],
        default: [],
    },
    favouriteArticles: {
        // type: [String],
        default: [],
    }

});


module.exports = mongoose.model('User', userSchema);