import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Task, TaskList } from '../domain';
import { Observable, from } from 'rxjs';
import { mergeMap, count, switchMap, map, mapTo, reduce } from 'rxjs/operators';

@Injectable()
export class TaskService {

  private readonly domain = 'tasks';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) { }

  // POST /tasks
  add(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}`;
    task.id = null;
    return this.http.post<Task>(uri, JSON.stringify(task), {headers: this.headers});
  }

  // PATCH /tasks/:id
  update(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    const toUpdate = {
      desc: task.desc,
      ownerId: task.ownerId,
      dueDate: task.dueDate,
      reminder: task.reminder,
      priority: task.priority,
      participantIds: task.participantIds,
      remark: task.remark
    };
    return this.http.patch<Task>(uri, JSON.stringify(toUpdate), { headers: this.headers });
  }

  // DELETE /tasks/:id
  del(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.delete(uri).pipe(
      mapTo(task)
    );
  }

  // GET /tasks
  get(taskListId: string): Observable<Task[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<Task[]>(uri, { params: { 'taskListId': taskListId}});
  }

  getByLists(lists: TaskList[]): Observable<Task[]> {
    return from(lists).pipe(
      mergeMap(list => this.get(list.id)),
      reduce((arr, taskArr) => [...arr, ...taskArr], [])
    );
  }

  complete(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.patch<Task>(uri, JSON.stringify({ completed: !task.completed }), { headers: this.headers });
  }

  move(taskId: string, taskListId: string): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${taskId}`;
    return this.http.patch<Task>(uri, JSON.stringify({ taskListId: taskListId }), { headers: this.headers });
  }

  moveAll(srcListId: string, targetListId: string): Observable<Task[]> {
    return this.get(srcListId).pipe(
      mergeMap(tasks => from(tasks)),
      mergeMap(task => this.move(task.id, targetListId)),
      reduce((taskArr: Task[], task: Task) => [...taskArr, task], [])
    );
  }
}
