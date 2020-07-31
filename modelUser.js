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
    console.log(encodedData);
    var options = {
      url: 'https://chamados.febracis.com.br/apirest.php/initSession',
      json: true,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+encodedData,
          'App-Token': appToken
      }
    }
    console.log('init');
    request.get(options, function(err, response, body) {
      if (err) {
        return console.log(err);
      }
      console.log(JSON.parse(body));
    });
    console.log('end');
  }
}