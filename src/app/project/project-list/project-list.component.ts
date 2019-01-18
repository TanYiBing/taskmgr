import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnim } from '../../anims/list.anim';
import { Project } from '../../domain';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [slideToRight, listAnim],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  @HostBinding('@routeAnim') state;

  projects: Project[];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projectService.get('37489e0c-df34-c261-71c4-ce75357e3035').subscribe(projects => this.projects = projects);
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        title: '新建项目：'
      }
    });

    dialogRef.afterClosed().subscribe(

    );


  }

  openInviteDialog() {
    this.dialog.open(InviteComponent);
  }

  openUpdateDialog() {
    this.dialog.open(NewProjectComponent, {
      data: {
        title: '编辑项目：'
      }
    });
  }

  openDeleteDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目：',
        content: '您确认删除该项目吗？'
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        this.projects = this.projects.filter(p => p.id !== project.id);
      }
    );
  }

}
