import axios from 'axios';

export default axios.create({
  baseURL: '/api/v1',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

