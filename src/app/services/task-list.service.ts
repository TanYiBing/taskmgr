import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskList, Task } from '../domain';
import { Observable, from, concat } from 'rxjs';
import { mergeMap, count, switchMap, map, mapTo, reduce } from 'rxjs/operators';

@Injectable()
export class TaskListService {

  private readonly domain = 'taskLists';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) { }

  // POST /taskLists
  add(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}`;
    taskList.id = null;
    return this.http.post<TaskList>(uri, JSON.stringify(taskList), { headers: this.headers });
  }

  // PATCH /taskLists/:id
  update(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {
      name: taskList.name
    };
    return this.http.patch<TaskList>(uri, JSON.stringify(toUpdate), { headers: this.headers });
  }

  // DELETE /taskLists/:id
  del(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    return this.http.delete(uri).pipe(
      mapTo(taskList)
    );
  }

  // GET /taskLists
  get(projectId: string): Observable<Task[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<Task[]>(uri, { params: { 'projectId': projectId } });
  }

  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
    const srcUri = `${this.config.uri}/${this.domain}/${src.id}`;
    const targeUri = `${this.config.uri}/${this.domain}/${target.id}`;

    const drag$ = this.http.patch(srcUri, JSON.stringify({ order: target.order }), { headers: this.headers }).pipe(
      map(res => res)
    );
    const drop$ = this.http.patch(targeUri, JSON.stringify({ order: src.order }), { headers: this.headers }).pipe(
      map(res => res)
    );

    return concat(drag$, drop$).pipe(
      reduce((arr, taskList) => [...arr, taskList], [])
    );
  }

}
