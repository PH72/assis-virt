'strict'

const axios = require('axios');

module.exports = class UserGlpi{
  constructor(login,password,appToken){
    this.login = login;
    this.password = password;
    this.appToken = appToken;
  }
  
  async initSession(){
    let buf = Buffer.from(this.login+':'+this.password);
    let encodedData = buf.toString('base64');
    console.log(encodedData);
    var options = {
      url: 'http://chamados.febracis.com.br/apirest.php/initSession',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+encodedData,
          'App-Token': this.appToken
      }
    }
    
    var userGlpi = this;
    try{
      await axios(options).then((res) => {
        userGlpi.session_token = res.data.session_token;
      });
    }catch(e){
      userGlpi.errorLogin = {
        statusCode: e.response.status,
        message: e.response.data[1]
      }
    }
  }
  
  async createTicket(name,content){
    var options = {
      url: 'http://chamados.febracis.com.br/apirest.php/Ticket',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Session-Token': this.session_token,
          'App-Token': this.appToken
      },
      data: {
        input: {
          name: name,
          content: content,
          status: 1,
          urgency: 1,
          _disablenotif: false
        }
      }
    };
    
    var userGlpi = this;
    
    try{
      await axios(options).then((res) => {
        console.log(res.data);
      });
    }catch(e){
      console.log(e);
      userGlpi.errorCreateTicket = {
        statusCode: e.response.status,
        message: e.response.data[1]
      }
    }
  }
}