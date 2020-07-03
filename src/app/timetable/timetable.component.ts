import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StaffService } from "../services/staff.service";

@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.css"],
})
export class TimetableComponent implements OnInit {
  constructor(private _staffService: StaffService) {}

  days: number[] = [];
  showingYear: number;
  showingMonth: string;
  months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  today: Date;
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  newSchedule: FormGroup;
  bShowCalendar: boolean = true;
  bShowNewScheduleForm: boolean = false;
  ngOnInit() {
    this.today = new Date();
    this.showingMonth = this.months[this.today.getMonth()];
    this.showingYear = this.today.getFullYear();
    this.currentDay = this.today.getDate();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.generateDays(this.today.getMonth(), this.today.getFullYear());
  }

  isLeapYear(year: number) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  }
  // jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec
  // 0    1   2   3   4   5   6   7   8   9   10  11
  // 31   28  31  30  31  30  31  31  30  31  30  31

  generateDays(month: number, year: number) {
    let startOfTheMonth = this.today.getDay();
    if (this.isLeapYear(year)) {
      if (month === 1) {
        // 29 days
        this.pushDays(startOfTheMonth, 29);
      } else if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        // 31 days
        this.pushDays(startOfTheMonth, 31);
      } else {
        // 30 days
        this.pushDays(startOfTheMonth, 30);
      }
    } else {
      if (month === 1) {
        // 28 days
        this.pushDays(startOfTheMonth, 28);
      } else if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        // 31 days
        this.pushDays(startOfTheMonth, 31);
      } else {
        // 30 days
        this.pushDays(startOfTheMonth, 30);
      }
    }
  }

  pushDays(startOfTheMonth, numberOfDays) {
    this.days.length = 0;
    for (let i = 1; i < startOfTheMonth; i++) {
      this.days.push(null);
    }
    for (let i = 1; i <= numberOfDays; i++) {
      this.days.push(i);
    }
  }

  onMonthMinus() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
    this.today = new Date(this.currentYear, this.currentMonth);
    this.showingMonth = this.months[this.today.getMonth()];
    this.showingYear = this.today.getFullYear();
    this.generateDays(this.today.getMonth(), this.today.getFullYear());
  }

  onMonthPlus() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
    this.today = new Date(this.currentYear, this.currentMonth);
    this.showingMonth = this.months[this.today.getMonth()];
    this.showingYear = this.today.getFullYear();
    this.generateDays(this.today.getMonth(), this.today.getFullYear());
  }

  showNewScheduleForm() {
    this.initialize_newScheduleForm();
    this.bShowNewScheduleForm = true;
    this.bShowCalendar = false;
  }
  hideNewScheduleForm() {
    this.bShowNewScheduleForm = false;
    this.bShowCalendar = true;
  }

  onDayClick(day: number) {
    let strDay = String(day).padStart(2, "0");
    let strMonth = String(this.currentMonth + 1).padStart(2, "0");
    console.log(`Day clicked :: ${this.currentYear}-${strMonth}-${strDay}`);
  }

  initialize_newScheduleForm() {
    this.newSchedule = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      batch: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      fac_staff_name: new FormControl(null, [Validators.required]),
      fac_staff_id: new FormControl(null, [Validators.required]),
      fac_id_staff: new FormControl(null, [Validators.required]),
      room: new FormControl(null, [Validators.required]),
      start_time: new FormControl(null, [Validators.required]),
      end_time: new FormControl(null, [Validators.required]),
    });
  }

  onSearchStaff() {
    console.log(this.newSchedule.value.fac_staff_name);
    if (this.newSchedule.value.fac_staff_name)
      this._staffService
        .get_staff(this.newSchedule.value.fac_staff_name)
        .subscribe(
          (data: any) => {
            if (data.success && "data" in data) {
              this.newSchedule.patchValue({
                fac_staff_name: data.data.name,
                fac_staff_id: data.data.staff_id,
                fac_id_staff: data.data.id_staff,
              });
            } else {
              alert("No details found with the provided details!");
              this.newSchedule.patchValue({
                fac_staff_id: null,
                fac_id_staff: null,
              });
            }
          },
          (err) => {
            console.log(err);
            alert("Error fetching details with the provided details!");
            this.newSchedule.patchValue({
              fac_staff_id: null,
              fac_id_staff: null,
            });
          }
        );
  }
  
  saveSchedule() {
    console.log(this.newSchedule.value);
  }
}
