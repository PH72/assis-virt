import  from './modelUser';

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json())
app.use(express.static("public"));

app.get("/glpi", (request, response) => {
  var user = new UserGlpi(request.body.login,request.body.password);
  user.initSession();
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
