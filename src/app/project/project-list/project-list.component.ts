import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects = [
    {
      'name': '问题跟踪系统',
      'desc': '用于 Bug 的内部跟踪和管理',
      'coverImg': '/assets/img/covers/1.jpg',
    },
    {
      'name': '某某公司 ERP 系统',
      'desc': '为某某公司开发的定制化 ERP 系统',
      'coverImg': '/assets/img/covers/20.jpg',
    }
  ];

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        title: '新建项目：'
      }
    });

    dialogRef.afterClosed().subscribe(
      result =>　console.log(result)
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

  openDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目：',
        content: '您确认删除该项目吗？'
      }
    });

    dialogRef.afterClosed().subscribe(
      result => 　console.log(result)
    );
  }

}
