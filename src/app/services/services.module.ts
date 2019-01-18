import { NgModule } from '@angular/core';
import { QuoteService } from './quote.service';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ProjectService } from './project.service';
import { TaskListService } from './task-list.service';
import { TaskService } from './task.service';

@NgModule()
export class ServicesModule {
  // 为了动态的导入一些内容，所以可以自定义forRoot方法
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        QuoteService,
        ProjectService,
        TaskListService,
        TaskService
      ]
    };
  }
}
