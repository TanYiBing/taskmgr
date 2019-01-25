import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { cardAnim } from '../../anims/card.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [cardAnim],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent implements OnInit {

  @Input() item;
  @Output() launchInviteDailog = new EventEmitter<void>();
  @Output() launchUpdateDailog = new EventEmitter<void>();
  @Output() launchDeleteDailog = new EventEmitter<void>();
  @Output() itemSelected = new EventEmitter<void>();
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
    ev.preventDefault();
    ev.stopPropagation();
    this.launchInviteDailog.emit();
  }

  openUpdateDialog(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.launchUpdateDailog.emit();
  }

  openDeleteDialog(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.launchDeleteDailog.emit();
  }

  onClick(ev: Event) {
    ev.preventDefault();
    this.itemSelected.emit();
  }
}
