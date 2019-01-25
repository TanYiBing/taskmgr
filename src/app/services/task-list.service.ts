import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskList, Task, Project } from '../domain';
import { Observable, from, concat, merge } from 'rxjs';
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
  get(projectId: string): Observable<TaskList[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<TaskList[]>(uri, { params: { 'projectId': projectId } });
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

  initializeTaskLists(prj: Project): Observable<Project> {
    const id = <string>prj.id;
    return merge(
      this.add({ id: undefined, name: '待办', projectId: id, order: 1 }),
      this.add({ id: undefined, name: '进行中', projectId: id, order: 2 }),
      this.add({ id: undefined, name: '已完成', projectId: id, order: 3 })
    ).pipe(
      reduce((r: TaskList[], x: TaskList) => [...r, x], []),
      map((tls: TaskList[]) => ({
        ...prj,
        taskLists: tls.map(tl => <string>tl.id)
      }))
    );
  }

}
