import { LightningElement, track } from 'lwc';

export default class Cr_branch extends LightningElement {
    @track selectedDate5 = "";
    @track isCalendarOpen5 = false;
    @track isNextMonthDisabled5 = false;
    @track selectedDay5;
    @track myday5;
    @track myMonth5;
    @track myYear5;
    @track showPosterreal = false;
    @track selectedDateRange5 = '';
    @track calendarDates5 = [];
    @track startDate5 = null; 
    @track endDate5 = null; 
    @track month5 = new Date().getMonth() + 1;
    @track year5 = new Date().getFullYear();
    @track startMonth5;
    @track startYear5;
    @track endMonth5;
    @track endYear5;

    openCalendar5(event) {
        event.stopPropagation();
        if (this.month5 !== this.myMonth5 && this.myMonth5 !== undefined) {
            this.month5 = this.myMonth5;
          }
          if (this.year5 !== this.myYear5 && this.myYear5 !== undefined) {
            this.year5 = this.myYear5;
          }
       
        this.isCalendarOpen5 = !this.isCalendarOpen5;
        if (!this.isCalendarOpen5) this.populateCalendar5();
    }
  
    handleInsideClick5(event) {
    event.stopPropagation();
  }
  isDateAfter5(date1, date2) {
      const d1 = new Date(date1.year, date1.month - 1, date1.day);
      const d2 = new Date(date2.year, date2.month - 1, date2.day);
      return d1 > d2;
  }

  selectDate5(event) {
      const selectedDay5 = parseInt(event.target.textContent, 10);
      if (!this.startDate5) {
          this.startDate5 = { day: selectedDay5, month: this.month5, year: this.year5 };
          this.startMonth5 = this.month5;
          this.startYear5 = this.year5;
      } else if (!this.endDate5) {
          this.endDate5 = { day: selectedDay5, month: this.month5, year: this.year5 };
          this.endMonth5 = this.month5;
          this.endYear5 = this.year5
          if (this.isDateAfter5(this.startDate5, this.endDate5)) {
              [this.startDate5, this.endDate5] = [this.endDate5, this.startDate5];
              [this.startMonth5, this.endMonth5] = [this.endMonth5, this.startMonth5];
              [this.startYear5, this.endYear5] = [this.endYear5, this.startYear5];
          }

          this.selectedDateRange5 = `${this.formatDate5(this.startDate5)} - ${this.formatDate5(this.endDate5)}`;
          this.isCalendarOpen5 = false;
      } else {
          this.startDate5 = { day: selectedDay5, month: this.month5, year: this.year5 };
          this.startMonth5 = this.month5;
          this.startYear5 = this.year5;
          this.endDate5 = null;
          this.selectedDateRange5 = '';
      }
      this.highlightRange5();
  }
  
  
     goToPreviousMonth5() {
      if(this.showPosterreal5){
        if(!this.isPrevMonthDisabled5){
          this.month5--;
          this.selectedDay5 = null;
         
          if (this.month5 < 1) {
            this.month5 = 12;
            this.year5--;
          }
       
          if (this.myMonth5 === this.month5 && this.myYear5 === this.year5) {
            this.selectedDay5 = this.myday5;
          }
          const selectedButtons = this.template.querySelectorAll(
            ".day-button5.selected5"
          );
          selectedButtons.forEach((button) => button.classList.remove("selected5","in-range5","startborder5","endborder5"));
          this.populateCalendar5();
        }
      }else{
        this.month5--;
      this.selectedDay5 = null;
      if (this.month5 < 1) {
        this.month5 = 12;
        this.year5--;
      }
      if (this.myMonth5 === this.month5 && this.myYear5 === this.year5) {
        this.selectedDay5 = this.myday5;
      }
      const selectedButtons = this.template.querySelectorAll(
        ".day-button5.selected5"
      );
      selectedButtons.forEach((button) => button.classList.remove("selected5","startborder5","endborder5","in-range5"));
      this.populateCalendar5();
      }
    }

