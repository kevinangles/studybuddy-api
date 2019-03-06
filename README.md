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
- [x] <b>User registration</b> <br>
In order to create an account, users must provide his/her first name and last name, a phone number, an FIU email, and a password between 8-32 characters in length with at least one uppercase letter, one lowercase letter, one digit, and one special character.
- [x] <b>Password encryption</b> <br>
Passwords are hashed multiple rounds using bcrypt and managed using best practices.
- [x] <b>User login</b> <br>
In order to login, users are asked to provide the FIU email and password he/she used to register. In the future, users will be able to login using their phone number as well.
- [x] <b>Search for a course by code</b> <br>
Currently, users are able to search for a course by code (i.e. COP3530). Additional functionality, search by reference and/or search by test (i.e. GRE), will be implemented in the future.
- [x] <b>Custom domain</b> <br>
Since .com was taken, it only made sense to buy .coffee.
- [x] <b>JWT authentication</b>
      <br>
      Authentication and authorization of the application are handled by jsonwebtoken. Due to some limitations from the current implementation, auth0 and passport are being looked into for refreshing tokens, as well as registering/logging in since FIU uses Google Mail as their email provider.
- [x] <b>Verify email address</b>
      <br>
      A verification email with a link is sent to the FIU email provided by the user in order to verify that the user is in fact an FIU student. Nodemailer is used to send the email from our own server, however, this will definitely be changed to an off-the-shelf tool like SendGrid's email API service.
- [ ] <b>Verify phone number</b>
      <br>
      The purpose of requiring a phone number when registering is to have a means of communication once both users are ready to connect. The phone number must be valid and must not come from a service that provides call forwarding (i.e. Google Voice).
- [ ] <b>Include Account Kit by Facebook as a registration option </b>
      <br>
      For now, this feature has been placed on hold until demand from users grows. The main reason why it hasn't been implement is because, for now, a valid FIU email address is required from us.
- [x] <b>Filter results</b>
      <br>
      Users are able to filter results by professor or reference number. More filters such as feedback rating will be introduced in the future, as well as the ability to apply multiple filters at once.
- [ ] <b>Sort results</b>
      <br>
      Users will be able to sort student's names alphabetically in order to find someone he/she already knows. Other ways of       sorting the results include feedback rating, last time online, among others.
<br/>

## API endpoints
|       URL      | Method |                                                            Data                                                           |         Description        |                Response Codes               |
|:--------------:|:------:|:-------------------------------------------------------------------------------------------------------------------------:|:--------------------------:|:-------------------------------------------:|
|   /register/   |  POST  | {"first_name": "Kevin", "last_name": "Angles", "email": "kangl010@fiu.edu", "password": "P@ssword1", "reference": 81705 } |     Register a new user    |        200 - Returns new user's data        |
|     /login/    |  POST  |                                  {"email": "kangl010@fiu.edu", "password": "P@ssword1" }                                  |        Log a user in       |          200 - Returns user's data          |
| /search/:code/ |   GET  |                                                                                                                           |    Search course by code   | 200 - Returns array with course objects |
| /verify/:hash/ |   PUT  |                                                                                                                           | Verify a new email address |          200 - Returns user object          |
<br/>
