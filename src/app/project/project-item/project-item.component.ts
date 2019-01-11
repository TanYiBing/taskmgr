import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() item;
  @Output() launchInviteDailog = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  openInviteDialog(ev: Event): void {
    this.launchInviteDailog.emit();
  }
}
