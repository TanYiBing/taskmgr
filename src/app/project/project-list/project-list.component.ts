import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnim } from '../../anims/list.anim';
import { Project } from '../../domain';
import { ProjectService } from '../../services/project.service';
import * as _ from 'lodash';
import { filter, switchMap, map, take } from 'rxjs/operators';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [slideToRight, listAnim],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  projects: Project[];
  sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sub = this.projectService.get('37489e0c-df34-c261-71c4-ce75357e3035').subscribe(projects => {
      this.projects = projects;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

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
      map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg)})),
      switchMap(v => this.projectService.add(v))
    ).subscribe(project => {
        this.projects = [...this.projects, project];
        this.cd.markForCheck();
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
      switchMap(v => this.projectService.update(v))
    ).subscribe(p => {
      const index = this.projects.map(prj => prj.id).indexOf(p.id);
        this.projects = [...this.projects.slice(0, index), p, ...this.projects.slice(index + 1)];
        this.cd.markForCheck();
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
      filter(n => n),
      // tslint:disable-next-line:no-shadowed-variable
      switchMap( _ => this.projectService.del(project))
    ).subscribe(prj => {
      this.projects = this.projects.filter(p => p.id !== prj.id);
      this.cd.markForCheck();
    });
  }

  private getThumbnails() {
    return _.range(0, 40).map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

}
