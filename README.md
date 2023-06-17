# CIS 5500 Project - NBA INSIDER PORTAL

This is an application that aims to read and present data from an [NBA dataset](https://www.kaggle.com/datasets/nathanlauga/nba-games?select=games.csv). 

## Video Demo

Click [here](https://drive.google.com/file/d/1IarU7ygMw4ZLtCIM1IkkXwNZ9cNl9XH6/view?usp=drive_link) to view a video demonstration of the application.

## Building the project

Open up two terminals to build and run the application.

In the first terminal, change the directory to the `Client` folder by typing the command `cd Client`. Run `npm install` to install relevant packages and then `npm run start`.

In the second terminal, change the directory to the `Server` folder by typing the command `cd Server`. Run `npm install` to install relevant packages and then `npm run start`.

The browser window should open. In case it doesn't, the application can be reached by opening the browser and navigating to `http://localhost:3000`.

## Directories

`Data` - Includes raw data, cleaned data, code used to clean the data, and SQL DDL

`Client` - Code used for the application frontend

- `src/pages` is the folder that contains all the code for the different pages
- `src/config.js` contains the information used to connect to the database

`Server` - Code used for application backend

- `routes.js` defines all the methods that are used in the backend
- `server.js` defines all the routes and which methods are called for each route