    goToNextMonth5() {
      if (!this.isNextMonthDisabled5 && !this.showPosterreal5) {
        this.month5++;
        const selectedButtons = this.template.querySelectorAll(
          ".day-button5.selected5"
        );
        selectedButtons.forEach((button) => button.classList.remove("selected5","in-range5","startborder5","endborder5"));
        this.selectedDay5 = null;
        if (this.month5 > 12) {
          this.month5 = 1;
          this.year5++;
        }
        if (this.myMonth5 === this.month5 && this.myYear5 === this.year5) {
          this.selectedDay5 = this.myday5;
        }
        this.populateCalendar5();
      }else if(this.showPosterreal){
        this.month5++;
        const selectedButtons = this.template.querySelectorAll(
          ".day-button5.selected5"
        );
        selectedButtons.forEach((button) => button.classList.remove("selected5","in-range5","startborder5","endborder5"));
        this.selectedDay5 = null;
        if (this.month5 > 12) {
          this.month5 = 1;
          this.year5++;
        }
        if (this.myMonth5 === this.month5 && this.myYear5 === this.year5) {
          this.selectedDay5 = this.myday5;
        }
        this.populateCalendar5();
      }
    }
    
	populateCalendar5() {
        const today = new Date();
        const firstDayOfMonth = new Date(this.year5, this.month5 - 1, 1).getDay();
        const daysInMonth = new Date(this.year5, this.month5, 0).getDate();
    
        this.calendarDates5 = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            this.calendarDates5.push({
                value: '',
                className: 'day-button5 empty5',
                isEmpty: true,
                isDisabled: true,
            });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(this.year5, this.month5 - 1, i);
            const isDisabled = currentDate < today;
            this.calendarDates5.push({
                value: i,
                className: isDisabled ? 'day-button5 disabled5' : 'day-button5',
                isEmpty: false,
                isDisabled,
                month: this.month,
                year: this.year,
            });
        }
        this.highlightRange5();
    }
    
    highlightRange5() {
        const allDays = this.template.querySelectorAll('.day-button5');
        allDays.forEach(day => day.classList.remove("selected5","in-range5","startborder5","endborder5"));
        if (this.startDate5) {
            const startDay = this.template.querySelector(
                `[data-day="${this.startDate5.day}"][data-month="${this.startDate5.month}"][data-year="${this.startDate5.year}"]`
            );
            if (startDay) startDay.classList.add('selected5','startborder5');
        }
        if (this.endDate5) {
            const endDay = this.template.querySelector(
                `[data-day="${this.endDate5.day}"][data-month="${this.endDate5.month}"][data-year="${this.endDate5.year}"]`
            );
            if (endDay) endDay.classList.add('selected5','endborder5');
        }
        if (this.startDate5 && this.endDate5) {
            this.calendarDates5.forEach(day => {
                if (
                    !day.isDisabled &&
                    day.value &&
                    this.isWithinRange5(
                        { day: day.value, month: this.month5, year: this.year5 },
                        this.startDate5,
                        this.endDate5
                    )
                ) {
                    if (
                        !(
                            day.value === this.startDate5.day &&
                            this.month5 === this.startDate5.month &&
                            this.year5 === this.startDate5.year
                        ) &&
                        !(
                            day.value === this.endDate5.day &&
                            this.month5 === this.endDate5.month5 &&
                            this.year5 === this.endDate5.year5
                        )
                    ) {
                        const dayElement = this.template.querySelector(
                            `[data-day="${day.value}"][data-month="${this.month5}"][data-year="${this.year5}"]`
                        );
                        if (dayElement) dayElement.classList.add('in-range5');
                    }
                }
            });
        }

        if (this.startDate5 && JSON.stringify(this.startDate5) === JSON.stringify(this.endDate5)) {
            const dayElement = this.template.querySelector(
                `[data-day="${this.startDate5.day}"][data-month="${this.month5}"][data-year="${this.year5}"]`
            );
            if (dayElement) dayElement.classList.remove('startborder5','endborder5'),dayElement.classList.add('singleborder5');
        }
    }

    formatJapaneseYear5(isoDate) {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        let reiwaYear;
        
        if (year === 2019) {
            return `平成31年 / 令和1年`;
        } else if (year > 2019) {
            reiwaYear = year - 2018;
            return `令和${reiwaYear}年`;
        } else {
            reiwaYear = 30 - (2018 - year);
            return `平成${reiwaYear}年`;
        }
    }

    convertToReiwaYear5(gregorianYear, month = 1, day = 1) {
        if (gregorianYear < 2019 || (gregorianYear === 2019 && (month < 5 || (month === 5 && day < 1)))) {
            return "無効な令和年";
        }
        const reiwaYear = gregorianYear - 2018;
        return reiwaYear === 1 ? `令和1年`: `令和${reiwaYear}年`;
    }

    get reiwaYear5() {
       return this.convertToReiwaYear5(this.year5,this.month5);
    }
    
    isWithinRange5(currentDate, startDate, endDate) {
        const current = new Date(currentDate.year, currentDate.month - 1, currentDate.day);
        const start = new Date(startDate.year, startDate.month - 1, startDate.day);
        const end = new Date(endDate.year, endDate.month - 1, endDate.day);
        return current >= start && current <= end;
    }
    
    formatDate5(date) {
        return `${date.year}年${String(date.month).padStart(2, '0')}月${String(date.day).padStart(2, '0')}日`;
    }

    nextyear5() {
        if (!this.isNextYearDisabled5 && !this.showPosterreal) {
            this.year5++;
            const selectedButtons = this.template.querySelectorAll(
              ".day-button5.selected5"
            );
            selectedButtons.forEach((button) =>
              button.classList.remove("selected5", "in-range5", "startborder5", "endborder5","singleborder5")
            );
            this.selectedDay5 = null;
            if (this.myYear5 === this.year5) {
              this.selectedDay5 = this.myday5;
              this.month5 = this.myMonth5;
            }
            this.populateCalendar5();
          } else if (this.showPosterreal) {
            this.year5++;
            const selectedButtons = this.template.querySelectorAll(
              ".day-button5.selected5"
            );
            selectedButtons.forEach((button) =>
              button.classList.remove("selected5", "in-range5", "startborder5", "endborder5","singleborder5")
            );
            this.selectedDay5 = null;
            if (this.myYear5 === this.year5) {
              this.selectedDay5 = this.myday5;
              this.month5 = this.myMonth5;
            }
            this.populateCalendar5();
          }
    }
    
  
    getMonthLabel5(month) {
    const monthLabels = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月"
    ];
    return monthLabels[month - 1];
  }
  
    get monthLabel5() {
    return this.getMonthLabel5(this.month5);
  }

  
  resetDate5() {
    this.selectedDate5 = null;
    this.startDate5 = null;
    this.endDate5 = null;
    this.selectedDateRange5 = '';
    this.selectedDay5 = null;
    this.startMonth5 = null;
    this.endMonth5 = null;
    this.startYear5 = null;
    this.endYear5 = null;

    const todayD = new Date();
    this.year5 = todayD.getFullYear();
    this.myYear5 = todayD.getFullYear();
    this.month5 = todayD.getMonth() + 1;
    this.myMonth5 = todayD.getMonth() + 1;
    this.myday5 = undefined;

    const inputField = this.template.querySelector(".custom-input5");
    if (inputField) {
        inputField.value = "";
    }

    const allButtons = this.template.querySelectorAll(".day-button5");
    allButtons.forEach(button => {
        button.classList.remove("selected5", "in-range5", "startborder5", "endborder5","singleborder5");
    });
    this.populateCalendar5();
}

handleOutsideClick5(event) {
    const calendarPopup = this.template.querySelector('.calendar-popup5');
    const inputField = this.template.querySelector('.custom-input5');
    if (calendarPopup && !calendarPopup.contains(event.target) && !inputField.contains(event.target)) {
        this.isCalendarOpen5 = false;
    }
}

connectedCallback() {
    window.addEventListener('click', this.handleOutsideClick5.bind(this));
    this.populateCalendar5();
}

renderedCallback() {
    this.highlightRange5();
}

disconnectedCallback() {
    window.removeEventListener('click', this.handleOutsideClick5.bind(this));
}

}