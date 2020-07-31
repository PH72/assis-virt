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
  var user = new UserGlpi(request.body.login,request.body.password,request.headers['app-token']);
  var ticket = request.body.ticket;
  
  //Inicia sessão do usuário
  await user.initSession();
  //Verfica se foi iniciado corretamente
  if(user.errorLogin != undefined && user.errorLogin != null){
    response.json({"error": user.errorLogin});
  }
  //Cria o chamado
  await user.createTicket(ticket.name,ticket.content);
  //Verifica se o chamado foi criado corretamente
  if(user.errorCreateTicket != undefined && user.errorCreateTicket != null){
    response.json({"error": user.errorCreateTicket});
  }
  
  response.json({"user": user});
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
