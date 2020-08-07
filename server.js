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
  
  if (intentName == "Problema - NaoResolvido - Abrir Chamado"){
        var user = new UserGlpi(request.body.queryResult.parameters['Login'],request.body.queryResult.parameters['Senha'],request.headers['app-token']);
        var ticket = {
          name: request.body.queryResult.parameters['Titulo'],
          content: request.body.queryResult.parameters['Ticket']
        };

        //Inicia sessão do usuário
        await user.initSession();
        //Verfica se foi iniciado corretamente
        if(user.errorLogin != undefined && user.errorLogin != null){
          response.json({"fulfillmentText":""+user.errorLogin.message+" Você quer tentar novamente?"});
        
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
    
    response.json({"fulfillmentMessages": 
    [
     {
       "card": {
         "imageUri": "https://firebasestorage.googleapis.com/v0/b/webhook-9a993.appspot.com/o/Tutoriais%2FSem%20t%C3%ADtulo%201.png?alt=media&token=02deb325-3ea9-4b7a-bc27-69e6a0318b46"
        
        
              }
    },
  
    {
      "text": {
         "text": [
          "Primeiro Passo: Verifique se o seu computador está conectado a internet, va até o canto inferior esquerdo da tela onde você verá um ícone referente a rede, como mostradono Passo 1 na figura."
                 ]
          }
    },
      
    {
      "text": {
         "text": [
          "Segundo Passo: Se seu computador estiver conectado via rede cabeada você ira visualizar exatamente oque o Passo 2 mostra."
                 ]
          }
    },
      
    {
      "text": {
         "text": [
          "Terceiro Passo: Caso seu computador não esteja cabeado será necessario ultilizar a Rede WI-FI, no Passo 3 da imagem podemos visualizar uma lista de redes disponiveis, por padrão aqui na Febracis", 
          "ultilizamos a rede (Interno) que fica acessivel com a senha (F3br@c152017)."
                 ]
          }
    },
      
    {
      "text": {
         "text": [
          "Após realizar os Procedimentos abaixo me infome se você conseguiu ou não resolver o problema."
                 ]
          }
    }  
  
  ]
      
})
   
      
    
  
    
 }
  
  
  else if (intentName == "Problema.Internet - Internet.Lenta"){
    
    
    
    
    
  }
  
  //response.json({"fulfillmentText":intentName})
  
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
