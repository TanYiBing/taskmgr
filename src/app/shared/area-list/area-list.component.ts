import { Component, OnInit, forwardRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '../../../../node_modules/@angular/forms';
import { Address } from '../../domain';
import { Subject, Subscription, combineLatest, Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getProvinces, getCitiesByProvince, getAreasByCity } from '../../utils/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => AreaListComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => AreaListComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, ControlValueAccessor, OnDestroy {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;
  provinces$: Observable<string[]>;
  private _province = new Subject<string>();
  private _city = new Subject<string>();
  private _district = new Subject<string>();
  private _street = new Subject<string>();
  private _sub: Subscription;
  private propagateChange = (_: any) => { };

  constructor() { }

  ngOnInit() {
    const province$ = this._province.asObservable().pipe(startWith(''));
    const city$ = this._city.asObservable().pipe(startWith(''));
    const district$ = this._district.asObservable().pipe(startWith(''));
    const street$ = this._street.asObservable().pipe(startWith(''));
    const val$ = combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
     return {
       province: _p,
       city: _c,
       district: _d,
       street: _s
      };
    });
    this._sub = val$.subscribe(val => this.propagateChange(val));


    this.provinces$ = of(getProvinces());
    // 根据省份的选择得到城市列表
    this.cities$ = province$.pipe(
      map(province => getCitiesByProvince(province))
    );
    // 根据省份和城市的选择得到地区列表
    this.districts$ = combineLatest(province$, city$).pipe(
      map(([p, c]) => getAreasByCity(p, c))
    );
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  // 设置初始值
  public writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
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
  validate(c: FormControl): { [key: string]: any } | null {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street && val.street.length >= 4) {
      return null;
    }
    return {
      addressNotValid: true
    };
  }

  onProvinceChange() {
    this._province.next(this._address.province);
    console.log(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
    console.log(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
    console.log(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
    console.log(this._address.street);
  }

}
