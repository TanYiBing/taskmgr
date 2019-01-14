import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const listAnim = trigger('list', [
  transition('* => *', [
    query(':enter', style({ 'opacity': 0 }), { optional: true }),
    query(':enter', stagger(500, [
      animate('2s', style({ 'opacity': 1 }))
    ]), { optional: true }),
    query(':leave', style({ 'opacity': 1 }), { optional: true }),
    query(':leave', stagger(500, [
      animate('2s', style({ 'opacity': 0 }))
    ]), { optional: true })
  ])
]);

