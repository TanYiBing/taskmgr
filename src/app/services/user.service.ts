import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { User, Project } from '../domain';
import { switchMap, filter, reduce } from 'rxjs/operators';

@Injectable()
export class UserService {

  private readonly domain = 'users';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    @Inject('BASE_CONFIG') private config: { uri: string },
    private http: HttpClient
  ) { }

  searchUsers(filterStr: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<User[]>(uri, { params: { 'email_like': filterStr } });
  }

  getUsersByProject(projectId: string): Observable<User[]> {
    const uri = `${this.config.uri}/users`;
    return this.http.get<User[]>(uri, { params: { 'projectId': projectId } });
  }

  // 添加project和user的关系
  addProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    if (projectIds.indexOf(projectId) > -1) {
      return of(user);
    }
    return this.http.patch<User>(uri, JSON.stringify({ projectIds: [...projectIds, projectId] }), { headers: this.headers });
  }

    // 删除project和user的关系
  removeProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    const index = projectIds.indexOf(projectId);
    if (index === -1) {
      return of(user);
    }
    const toUpdate = [
      ...projectIds.slice(0, index),
      ...projectIds.slice(index + 1)
    ];
    return this.http.patch<User>(uri, JSON.stringify({ projectIds: toUpdate }), { headers: this.headers });
  }

    // 批量处理project和user的关系
  batchUpdateProjectRef(project: Project): Observable<User[]> {
    const projectId = project.id;
    const memberIds = project.members ? project.members : [];
    return from(memberIds).pipe(
      switchMap(id => {
        const uri = `${this.config.uri}/${this.domain}/${id}`;
        return this.http.get(uri);
      }),
      filter(
        (user: User) =>
          user.projectIds ? user.projectIds.indexOf(projectId) < 0 : false
      ),
      switchMap((u: User) => this.addProjectRef(u, projectId)),
      reduce((users: User[], curr: User) => [...users, curr], [])
    );
  }
}
