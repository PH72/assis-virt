'strict'

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const UserGlpi = require("./modelUser.js");
const app = express();
const {WebhookClient} = require('dialogflow-fulfillment');

app.use(bodyParser.json())
app.use(express.static("public"));
  
app.get('/', (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/glpi", async (request, response) => {
  
  const agent = new WebhookClient({ request:request, response:response });
  
  var intentName = request.body.queryResult.intent.displayName;
  
  
  
  
      let intentMap = new Map();
      
      intentMap.set('Internet_lenta_não_resolvido',Abre_Chamados);
      intentMap.set('Impressora_não_Instalada',Abre_Chamados);
      agent.handleRequest(intentMap);
 
    
    function Abre_Chamados(agent){

          agent.add("");
          agent.setFollowupEvent('teste');
      
    }
  
  
  
  if (intentName == "Abre_Chamados"){
        let user = new UserGlpi(request.headers['login'],request.headers['senha'],request.headers['app-token']);
        let ticket = {
          name: intentName,
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

        agent.add("teste");
        //response.json({"fulfillmentText":"Chamado criado com sucesso! id: "+user.ticketCreated.id+"."});
  }
  
  
  
  if (intentName == ""){
        let user = new UserGlpi(request.headers['login'],request.headers['senha'],request.headers['app-token']);
        let userGlpi = request.body.queryResult.parameters['Usuario']
        let nome = request.body.queryResult.parameters['Nome'];
        let unidade = request.body.queryResult.parameters['Unidade'];
        let utilidade = request.body.queryResult.parameters['Utilidade'];

        //Inicia sessão do usuário
        await user.initSession();
        //Verfica se foi iniciado corretamente
        if(user.errorLogin != undefined && user.errorLogin != null){
          response.json({"fulfillmentText":""+user.errorLogin.message+" Você quer tentar novamente?"});
        
        }
        //Cria o chamado
        await user.createTicket("Criação de e-mail para a unidade "+unidade,"Nome:"+nome+"\n"+"\n"+utilidade+"\n\nSolicitado por: "+userGlpi);
        //Verifica se o chamado foi criado corretamente
        if(user.errorCreateTicket != undefined && user.errorCreateTicket != null){
          response.json({"fulfillmentText":""+user.errorCreateTicket.message});
          
        }

        response.json({"fulfillmentText":"Um chamado para a criação do seu e-mail foi aberto, em breve um de nosso analista irá ralizar o atendimento!\n id do Chamado: "+user.ticketCreated.id+"."});
        
    
  }
  
  
  
  
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
