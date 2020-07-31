'strict'

const request = require('request');

module.exports = class UserGlpi{
  constructor(login,password){
    this.login = login;
    this.password = password;
  }
  
  initSession(appToken){
    let buf = Buffer.from(this.login+':'+this.password);
    let encodedData = buf.toString('base64');
    
    var options = {
      uri: 'https://chamados.febracis.com.br/apirest.php/initSession',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic '+encodedData,
          'App-Token': appToken
      }
    }
    var req = request(options, function(error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
    });
  }
}