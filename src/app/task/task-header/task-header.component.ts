import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss']
})
export class TaskHeaderComponent implements OnInit {

  @Input() header;
  @Output() newTask = new EventEmitter<void>();
  @Output() moveAllTasks = new EventEmitter<void>();
  @Output() deleteAllTasks = new EventEmitter<void>();
  @Output() updateListName = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  addNewTask(ev: Event) {
    this.newTask.emit();
  }

  onMoveAllTasks(ev: Event) {
    this.moveAllTasks.emit();
  }

  onDeleteAllTasks(ev: Event) {
    this.deleteAllTasks.emit();
  }

  onChangeListName(ev: Event) {
    this.updateListName.emit();
  }

}
