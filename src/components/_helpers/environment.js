let API_URL = ''

switch(window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    API_URL = 'http://localhost:3333'
    break;
  case 'herokuURL.app':
    API_URL = 'herokuURL.app'
}

export default API_URL