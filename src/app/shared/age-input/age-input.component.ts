import { Component, OnInit, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, NG_VALIDATORS, FormControl } from '@angular/forms';
import { map, filter, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge, combineLatest, Subscription } from 'rxjs';
import { parse, subDays, isBefore, differenceInDays, differenceInMonths, subMonths, differenceInYears, subYears, format } from 'date-fns';
import { convertToDate, isValidDate } from '../../utils/date.util';

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface Age {
  age: number;
  unit: AgeUnit;
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => AgeInputComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      // 自身还没创建，所以要用forwardRef()
      useExisting: forwardRef(() => AgeInputComponent),
      // 允许多对一，一个令牌有多个对应的内容
      multi: true
    }
  ]
})
export class AgeInputComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input() daysTop = 90;
  @Input() daysBottom = 0;
  @Input() monthsTop = 24;
  @Input() monthsBottom = 1;
  @Input() yearsBottom = 1;
  @Input() yearsTop = 150;
  @Input() debounceTime = 300;
  selectedUnit = AgeUnit.Year;
  ageForm: FormGroup;
  private subBirth: Subscription;

  ageUnits = [
    { value: AgeUnit.Year, label: '岁' },
    { value: AgeUnit.Month, label: '月' },
    { value: AgeUnit.Day, label: '天' }
  ];

  private propagateChange = (_: any) => { };

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ageForm = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, { validator: this.validateAge('ageNum', 'ageUnit') })
    });
    // 首先从formGroup中get各个控件
    const birthday = this.ageForm.get('birthday');
    const age = this.ageForm.get('age');
    const ageNum = this.ageForm.get('age.ageNum');
    const ageUnit = this.ageForm.get('age.ageUnit');

    // 紧接着获取各个控件的valueChanges的流，其中age$是根据ageNum$和ageUnit$合并得到的。
    // 然后分别标记birthday$、age$是从哪里来的，以防表单不停的更新。最后合并这两个流，
    // 得到最终的merged$，只要观察它就行了
    const birthday$ = birthday.valueChanges.pipe(
      map(d => ({ date: d, from: 'birthday' })),
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      filter(_ => birthday.valid)
    );

    const ageNum$ = ageNum.valueChanges.pipe(
      startWith(ageNum.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );

    const ageUnit$ = ageUnit.valueChanges.pipe(
      startWith(ageUnit.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );

    const age$ = combineLatest(ageNum$, ageUnit$, (_n: number, _u: AgeUnit) => this.toDate({ age: _n, unit: _u })).pipe(
      map(d => ({ date: d, from: 'age' })),
      filter(_ => age.valid)
    );

    const merged$ = merge(birthday$, age$).pipe(filter(_ => this.ageForm.valid));

    this.subBirth = merged$.subscribe((d: { date, from: string }) => {
      const aged = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (aged.age !== ageNum.value) {
          ageNum.patchValue(aged.age, { emitEvent: false });
        }
        if (aged.unit !== ageUnit.value) {
          this.selectedUnit = aged.unit;
          ageUnit.patchValue(aged.unit, { emitEvent: false });
        }
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (aged.age !== ageToCompare.age || aged.unit !== ageToCompare.unit) {
          birthday.patchValue(d.date, { emitEvent: false });
          this.propagateChange(d.date);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subBirth) {
      this.subBirth.unsubscribe();
    }
  }

  // 例如外界想要设置初始值
  writeValue(obj: any): void {
    if (obj) {
      const date = convertToDate(obj);
      this.ageForm.get('birthday').patchValue(date);
      const age = this.toAge(date);
      this.ageForm.get('age').get('ageNum').patchValue(age.age);
      this.ageForm.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  toDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year: {
        return convertToDate(subYears(now, age.age));
      }
      case AgeUnit.Month: {
        return convertToDate(subMonths(now, age.age));
      }
      case AgeUnit.Day: {
        return convertToDate(subDays(now, age.age));
      }
      default: {
        return '1991-01-01';
      }
    }
  }

  toAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = Date.now();
    if (isBefore(subDays(now, this.daysTop), date)) {
      return {
        age: differenceInDays(now, date),
        unit: AgeUnit.Day
      };
    } else if (isBefore(subMonths(now, this.monthsTop), date)) {
      return {
        age: differenceInMonths(now, date),
        unit: AgeUnit.Month
      };
    } else {
      return {
        age: differenceInYears(now, date),
        unit: AgeUnit.Year
      };
    }
  }

  validateDate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    return isValidDate(val) ? null : { birthdayInvalid: true };
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];

      const ageNumVal = ageNum.value;
      let result = false;

      switch (ageUnit.value) {
        case AgeUnit.Year: {
          result = ageNumVal >= this.yearsBottom && ageNumVal <= this.yearsTop;
          break;
        }
        case AgeUnit.Month: {
          result =
            ageNumVal >= this.monthsBottom && ageNumVal <= this.monthsTop;
          break;
        }
        case AgeUnit.Day: {
          result = ageNumVal >= this.daysBottom && ageNumVal <= this.daysTop;
          break;
        }
        default: {
          result = false;
          break;
        }
      }
      return result ? null : { ageInvalid: true };
    };
  }

  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl): { [key: string]: any } | null {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (isValidDate(val)) {
      return null;
    }
    return {
      ageInvalid: true
    };
  }

}
