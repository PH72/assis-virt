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
  
  else if (intentName == "Problema.Internet - sem.Internet"){
    
    response.json({"fulfillmentMessages": [
    {
      "card": {
        "title": "card title",
        "subtitle": "card text",
        "imageUri": "https://firebasestorage.googleapis.com/v0/b/webhook-9a993.appspot.com/o/Tutoriais%2FSem%20t%C3%ADtulo%201.png?alt=media&token=02deb325-3ea9-4b7a-bc27-69e6a0318b46"
        
      }
    }
  ]
   })
   response.json({"fulfillmentMessages": [
      {
        "text": {
          "text": [
            "Primeiro Passo: Verifique se o seu computador está conectado a internet, va até o canto inferior esquerdo da tela onde você verá um ícone referente a rede \n\n",
            "teste"
          ]
        }
      }
    ]
  }) 
    
 }
  
  //response.json({"fulfillmentText":intentName})
  
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
