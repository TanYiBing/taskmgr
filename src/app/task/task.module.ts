import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskHeaderComponent } from './task-header/task-header.component';
import { TaskHomeComponent } from './task-home/task-home.component';
import { TaskRoutingModule } from './task-routing.module';
import { NewTaskComponent } from './new-task/new-task.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskItemComponent,
    TaskHeaderComponent,
    TaskHomeComponent,
    NewTaskComponent
  ],
  imports: [
    SharedModule,
    TaskRoutingModule
  ],
  entryComponents: [
    NewTaskComponent
  ]
})
export class TaskModule { }
