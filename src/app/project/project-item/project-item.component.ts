import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { cardAnim } from '../../anims/card.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [cardAnim]
})
export class ProjectItemComponent implements OnInit {

  @Input() item;
  @Output() launchInviteDailog = new EventEmitter<void>();
  @Output() launchUpdateDailog = new EventEmitter<void>();
  @Output() launchDeleteDailog = new EventEmitter<void>();
  @HostBinding('@card') cardState = 'out';

  constructor() { }

  ngOnInit() {
  }

  @HostListener('mouseenter') mouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave') mouseLeave() {
    this.cardState = 'out';
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
