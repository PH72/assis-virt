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
  
  intentMap.set('Instalar_Impressora',Manual_Impressoras);
  intentMap.set('Internet_lenta',Manual_Internet_Lenta)
  intentMap.set('Impressora_não_Instalada',Chamado_Instalar_Impressora);
  intentMap.set('Internet_lenta_não_resolvido',Chamado_Internet_Lenta);
  //intentMap.set('Internet_lenta_não_resolvido',teste);
  
  agent.handleRequest(intentMap);
  
  function teste(agent){
    agent.add("");
    agent.setFollowupEvent('teste');
  }
  
  async function Chamado_Instalar_Impressora(agent){
    let user = new UserGlpi(request.headers['login'],request.headers['senha'],request.headers['app-token']);
    let nome = request.body.queryResult.parameters['Nome'];
    let setor = request.body.queryResult.parameters['Setor'];
    let ticket = {
      name: intentName,
      content:'Colaborador realizou o tutorial porem não conseguiu fazer a instalação da impressora.\n\n'+
      'Nome do colaborador:'+nome+
      '\nSetor do Colaborador:'+setor
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
    
    response.json({"fulfillmentText":"Como Você não conseguiu realizar o autoatendimento iremos abrir um chamado para um de nossos analistas possa realizar o seu atendimento, seu chamdo é o id: "+user.ticketCreated.id+"."+
                  '\n\nMais informações do seu chamados podem ser verificadas no site http://chamados.febracis.local'});
  }
  
  async function Chamado_Internet_Lenta(agent){
    let user = new UserGlpi(request.headers['login'],request.headers['senha'],request.headers['app-token']);
    let nome = request.body.queryResult.parameters['Nome'];
    let setor = request.body.queryResult.parameters['Setor'];
    let ticket = {
      name: intentName,
      content:'Colaborador realizou o tutorial de alto atendimeto, porem não conseguiu resolver o seu problema de lentidaão de internet.\n\n'+
      'Nome do Colaborador:'+nome+
      '\nSetor do Colaborador:'+setor
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
    
    response.json({"fulfillmentText":"Como Você não conseguiu realizar o autoatendimento iremos abrir um chamado para um de nossos analistas possa realizar o seu atendimento, seu chamdo é o id: "+user.ticketCreated.id+"."});
    
  }
  
  
  
  function Manual_Impressoras(agent){
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
  
  function Manual_Internet_Lenta(agent){
    response.json({"fulfillmentMessages": 
    [
      
      {
        "text": {
          "text": [
            'Primeiro Passo: Verifique em que rede sua maquina está conectada a rede "Interno" como mostrado na figura abaixo!'
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
  
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
})