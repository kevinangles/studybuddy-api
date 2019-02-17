# Studybuddy API
Studybuddy's RESTful web service using Node, Express, PostgreSQL, Sequelize, Google App Engine and Cloud SQL.
<br/>
<br/>

## About
Studybuddy is a community of students looking for classmates to study with. Register now and skip the hassle of studying alone, and start studying together.
<br/>
<br/>
👇 Check out the web app repo here 👇
<br/>
https://github.com/kevinangles/studybuddy
<br/>
<br/>

## Features
- [x] User registration
- [x] Password encryption
- [x] User login
- [x] Search for a course by code (i.e. COP3530)
- [x] Custom domain
- [x] JWT authentication 
- [x] Verify email address
- [ ] Verify phone number
- [ ] Include Account Kit by Facebook as registration option
- [ ] Filter results
- [ ] Sort results

<br/>

## API endpoints
|       URL      | Method |                                                            Data                                                           |         Description        |                Response Codes               |
|:--------------:|:------:|:-------------------------------------------------------------------------------------------------------------------------:|:--------------------------:|:-------------------------------------------:|
|   /register/   |  POST  | {"first_name": "Kevin", "last_name": "Angles", "email": "kangl010@fiu.edu", "password": "P@ssword1", "reference": 81705 } |     Register a new user    |        200 - Returns new user's data        |
|     /login/    |  POST  |                                  {"email": "kangl010@fiu.edu", "password": "P@ssword1" }                                  |        Log a user in       |          200 - Returns user's data          |
| /search/:code/ |   GET  |                                                                                                                           |    Search course by code   | 200 - Returns classes with list of students |
| /verify/:hash/ |   PUT  |                                                                                                                           | Verify a new email address |          200 - Returns user object          |
<br/>

## References
* https://github.com/lorenseanstewart/sequelize-crud-101
* https://developers.facebook.com/docs/accountkit/webjs
