const express = require("express");
const router = express.Router();
router.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const valid = require("validator");

const usersModel = require("../models/usersModel");

const registerUserHandler = async (req, res) => {
    const user = req.body;
    console.log(user);
    const emailToValidate = user.email;
    console.log(valid.isEmail(emailToValidate)
        ? true
        : false);
    const isvalid = valid.isEmail(emailToValidate)? true: false
    console.log(isvalid);
    if (!isvalid) {
        return res.status(400).send({message: "Invalid Email"});
    }
    console.log(user.password.length);
    if (user.password.length < 10) {
        return res.status(400).send({message: "Password must be at least 10 characters long"});
    }
    user.password = bcrypt.hashSync(user.password, saltRounds);
    const dbUser = await usersModel.create(user);
    console.log(dbUser);
    res.send(dbUser);
};


const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;

    const body = {
        email: email
    };

    const dbUser = await usersModel.findOne(body);

    if (!dbUser) {
        return res.status(404).send({messsage: "User not found"});
    }

    const isSamePassword = await bcrypt.compare(password,dbUser.password);
    
    if (!isSamePassword) {
        return res.status(401).send({message :"Invalid Password"});
    }
    const token = jwt.sign({email: dbUser.email, role: dbUser.role}, JWT_SECRET, {expiresIn: "7d"});
    // const token = jwt.sign({email: dbUser.email, role: dbUser.role, preferences: dbUser.preferences }, JWT_SECRET, {expiresIn: "7d"});

    const response = {_id: dbUser._id, email: dbUser.email, role: dbUser.role};
    console.log(response);
    return res.status(200).send({token: token});
}


// auth 
const authorizationMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).send({message: "Token is required"});
    }

    let decodedToken; 
   
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return res.status(401).send({message: "Invalid Token"});
    }
    
    req.decodedToken = decodedToken;
    next();
}
//

const getPreferencesHandler = async (req, res) => {
    try {
        const dbUser = await usersModel.findOne({ email: req.body.email });
        if (!dbUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!dbUser.preferences) {
            return res.json({ categories: 'null', languages: 'null' });
        }
        res.json(dbUser.preferences);
    } catch (error) {
        console.error("Preferences Fetch Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updatePreferencesHandler = async (req, res) => {
    try {
        const { email, categorie, language } = req.body;
        const body = req.body;
        console.log(body.categories, body.languages );

        // console.log(body);
        const dbUser = await usersModel.findOneAndUpdate(
            { email: body.email },
            { preferences: {categories: body.categories, languages: body.languages} },
            // { $push:{ preferences: {categories: body.categories, languages: body.languages} }},
            // {preferences: "dummy"},
            { new: true }
        );

        if (!dbUser) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(dbUser);
        res.json({ message: "Preferences updated", preferences: dbUser.preferences });
    } catch (error) {
        console.error("Preferences Update Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

router.post("/register", registerUserHandler);
router.post("/login", loginUserHandler);

router.get("/preferences", authorizationMiddleware, getPreferencesHandler);
router.put("/preferences", authorizationMiddleware, updatePreferencesHandler);
module.exports = router;
