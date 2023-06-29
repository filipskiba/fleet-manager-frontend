import axios from 'axios';
import authHeader from './auth-header';
const API_ROLE_URL = 'http://localhost:8080/api/role';

class RoleService {
  getRoles() {
    return axios.get(API_ROLE_URL, { headers: authHeader() });
  }
}

export default new RoleService();
