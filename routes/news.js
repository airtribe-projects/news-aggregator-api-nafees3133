const express = require("express");
const router = express.Router();
router.use(express.json());
const jwt = require('jsonwebtoken');
const NEWSAPI = process.env.NEWSAPI
const JWT_SECRET = process.env.JWT_SECRET
const usersModel = require("../models/usersModel");
const NodeCache = require('node-cache')
const myCache = new NodeCache()

const axios = require('axios');

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

const getNewsMiddlewareHandler = async (req,res,next) => {
    const dbUser = await usersModel.findOne({ email: req.decodedToken.email });
    userkey = `${dbUser.email}-Key`;
    console.log(userkey);
    let mynews;
    if(myCache.has(userkey)){
        console.log('Retrieved value from cache !!')
        mynews = myCache.get(userkey)
        req.mynews = mynews;
    } else{
        const news = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
                category: dbUser.preferences.categories,
                language: dbUser.preferences.languages,
                apiKey: NEWSAPI,
            },
        });
        myCache.set(userkey, news.data.articles, 20)
        console.log('Value not present in cache,'
            + ' performing computation')
        mynews = news.data.articles
        req.mynews = mynews;
    }
    next()
}

const getNewsHandler = async (req, res) => {
    const dbUser = await usersModel.findOne({ email: req.decodedToken.email });
    userkey = `${dbUser.email}-Key`;
    console.log(userkey);
    if(myCache.has(userkey)){
        console.log('Retrieved value from cache !!')
        res.send(myCache.get(userkey))
   } else{
        const news = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
                category: dbUser.preferences.categories,
                language: dbUser.preferences.languages,
                apiKey: NEWSAPI,
            },
        });
        myCache.set(userkey, news.data.articles, 60)
        
        console.log('Value not present in cache,'
              + ' performing computation')
        newsfornxt = news.data.articles
        res.send(news.data.articles)
   }
}

let tempmemRead = [];
const markReadNewsHandler = async(req,res) => {
   mynews = req.mynews;
   if (req.params.id > mynews.length || req.params.id < 1){
       res.status(404).send("Invalid news id");
   }else{
    let id = req.params.id;
    console.log("id: "+id);

    if (false){
        res.status(404).send("Invalid news id");
    }else{
    id = id-1;
    console.log("lenght = ", mynews.length);
    console.log(mynews[id]);
    tempmemRead.push(mynews[id]);
    res.send("Read_noted");
    }
    }
}

const getNewsRead = async (req, res) => {
    res.send(tempmemRead)
}

let tempmemFav = [];
const markFavNewsHandler = async(req,res) => {
   mynews = req.mynews;
   if (req.params.id > mynews.length || req.params.id < 1){
       res.status(404).send("Invalid news id");
   }else{
    let id = req.params.id;
    console.log("id: "+id);

    if (false){
        res.status(404).send("Invalid news id");
    }else{

    id = id-1;
    console.log("lenght = ", mynews.length);
    console.log(mynews[id]);
    tempmemFav.push(mynews[id]);
    res.send("Read_noted");
    }
    }
}

const getNewsFav = async (req, res) => {
    res.send(tempmemFav)
}

router.get("/", [authorizationMiddleware], getNewsHandler);
router.post("/:id/read", [authorizationMiddleware, getNewsMiddlewareHandler], markReadNewsHandler);
router.get("/read/", [authorizationMiddleware], getNewsRead);
router.post("/:id/fav", [authorizationMiddleware, getNewsMiddlewareHandler], markFavNewsHandler);
router.get("/fav/", [authorizationMiddleware], getNewsFav);


module.exports = router;