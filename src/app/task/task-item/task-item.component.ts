import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { itemAnim } from '../../anims/item.anim';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [itemAnim],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent implements OnInit {

  @Input() task;
  @Input() avatar;
  @Output() itemClick = new EventEmitter<void>();
  widerPriority = 'in';

  constructor() { }

  ngOnInit() {
    this.avatar = this.task.owner ? this.task.owner.avatar : 'unassigned';
  }

  @HostListener('mouseenter') mouseEnter() {
    this.widerPriority = 'out';
  }

  @HostListener('mouseleave') mouseLeave() {
    this.widerPriority = 'in';
  }

  itemClicked(ev: Event) {
    this.itemClick.emit();
  }

  checkboxClicked(ev: Event) {
    ev.stopPropagation();
  }

}
