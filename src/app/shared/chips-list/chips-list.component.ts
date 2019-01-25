import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { User } from '../../domain';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => ChipsListComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => ChipsListComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsListComponent implements OnInit, ControlValueAccessor {

  form: FormGroup;
  items: User[];
  memberResults$: Observable<User[]>;
  @Input() multiple = true;
  @Input() label = '添加/修改成员';
  @Input() placeholderText = '请输入成员 email';

  private propagateChange = (_: any) => { };

  constructor(
    private fb: FormBuilder,
    private userService:  UserService
  ) {
    this.items = [];
   }

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    });

    this.memberResults$ = this.form.get('memberSearch').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(s => s && s.length > 1),
      switchMap(str => this.userService.searchUsers(str))
    );
  }

  public writeValue(obj: User[]): void {
    if (obj && this.multiple) {
      const userEntities: { [id: string]: User } = obj.reduce((e, c) => ({...e, c}), {});
      if (this.items) {
        const remainging = this.items.filter(item => !userEntities[item.id]);
        this.items = [...remainging, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }

  // 当表单控件值改变时，函数 fn 会被调用
  // 这也是我们把变化 emit 回表单的机制
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  // 这里没有使用，用于注册 touched 状态
  public registerOnTouched(fn: any): void {
  }

  public setDisabledState?(isDisabled: boolean): void {
  }

  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl) {
    return this.items ? null : {
      chipListInvalid: {
        valid: false,
      },
    };
  }

  removeMember(member: User) {
    const ids = this.items.map(item => item.id);
    const i = ids.indexOf(member.id);
    if (this.multiple) {
      this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
    } else {
      this.items = [];
    }
    this.form.patchValue({ memberSearch: '' });
    this.propagateChange(this.items);
  }

  handleMemberSelection(member: User) {
    if (this.items.map(u => u.id).indexOf(member.id) !== -1) {
      return;
    }
    if (this.multiple) {
      this.items = [...this.items, member];
    } else {
      this.items = [member];
    }
    this.form.patchValue({ memberSearch: member.name });
    this.propagateChange(this.items);
  }

  displayUser(user: User): string {
    return user ? <string>user.name : '';
  }

  get displayInput() {
    return this.multiple || (this.items.length === 0);
  }

}
