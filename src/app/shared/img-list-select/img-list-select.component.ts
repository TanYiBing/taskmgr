import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

@Component({
  selector: 'app-img-list-select',
  templateUrl: './img-list-select.component.html',
  styleUrls: ['./img-list-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => ImgListSelectComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => ImgListSelectComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    }
  ]
})
export class ImgListSelectComponent implements ControlValueAccessor {

  @Input() title = '选择';
  @Input() cols = 6;
  // cols默认为6
  @Input() rowHeight = '64px';
  // rowHeight默认为64px
  @Input() items: string[] = [];
  @Input() useSvgIcon = false;
  @Input() itemWidth = '80px';

  selected: string;

  private propagateChange = (_: any) => { };

  constructor() { }

  onChange(i) {
    this.selected = this.items[i];
    this.propagateChange(this.items[i]);
  }

  writeValue(obj: any): void {
    this.selected = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl) {
    return this.selected
      ? null
      : {
        imageListSelect: {
          valid: false
        }
      };
  }
}
