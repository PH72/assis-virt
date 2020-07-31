'strict'

const axios = require('axios');

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
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+encodedData,
          'App-Token': appToken
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
}