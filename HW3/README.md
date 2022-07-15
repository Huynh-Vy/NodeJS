# EPAM NodeJS HW3 - UBER like service for freight trucks

## Project Description: 
Use NodeJS to implement UBER like service for freight trucks, in REST style, using MongoDB as database. This service should help regular people to deliver their stuff and help drivers to find loads and earn some money. Application contains 2 roles, driver and shipper.
+ Driver/Shipper are able to register/login to the system, view profile, change password, reset password and delete account.
+ Driver are able to add trucks, view created truck, update to his truck info, delete and assign him self to the truck.
+ Shipper are able to create loads, view created loads, update load's status, delete load and view shipping info.

## Technologies:
+ ExpressJS
+ MongoDB as database, Mongoose
+ GoogleAPIs, NodeMailer for email sending.
+ JsonWebToken, bcrypt.
+ Joi.
+ MVC Model

## API URL samples:

![image](https://user-images.githubusercontent.com/87691625/179134342-a5e5478a-1d09-45b2-91da-863e6d041c41.png)

![image](https://user-images.githubusercontent.com/87691625/179134487-f027b93f-90d9-4483-b493-2b58a0b2a508.png)

![image](https://user-images.githubusercontent.com/87691625/179134555-e13936c5-0880-4ee3-8ae7-d796ee2ed7aa.png)

![image](https://user-images.githubusercontent.com/87691625/179134601-1c4695fa-6aaa-4d1c-8f5a-c4914c39bb55.png)

## .env file format
SECRET_KEY = 
RESET_PASSWORD_KEY = 
DB_CONNECT = 
BASE_URL = 

//GoogleAPIs
CLIENT_ID = 
CLIENT_SECRET = 
REDIRECT_URI = 
REFRESH_TOKEN = 

## How to run app
1. config .env file
2. npm install
3. npm start
