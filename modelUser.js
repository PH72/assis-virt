const https = require('https');

export default class UserGlpi{
  constructor(login,password){
    this.login = login;
    this.password = password;
  }
  
  initSession(){
    let buf = Buffer.from(this.login+':'+this.password);
    let encodedData = buf.toString('base64');
    
    console.log(encodedData);
    
    var request = {
      host: '',
      path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic '+encodedData,
      }
    }
  }
}