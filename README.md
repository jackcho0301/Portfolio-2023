# Portfolio-2022

## Financial Portfolio Competition Application
### MERN Stack Application (MongoDB, Express.js, React and Node.js) under Agile / Scrum Project Management
[Link to the code repository](https://github.com/jackcho0301/437ChoCaiAlameddineWendler/tree/final_ui_edits)
#### Features:
* Users can log in as an existing user or register as a new user
* Users can create a financial porfolio by:
    * buying shares of a specific company with real-time stock value, using Yahoo Finance API
    * selling shares of current holdings with the updated real-time stock values
* Users can earn points based on the performance of their financial portfolios, calucated by the Return on Investment values from purchasing/selling stocks
* Users can see their ranks with respect to other existing users' on the leaderboard



## Calendar Web Application 
### JavaScript & LAMP Stack Project (Linux, Apache HTTP Server, MySQL, PHP)
[Link to the code repository](https://github.com/jackcho0301/Portfolio-2022/tree/master/Calendar(LAMP))
#### Features:
- Users can log in and add/delete/modify events on the calendar
- Simple to-do feature is embedded to the application
- The project adheres to FIEO principle (Filter Input, Escape Output)
- Passwords are hashed and salted before being stored in the database
- The application is safe from SQL injection attacks



## Movie Trailer Browser
### MERN Stack Project (MongoDB, Express.js, React.js, Node.js)
[Link to the code repository](https://github.com/jackcho0301/Portfolio-2022/tree/master/Movie-Trailer-Browser(MERN))
#### Features:
- The application is powered by The Movie Database (TMDB) external APIs
- User is able to save and unsave movies as favorites
- Upon clicking on the movie poster, the application displays the summary of the movie, runtime, and movie trailer ready to be played on embedded YouTube player 
- Log in feature using JWT token to be added soon

#### Instruction
1. Clone this repository
2. Open terminal window and change the directory to the project root folder 
> cd Portfolio-2022/Movie-Trailer-Browser(MERN)
3. Run **npm install** to install dependencies
> npm install
4. Run **npm start** to start the React development server
> npm start
5. Open a new terminal window and change directory to backend/ subfolder of the project
> cd Portfolio-2022/Movie-Trailer-Browser(MERN)/backend
6. Run **npm install** to install dependencies
> **npm install**
7. Run **node app.js** to start the web server
> node app.js
8. Open http://localhost:3000 in the browser to use the application


## Housemate Chores Application
### Swift (iOS) Project Code Sample
[Link to the code repository](https://github.com/jackcho0301/Portfolio-2022/tree/master/Housemate-Chores-App(Swift))

This is a code snippet from an iOS application project. The code achieves the following:
- Import iOS Calendar library made by WenchaoD (https://github.com/WenchaoD/FSCalendar)
- Clicking on a specific cell of the calendar allows the users to create and delete events
- Connect with Firebase Realtime Database for data persistence
- Display all events created by a fellow group of housemates (and ignore events made by users that are not housemates)



## Chat Server
### Node.js and Socket.IO Project
[Link to the code repository](https://github.com/jackcho0301/Portfolio-2022/tree/master/Chat-Server(Node.js))
#### Features:
- Users can create chat rooms with an arbitrary room name
- Users can join an arbitrary chat room
- The chat room displays all users currently in the room
- A password-protected private room can be created
- Creators of chat rooms can temporarily kick others out of the room
- Creators of chat rooms can permanently ban users from joining that particular room
- Users can send private messages to another user in the same room 
- A user is able to block another user from sending a message

#### Instruction:
1. Clone this repository
2. Open terminal window and change the directory to the project root folder 
> cd Portfolio-2022/Chat-Server(Node.js)
3. Run **npm install** to install dependencies
> npm install
4. Run **node chat-server.js** to start the web server
> node chat-server.js
6. Open http://localhost:3456 in the browser to use the application



## Text Analysis of Jane Austen and Louisa May Alcott novels
### Python Data Analysis Project
[Link to the code repository](https://github.com/jackcho0301/Portfolio-2022/tree/master/Text-Analysis(Python)) <br> <br>
- The code analyzes five novels by Jane Austen and five novels by Louisa May Alcott and run k-means algorithm on two different feature sets: "positive-sentiment" words and stopwords. Using these two feature sets resulted in classifying the corpus to the two authors with high accuracy. Refer to the the Jupyter Notebook file (FINAL_CODE.ipynb) for the code and detailed analysis.

