'strict'

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const UserGlpi = require("./modelUser.js");

const app = express();

app.use(bodyParser.json())
app.use(express.static("public"));
  
app.get('/', (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/glpi", async (request, response) => {
  var user = new UserGlpi(request.body.login,request.body.password);
  
  user.initSession(request.headers['app-token'],response);
  
  console.log(user.errorLogin);
  
  if(user.errorLogin != undefined && user.errorLogin != null){
    response.status(user.errorLogin.statusCode).send({
       message: user.errorLogin.message
    });
    response.json({"error": {"login": user}});
    
    return;
  }
  
  //response.json({"user": {"login": user}});
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
