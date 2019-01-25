import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from '../../anims/router.anim';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from '../../../../node_modules/rxjs/operators';
import { TaskList } from '../../domain';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [slideToRight],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {

  @HostBinding('@routeAnim') state;

  lists$: Observable<TaskList[]>;
  private projectId$: Observable<string>;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store$: Store<fromRoot.State>,
    private route: ActivatedRoute
  ) {
    this.projectId$ = this.route.paramMap.pipe(map(p => <string>p.get('id')));
    this.lists$ = this.store$.select(fromRoot.getTaskListsState);
  }

  ngOnInit() {
  }

  lunchNewTaskDialog() {
    this.dialog.open(NewTaskComponent, {
      data: {
        title: '新建任务：'
      }
    });
    this.cd.markForCheck();
  }

  lunchCopyTasksDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, {
      data: {
        lists: this.lists
      }
    });
    this.cd.markForCheck();
  }

  lunchUpdateTaskDialog(task) {
    this.dialog.open(NewTaskComponent, {
      data: {
        title: '修改任务：',
        task: task
      }
    });
    this.cd.markForCheck();
  }

  lunchDeleteTasksDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除任务列表：',
        content: '您确认删除该任务列表吗？'
      }
    });

    dialogRef.afterClosed().subscribe(
      result => console.log(result)
    );
    this.cd.markForCheck();
  }

  lunchUpdateListNameDialog() {
    this.dialog.open(NewTaskListComponent, {
      data: {
        title: '修改列表名称：'
      }
    });
    this.cd.markForCheck();
  }

  addNewTaskList() {
    this.dialog.open(NewTaskListComponent, {
      data: {
        title: '新建任务列表：'
      }
    });
    this.cd.markForCheck();
  }

  handleMove(srcdata, list) {
    switch (srcdata.tag) {
      case 'task-item': {
        console.log('task-item');
        break;
      }
      case 'task-list': {
        console.log('task-list');
        const srcList = srcdata.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      }
      default:
        break;
    }
  }

  handleQuickTask(desc) {
    console.log(desc);

  }

}
