import { NgModule } from '@angular/core';
import { DropDirective } from './drag-drop/drop.directive';
import { DragDirective } from './drag-drop/drag.directive';

@NgModule({
  declarations: [
    DropDirective,
    DragDirective
  ],
  exports: [
    DropDirective,
    DragDirective
  ]
})
export class DirectiveModule { }
