'strict'

const request = require('request');

module.exports = class UserGlpi{
  constructor(login,password){
    this.login = login;
    this.password = password;
  }
  
  async initSession(appToken){
    let buf = Buffer.from(this.login+':'+this.password);
    let encodedData = buf.toString('base64');
    console.log(encodedData);
    var options = {
      url: 'http://chamados.febracis.com.br/apirest.php/initSession',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+encodedData,
          'App-Token': appToken
      }
    }
    console.log('init');
    var res = await request.get(options, function(err, response, body) {
      if (err) {
        return console.log(err);
      }
      
      return JSON.parse(body);
    });
    
    if(res.length > 0 && res[0].includes('ERROR'))
          return console.log(res[0]);
    
    this.sessionToken = res['session_token'];
  }
}