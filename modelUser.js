'strict'

const request = require('request');

module.exports = class UserGlpi{
  constructor(login,password){
    this.login = login;
    this.password = password;
  }
  
  async initSession(appToken,response){
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
        response.status(400).send({
           message: err
        });
      }
      
      return JSON.parse(body);
    });
    
    if(res.length > 0 && res[0].includes('ERROR')){
      let statusCode;
      let message = res[2];
      switch(res[0]){
        case 'ERROR_LOGIN_PARAMETERS_MISSING':
          statusCode = 400;
          break;
        case 'ERROR_GLPI_LOGIN':
          statusCode = 401;
          break;
        default:
          statusCode = 400;
          message = 'Não foi possível efetuar o login.'
          break;
      }
      response.status(message).send({
         message: res[2]
      });
    }
    
    this.sessionToken = res['session_token'];
  }
}