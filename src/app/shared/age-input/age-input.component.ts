import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, NG_VALIDATORS } from '@angular/forms';
import { map, combineLatest } from 'rxjs/operators';

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
export class AgeInputComponent implements OnInit, ControlValueAccessor {

  ageForm: FormGroup;

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
      birthday: [],
      age: this.fb.group({
        ageNum: [],
        ageUnit: []
      })
    });

    const birthday = this.ageForm.get('birthday');
    const age = this.ageForm.get('age');
    const ageNum = this.ageForm.get('age.ageNum');
    const ageUnit = this.ageForm.get('age.ageUnit');

    const birthday$ = birthday.valueChanges.pipe(
      map(d => ({date: d, from: 'birthday'}))
    );
    const ageNum$ = ageNum.valueChanges;
    const ageUnit$ = ageUnit.valueChanges;

    const age$ = combineLatest(ageNum$, ageUnit$, (_n: Number, _u: AgeUnit) => {
      return this.toDate({ age: _n, unit: _u }).pipe(
        map(d => ({ date: d, from: 'age' }))
      );
    });

    birthday$.subscribe(v => console.log(v));
    ageNum$.subscribe(v => console.log(v));
    ageUnit$.subscribe(v => console.log(v));
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  validator() {

  }

}
