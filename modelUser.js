'strict'

const https = require('https');

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
      url: '/apirest.php/initSession',
      method: 'Ge'
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+encodedData,
          'App-Token': appToken
      }
    }
    
    var errorLogin;
    https.get(options, function(err, resp, body) {
      
      /*let res = JSON.parse(body);
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
        console.log(errorLogin);
        return false;
      }*/
      
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
        console.log(data);
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data).explanation);
      });  
    }).on("error", (err) => {
      console.log(err.message);
      errorLogin = {
          statusCode: 400,
          message: err.message
        };
    });
    
    if(errorLogin != undefined && errorLogin != null)
        this.errorLogin = errorLogin;
    
  }
}