import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() item;
  @Output() launchInviteDailog = new EventEmitter<void>();
  @Output() launchUpdateDailog = new EventEmitter<void>();
  @Output() launchDeleteDailog = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  openInviteDialog(ev: Event): void {
    this.launchInviteDailog.emit();
  }

  openUpdateDialog(ev: Event): void {
    this.launchUpdateDailog.emit();
  }

  openDeleteDialog(ev: Event): void {
    this.launchDeleteDailog.emit();
  }
}
