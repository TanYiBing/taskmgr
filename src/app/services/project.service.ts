import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Project } from '../domain';
import { Observable, from } from 'rxjs';
import { mergeMap, count, switchMap, map, mapTo } from 'rxjs/operators';

@Injectable()
export class ProjectService {

  private readonly domain = 'projects';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) { }

  // POST /projects
  add(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}`;
    project.id = null;
    return this.http.post<Project>(uri, JSON.stringify(project), {headers: this.headers});
  }

  // PATCH /projects/:id
  update(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      coverImg: project.coverImg,
      desc: project.desc
    };
    return this.http.patch<Project>(uri, JSON.stringify(toUpdate), { headers: this.headers });
  }

  // DELETE /projects/:id
  del(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const delTask$ = from(project.taskLists).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );
    return delTask$.pipe(
      switchMap(_ => this.http.delete(uri).pipe(
        mapTo(project))
      )
    );
  }

  // GET /projects
  get(userId: string): Observable<Project[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<Project[]>(uri, {params: {'members_like': userId}});
  }

}
