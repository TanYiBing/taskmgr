import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input() task;
  @Input() avatar;
  @Output() itemClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    this.avatar = this.task.owner ? this.task.owner.avatar : 'unassigned';
  }

  itemClicked(ev: Event) {
    this.itemClick.emit();
  }

  checkboxClicked(ev: Event) {
    ev.stopPropagation();
  }

}
