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
  intentMap.set('Internet_lenta_não_resolvido',teste);
  intentMap.set('Impressora_não_Instalada',Instalar_Impressora);
  intentMap.set('Instalar_Impressora',inst_impressoras);
  intentMap.set('Abre_Chamados',Abre_Chamados);
  
  agent.handleRequest(intentMap);
  
  function teste(agent){
    agent.add("");
    agent.setFollowupEvent('teste');
  }
  
  async function Abre_Chamados(agent){
    var user = new UserGlpi(request.headers['login'],request.headers['senha'],request.headers['app-token']);
    
    var ticket = {
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
    
    response.json({"fulfillmentText":"Chamado criado com sucesso! id: "+user.ticketCreated.id+"."});
  }
  
  
  async function CInstalar_Impressora(agent){
        var user = new UserGlpi(request.headers['login'],request.headers['senha'],request.headers['app-token']);
    
    var ticket = {
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
    
    response.json({"fulfillmentText":"Chamado criado com sucesso! id: "+user.ticketCreated.id+"."});
    
  }
  
  function inst_impressoras(agent){
    response.json({"fulfillmentMessages": 
    [
      
      {
        "text": {
          "text": [
            "Primeiro Passo: abra a aba de busca do seu computador e digite o endereço como mostrado na imagen abaixo."
          ]
        }
      },
      
      {
        "card": {
        "imageUri": "https://firebasestorage.googleapis.com/v0/b/assistente-de-chamados-bamc.appspot.com/o/Tutoriais%2FTutorial%20impressoras%2FCaminho_imp.png?alt=media&token=61204dd4-3dbb-405a-8ac8-06f5ee76df58"
        }     
      },
      
      {
        "text": {
          "text": [
            "Segundo Passo: Será aberta uma janela contendo todas as impressoras disponiveis para a instalação, basta escolher a desejada e clicar duas vezes."
          ]
        }
      },
      
      {
        "card": {
        "imageUri": "https://firebasestorage.googleapis.com/v0/b/assistente-de-chamados-bamc.appspot.com/o/Tutoriais%2FTutorial%20impressoras%2Fimpressoras.PNG?alt=media&token=88a7c84e-f409-4d1c-942e-898497298915"
        }     
      },
      
      {
        "text": {
          "text": [
            "Terceiro Passo: agora sua impressora vai estar diponivel na lista de impressora, basta selecioná-lá na hora de ralizar a impressão!."
          ]
        }
      },
      
      {
        "text": {
          "text": [
            "Por favor informe se o problema foi resolvido!"
          ]
        }
      },
      
      
      
    ]})
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
  
  else if (intentName == "Problema.Internet - sem.Internet")
  {
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
    ]})
  }
  
  else if (intentName == "Problema.Internet - Internet.Lenta"){
    response.json({"fulfillmentMessages":
    [
      {
        "card": {
          "imageUri": "https://firebasestorage.googleapis.com/v0/b/webhook-9a993.appspot.com/o/Tutoriais%2FSem%20t%C3%ADtulo%201.png?alt=media&token=02deb325-3ea9-4b7a-bc27-69e6a0318b46"
        }
      } 
    ]})
  }
  //response.json({"fulfillmentText":intentName})
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
})