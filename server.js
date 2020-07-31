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
  
  var intentName = request.body.queryResult.intent.displayName;
  
  if (intentName == "faq.TI"){
        var user = new UserGlpi(request.body.queryResult.parameters['Login'],request.body.queryResult.parameters['Senha'],request.headers['app-token']);
        var ticket = {
          name: request.body.queryResult.parameters['Titulo'],
          content: request.body.queryResult.parameters['Ticket']
        };

        //Inicia sessão do usuário
        await user.initSession();
        //Verfica se foi iniciado corretamente
        if(user.errorLogin != undefined && user.errorLogin != null){
          response.json({"fulfillmentText":""+user.errorLogin.message});
        }
        //Cria o chamado
        await user.createTicket(ticket.name,ticket.content);
        //Verifica se o chamado foi criado corretamente
        if(user.errorCreateTicket != undefined && user.errorCreateTicket != null){
          response.json({"fulfillmentText":""+user.errorCreateTicket.message});
        }

        response.json({"fulfillmentText":"Chamado criado com sucesso! id: "+user.ticketCreated.id+"."});
  }
  
  else if (intentName == "problemas.rede - Caiu - Resolvido"){
    
    response.jason({"fulfillmenteText":"Problema resolvido"})
    
  }
  
  
  
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
