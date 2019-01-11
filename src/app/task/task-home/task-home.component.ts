import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss']
})
export class TaskHomeComponent implements OnInit {

  lists = [
    {
      id: 1,
      name:　'代办',
      tasks: [
        {
          id: 1,
          desc: '任务一：去星巴克买杯咖啡',
          owner: {
            id: 1,
            name: '张三',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
        },
        {
          id: 2,
          desc: '任务一：完成老板布置的ppt任务',
          owner: {
            id: 1,
            name: '李四',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
        },
      ]
    },
    {
      id: 1,
      name: 　'进行中',
      tasks: [
        {
          id: 1,
          desc: '任务一：去星巴克买杯咖啡',
          owner: {
            id: 1,
            name: '张三',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
        },
        {
          id: 2,
          desc: '任务一：完成老板布置的ppt任务',
          owner: {
            id: 1,
            name: '李四',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
        },
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
