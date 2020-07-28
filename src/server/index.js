// setup empty JS object to act as endpoint for all routes
projectData = {};

// require express to run server and routes
const express = require("express");

// start up an instance of app
const app = express();

// configure express to use body-parser as middle-ware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// initialize the main project folder
app.use(express.static("dist"));
app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});

// set up server (different port to dev port)
const port = 8000;
const server = app.listen(port, listening);

function listening() {
    console.log("server running");
    console.log(`running on localhost: ${port}`);
}

// posts data recieved from app.js into app endpoint (projectData)
app.post("/addData", function (req, res) {
    projectData.dateOut = req.body.dateOut;
    projectData.dateReturn = req.body.dateReturn;
    projectData.geonamesData = req.body.geonamesData;
    projectData.description = req.body.description;

    console.log(projectData);
    res.send(projectData);
});