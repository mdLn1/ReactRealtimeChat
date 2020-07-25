# React Real-time Chat Web Application

## React.js, Node.js and Express framework tech stack

This application uses socket.io to update clients live chats whilst a user is within a chat room where other users are actively sending messages.

This app is designed for desktop use only, the CSS breaks on smaller screen.

Check the **About** page to find more information about the tools and resources used to build this app.

To setup the application to properly run you need to do the following:

1. You need to create a `.env` inside the project root

2. You need to add two variables inside `.env` file,  `MONGO_CONNECTION` and `JWT_SECRET`

3. `MONGO_CONNECTION` is the connection string that you receive from creating a cluster on [MongoDB website](https://cloud.mongodb.com/), there is free option which should suffice

4. `JWT_SECRET` it is just a string to be used for verifying the authenticity of the JSON Web Token that is part of the request from logged in users on the website

5. By default the NodeJs API runs on PORT **8080**, you can change the port by adding a variable called `PORT` inside `.env` file and set it to a port number that you want the API to run on

6. `client/src/App.js` is the main app state storage, the state variable called "env" stores the current development environment set for development thus the value is "dev", to switch to production just change the value to anything else

Once the setup is done you need to run from the repository root `npm install` then `npm run dev` should launch both, the React client and the NodeJs API, make sure you configured your MongoDB cluster to accept connections from your IP address whilst running the app

## Image Gallery

![Desktop screenshot](https://raw.githubusercontent.com/mdLn1/ReactRealtimeChat/master/assets/desktop.PNG "web app desktop view")
