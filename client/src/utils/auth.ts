// Decodes a JWT and pulls the user's information out of it.
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface UserTokenPayload extends JwtPayload {
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

class AuthService {
  getProfile() {
    return jwtDecode<UserTokenPayload>(this.getToken());
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<UserTokenPayload>(token);
      return !!decoded.exp && decoded.exp < Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
