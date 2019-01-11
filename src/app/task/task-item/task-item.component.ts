import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input() task;
  @Input() avatar;

  constructor() { }

  ngOnInit() {
    this.avatar = this.task.owner ? this.task.owner.avatar : 'unassigned';
  }

}
