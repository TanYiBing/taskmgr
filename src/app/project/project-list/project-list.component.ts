import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnim } from '../../anims/list.anim';
import { Project } from '../../domain';
import * as _ from 'lodash';
import { filter, switchMap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as projectActions from '../../actions/project.action';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [slideToRight, listAnim],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  projects$: Observable<Project[]>;
  listAmin$: Observable<number>;

  constructor(
    private dialog: MatDialog,
    private store$: Store<fromRoot.State>
  ) {
    this.store$.dispatch(new projectActions.LoadAction());
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.listAmin$ = this.projects$.pipe(
      map(p => p.length)
    );
  }

  ngOnInit() {}

  ngOnDestroy() {}

  openNewProjectDialog() {
    const thumbnails = this.getThumbnails();
    const img = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        thumbnails: thumbnails,
        img: img
      }
    });

    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg)}))
    ).subscribe(project => {
        this.store$.dispatch(new projectActions.AddAction(project));
      });
  }

  openInviteDialog() {
    this.dialog.open(InviteComponent, {data: {members: []}});
  }

  openUpdateDialog(project: Project) {
    const thumbnails = this.getThumbnails();
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        project: project,
        thumbnails: thumbnails,
      }
    });

    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) })),
    ).subscribe(p => {
      this.store$.dispatch(new projectActions.UpdateAction(project));
      });
  }

  openDeleteDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目：',
        content: '您确认删除该项目吗？'
      }
    });

    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n)
    ).subscribe(() => {
      this.store$.dispatch(new projectActions.DeleteAction(project));
    });
  }

  private getThumbnails() {
    return _.range(0, 40).map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

  selectProject(project: Project) {
    this.store$.dispatch(new projectActions.SelectAction(project));
  }

}
