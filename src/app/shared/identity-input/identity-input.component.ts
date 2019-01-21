import { Component, OnInit, forwardRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';
import { IdentityType, Identity } from '../../domain';
import { Subject, Observable, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => IdentityInputComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => IdentityInputComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, ControlValueAccessor, OnDestroy {

  identityTypes = [
    {value: IdentityType.IdCard, label: '身份证'},
    { value: IdentityType.Insurance, label: '医保' },
    { value: IdentityType.Military, label: '军官证' },
    { value: IdentityType.Passport, label: '护照' },
    { value: IdentityType.Other, label: '其它' }
  ];
  identity: Identity = {identityType: null, identityNo: null};

  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  private _sub: Subscription;
  private propagateChange = (_: any) => { };

  constructor() { }

  ngOnInit() {
    const val$ = combineLatest(this.idNo, this.idType, (_id, _type) => ({ identityNo: _id, identityType: _type }));
    this._sub = val$.subscribe(
      val => {
        this.identity = val;
        this.propagateChange(val);
      }
    );
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  // 设置初始值
  public writeValue(obj): void {
    if (obj) {
      this.identity = obj;
    }
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  // 这里没有使用，用于注册 touched 状态
  public registerOnTouched(fn: any): void {
  }
  public setDisabledState?(isDisabled: boolean): void {
  }

  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl): { [key: string]: any } | null  {
    if (!c.value) {
      return null;
    }
    switch (c.value.identityType) {
      case IdentityType.IdCard: {
        return this.validateIdNumber(c);
      }
      case IdentityType.Passport: {
        return this.validatePassport(c);
      }
      case IdentityType.Military: {
        return this.validateMilitary(c);
      }
      case IdentityType.Insurance:
      default: {
        return null;
      }
    }
  }

  validateIdNumber(c: FormControl): { [key: string]: any } | null  {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return {
        idNotValid: true
      };
    }
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    const result = pattern.test(val);
    // if (pattern.test(val)) {
    //   const info = extractInfo(val);
    //   if (isValidAddr(info.addrCode) && isValidDate(info.dateOfBirth)) {
    //     result = true;
    //   }
    // }
    return result ? null : { idNotValid: true };
  }

  validateMilitary(c: FormControl): { [key: string]: any } | null {
    const value = c.value.identityNo;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    let result = false;
    if (pattern.test(value)) {
      result = true;
    }
    return result ? null : { idNotValid: true };
  }

  validatePassport(c: FormControl): { [key: string]: any } | null {
    const value = c.value.identityNo;
    if (value.length !== 9) {
      return { idNotValid: true };
    }
    const pattern = /^[GgEe]\d{8}$/;
    let result = false;
    if (pattern.test(value)) {
      result = true;
    }
    return result ? null : { idNotValid: true };
  }

  onIdTypeChange(idType: IdentityType) {
    this._idType.next(idType);
  }

  onIdNoChange(idNo: string) {
    this._idNo.next(idNo);
  }

  private get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  private get idNo(): Observable<string> {
    return this._idNo.asObservable();
  }

}
