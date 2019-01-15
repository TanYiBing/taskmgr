import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDirective } from './drag-drop/drop.directive';
import { DragDirective } from './drag-drop/drag.directive';

@NgModule({
  declarations: [DropDirective, DragDirective],
  imports: [
    CommonModule
  ]
})
export class DirectiveModule { }
