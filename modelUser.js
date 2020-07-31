const https = require('https');

module.exports = class UserGlpi{
  constructor(login,password){
    this.login = login;
    this.password = password;
  }
  
  initSession(){
    var request = {
      host: '',
      path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic',
      }
    }
  }
}