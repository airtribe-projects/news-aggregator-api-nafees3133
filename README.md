# News Aggregator API

## Overview
This project is a Node.js API built using Express and MongoDB. It provides endpoints for managing users and news articles. The application is structured to handle RESTful API requests and store data in a MongoDB database.

## Installation

### Prerequisites
- Node.js (>= v18)
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- NPM or Yarn

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/airtribe-projects/news-aggregator-api-nafees3133.git
   cd news-aggregator-api-nafees3133
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the environment variables:
   - Create a `.env` file in the project root and add the following:
     ```env
      PORT=3000
      MONGODB_URI=mongodb+srv://nafeesahamed3133:qc3VUpOQtkpFrwWF@newsaggrigatorcluster.wwgks.mongodb.net/news
      JWT_SECRET=airtribe
      NEWSAPI=d40784c4078a457eb1be1e8b09dda613
     ```
4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Users
#### Register a user
```http
POST /v1/users/register
```
#### Login a user
```http
POST /v1/users/login
```
#### Set preference
```http
PUT /v1/preferences
```
#### Get preference
```http
GET /v1/preferences
```

### News
#### Get all news articles
```http
GET /v1/news
```
#### Get a news article by ID
```http
GET /v1/:id/read/
```
#### Get a news article Read
```http
GET /v1/news/read/
```
#### Get a news article Fav
```http
GET /v1/news/fav/
```
#### Create a news article Read
```http
GET /v1/news/:id/read/
```
#### Create a news article Fav
```http
GET /v1/news/:id/fav/
```

## Running Tests
Run the following command to execute tests:
```sh
npm run test
```


