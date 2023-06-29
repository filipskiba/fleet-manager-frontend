import axios from 'axios';
import authHeader from './auth-header';
import http from '../http-common';
const API_USER_URL = 'http://localhost:8080/api/users';
const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAllUsers() {
    return axios.get(API_USER_URL, { headers: authHeader() });
  }
  updateAccount(user) {
    return http.put(API_USER_URL, user, { headers: authHeader() });
  }
  updateUserProperties(user) {
    return http.put(API_USER_URL + '/properties', user, {
      headers: authHeader(),
    });
  }
  findByUsername(username) {
    return http.get(API_USER_URL + `/?username=${username}`, {
      headers: authHeader(),
    });
  }
  deleteByUserId(userId) {
    return http.delete(API_USER_URL + `/${userId}`, {
      headers: authHeader(),
    });
  }
}

export default new UserService();
