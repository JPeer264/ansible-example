import { create } from 'apisauce';
import config from '../../../config';

const api = create({
  baseURL: config.api_url,
  headers: { Accept: 'application/vnd.github.v3+json' },
});

const putUser = (username, password) => api.post('/user', { username, password });
const getUsers = () => api.get('/users');

export {
  putUser,
  getUsers,
};
