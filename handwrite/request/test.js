import Request from './index.js';

Request.get('https://jsonplaceholder.typicode.com/todos/1')
  .then((data) => {
    console.log('GET Success: ', data);
  })
  .catch((err) => console.error('GET Error: ', err));
