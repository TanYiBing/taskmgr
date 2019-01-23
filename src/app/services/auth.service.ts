import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Auth, User } from '../domain';

@Injectable()
export class AuthService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
    '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9' +
    '.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

  constructor(
    @Inject('BASE_CONFIG') private config: { uri: string },
    private http: HttpClient
  ) { }

  /**
 * 使用用户提供的个人信息进行注册，成功则返回 User，否则抛出异常
 *
 * @param user 用户信息，id 属性会被忽略，因为服务器端会创建新的 id
 */
  register(user: User): Observable<Auth> {
    const uri = `${this.config.uri}/users`;
    return this.http.get(uri, { params: {'email': user.email} }).pipe(
      switchMap(res => {
        if ((<User[]>res).length > 0) {
          return throwError('user existed');
        }
        return this.http
          .post(uri, JSON.stringify(user), { headers: this.headers })
          .pipe(map(r => ({ token: this.token, user: <User>r })));
      })
    );
  }

  /**
 * 使用用户名和密码登录
 *
 * @param email 用户名
 * @param password 密码（明文），服务器会进行加密处理
 */
  login(email: string, password: string): Observable<Auth> {
    const uri = `${this.config.uri}/users`;
    return this.http.get(uri, { params: {'email': email, 'password': password} }).pipe(
      map(res => {
        const users = <User[]>res;
        if (users.length === 0) {
          throw new Error('Username or password incorrect');
        }
        return {
          token: this.token,
          user: users[0]
        };
      })
    );
  }
}
