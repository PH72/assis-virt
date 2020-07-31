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
    var errorLogin;
    await request.get(options, function(err, resp, body) {
      if (err) {
        errorLogin = {
          statusCode: 400,
          message: err
        };
        
        return false;
      }
      
      let res = JSON.parse(body);
      if(res.length > 0 && res[0].includes('ERROR')){
        let statusCode;
        let message = res[1];
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
        errorLogin = {
          statusCode,
          message
        };
        return false;
      }
      if(errorLogin != undefined && errorLogin != null)
        this.errorLogin = errorLogin;
    });
  }
}