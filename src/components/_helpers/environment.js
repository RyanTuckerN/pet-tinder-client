let API_URL = ''

switch(window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    API_URL = 'http://localhost:3333'
    break;
  case 'https://tmor-pet-tinder-client.herokuapp.com':
    API_URL = 'https://tmor-pet-tinder-client.herokuapp.com'
}

export default API_URL