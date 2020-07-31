'strict'

const https = require('https');

module.exports = class UserGlpi{
  constructor(login,password){
    this.login = login;
    this.password = password;
  }
  
  initSession(appToken){
    let buf = Buffer.from(this.login+':'+this.password);
    let encodedData = buf.toString('base64');
    
    var request = {
      host: 'https://http://chamados.febracis.com.br',
      path: '/apirest.php/initSession',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic '+encodedData,
          'App-Token': appToken
      }
    }
    
  }
}