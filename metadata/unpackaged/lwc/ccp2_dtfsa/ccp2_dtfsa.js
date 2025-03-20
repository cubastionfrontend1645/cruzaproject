import { LightningElement, track } from 'lwc';

export default class Ccp2_dtfsa extends LightningElement {
    @track isCalendarOpen = false;
    @track startDate = null;
    @track endDate = null;
    @track calendarDates = [];
    @track year = new Date().getFullYear();
    @track month = new Date().getMonth() + 1;
    startYear;
    startMonth;
    endYear;
    endMonth;
    selectedDateRange="";
    @track isNextYearDisabled = false;


    get isNextMonthDisabled() {
        const today = new Date();
        const selectedDate = new Date(this.year, this.month, 1);
        return selectedDate > today;
    }


    get monthLabel() {
        return this.getMonthLabel(this.month);
    }

    get reiwaYear() {
    return this.convertToReiwaYear(this.year, this.month);
    }

    connectedCallback() {
        this.populateCalendar();
    }


    convertToReiwaYear(gregorianYear, month = 1, day = 1) {
        if (gregorianYear < 2019 || (gregorianYear === 2019 && (month < 5 || (month === 5 && day < 1)))) {
          return "無効な令和年";
        }
        const reiwaYear = gregorianYear - 2018;
        return reiwaYear === 1 ? `令和1年` : `令和${reiwaYear}年`;
      }
    getMonthLabel(month) {
        const monthLabels = [
            "1月", "2月", "3月", "4月", "5月", "6月",
            "7月", "8月", "9月", "10月", "11月", "12月"
        ];
        return monthLabels[month - 1];
    }

    isDateAfter(date1, date2) {
        const d1 = new Date(date1.year, date1.month - 1, date1.day);
        const d2 = new Date(date2.year, date2.month - 1, date2.day);
        return d1 > d2;
    }

    formatDateToYYYYMMDD(date) {
        if (!date || !(date instanceof Date)) {
            console.error("Invalid date:", date);
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
    
        return `${year}-${month}-${day}`;
    }

    formatDate(date) {
        return `${date.year}年${String(date.month).padStart(2, '0')}月${String(date.day).padStart(2, '0')}日`;
    }
    
    selectDate(event) {
        const selectedDay = parseInt(event.target.textContent, 10);
        if (!this.startDate) {
            this.startDate = { day: selectedDay, month: this.month, year: this.year };
            console.log("Starting Date:", this.startDate.year);
            this.startMonth = this.month;
            this.startYear = this.year;
        } else if (!this.endDate) {
            this.endDate = { day: selectedDay, month: this.month, year: this.year };
            this.endMonth = this.month;
            this.endYear = this.year;
            if (this.isDateAfter(this.startDate, this.endDate)) {
                [this.startDate, this.endDate] = [this.endDate, this.startDate];
                [this.startMonth, this.endMonth] = [this.endMonth, this.startMonth];
                [this.startYear, this.endYear] = [this.endYear, this.startYear];
            }
    
            this.selectedDateRange = `${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}`;
        } else {
            const selectedButtons = this.template.querySelectorAll(".day-button");
            selectedButtons.forEach((button) => button.classList.remove("selected", "in-range", "startborder", "endborder", "singleborder"));
           
            this.startDate = { day: selectedDay, month: this.month, year: this.year };
            this.startMonth = this.month;
            this.startYear = this.year;
            this.endDate = null;
            this.selectedDateRange = "";
        }
        this.populateCalendar();
    }

    resetDate() {
        this.startDate = null;
        this.endDate = null;
        this.selectedDateRange = "";
        const todayD = new Date();
        const nextDay = new Date(todayD);
        nextDay.setDate(todayD.getDate() + 1);
        this.isNextYearDisabled = true;
    
        let nextMonth = nextDay.getMonth() + 1;
        let nextYear = nextDay.getFullYear();
        this.year = nextYear;
        this.month = nextMonth;
        console.log("Reset working");

        const inputField = this.template.querySelector(".custom-input");
        inputField.value = "";

        const selectedButtons = this.template.querySelectorAll(".day-button");
        selectedButtons.forEach((button) => button.classList.remove("selected", "in-range", "startborder", "endborder", "singleborder"));
        this.populateCalendar();
    }

    goToPreviousMonth() {
        if (this.month === 1) {
            this.month = 12;
            this.year--;
            this.addyear();
        } else {
            this.month--;
        }
        const selectedButtons = this.template.querySelectorAll(".day-button");
        selectedButtons.forEach((button) => button.classList.remove("selected", "in-range", "startborder", "endborder", "singleborder"));
       
        this.populateCalendar();
    }

    goToNextMonth() {
        if (this.isNextMonthDisabled) {
            return;
        }
        if (this.month === 12) {
            this.month = 1;
            this.year++;
            const today = new Date();
            const currentMonth = today.getMonth()+1;
            const currentYear = today.getFullYear();
            if (this.year >= currentYear)  {
                this.removeyear();
                this.year = currentYear;
                this.month = this.month > currentMonth ? currentMonth : this.month;
            }
        } else {
            this.month++;
        }
        const selectedButtons = this.template.querySelectorAll(".day-button");
        selectedButtons.forEach((button) => button.classList.remove("selected", "in-range", "startborder", "endborder", "singleborder"));
       
        this.populateCalendar();
    }

    nextyear() {
        if (this.isNextYearDisabled) {
            return;
        }
        this.year++;
        const today = new Date();
        const currentMonth = today.getMonth()+1;
        const currentYear = today.getFullYear();
        if (this.year >= currentYear)  {
            this.removeyear();
            this.year = currentYear;
            this.month = this.month > currentMonth ? currentMonth : this.month;
        }
        this.populateCalendar();
    }

    prevyear() {
        this.year--;
        this.addyear();
        this.populateCalendar();
    }
    
    addyear() {
        this.isNextYearDisabled = false;
        let pathelement = this.template.querySelector(".next-year-toggle");
        if (pathelement) pathelement.classList.add("active");
    }
    removeyear() {
        this.isNextYearDisabled = true;
        let pathelement = this.template.querySelector(".next-year-toggle");
        if (pathelement) pathelement.classList.remove("active");
    }

    openCalendar() {
        this.isCalendarOpen = !this.isCalendarOpen;
        if (this.isCalendarOpen) {
            if (this.startDate) {
                this.month = this.startDate.month;
                this.year = this.startDate.year;
                this.selectedDay = this.startDate.day;
            } else {
                const currentDate = new Date();
                this.month = currentDate.getMonth() + 1; 
                this.year = currentDate.getFullYear();
            }
            const today = new Date();
            const currentMonth = today.getMonth()+1;
            const currentYear = today.getFullYear();
            if (this.year >= currentYear)  {
                this.removeyear();
                this.year = currentYear;
                this.month = this.month > currentMonth ? currentMonth : this.month;
            }
        }
        this.populateCalendar();
    }
    
    populateCalendar() {
        try {
            if (!this.year || !this.month) {
                console.error("Year or month is not defined");
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
            const daysInMonth = new Date(this.year, this.month, 0).getDate();
            const previousMonth = this.month === 1 ? 12 : this.month - 1;
            const previousYear = this.month === 1 ? this.year - 1 : this.year;
            const nextMonth = this.month === 12 ? 1 : this.month + 1;
            const nextYear = this.month === 12 ? this.year + 1 : this.year;
            this.calendarDates = [];
            console.log("firstDayOfMonth", firstDayOfMonth);
            const previousMonthDays = new Date(this.year, this.month - 1, 0).getDate();
            const daysFromPreviousMonth = firstDayOfMonth === 0 ? 0 : firstDayOfMonth - 1; 
            for (let i = previousMonthDays - daysFromPreviousMonth; i <= previousMonthDays; i++) {
                this.calendarDates.push({
                    value: i,
                    className: "day-button disabled",
                    isEmpty: true,
                    isDisabled: true,
                    month: previousMonth,
                    year: previousYear,
                    key: JSON.stringify([i, previousMonth, previousYear])
                });
            }
            for (let i = 1; i <= daysInMonth; i++) {
                const currentDate = new Date(this.year, this.month - 1, i);
                currentDate.setHours(0, 0, 0, 0);
                const isDisabled = currentDate > today;
    
                this.calendarDates.push({
                    value: i,
                    className: isDisabled ? "day-button disabled" : "day-button",
                    isEmpty: false,
                    isDisabled,
                    month: this.month,
                    year: this.year,
                    key: JSON.stringify([i, this.month, this.year])
                });
            }
            console.log("this.calnedarDates.length: ", this.calendarDates.length);
            const remainingDaysInRow = 42 - this.calendarDates.length; 
            const daysFromNextMonth = remainingDaysInRow > 7 ? remainingDaysInRow%7 : remainingDaysInRow; 
            for (let i = 1; i <= daysFromNextMonth; i++) {
                this.calendarDates.push({
                    value: i,
                    className: "day-button disabled",
                    isEmpty: true,
                    isDisabled: true,
                    month: nextMonth,
                    year: nextYear,
                    key: JSON.stringify([i, nextMonth, nextYear])
                });
            }
            setTimeout(() => {
                this.highlightSelectedDates();
            }, 0);
    
        } catch (error) {
            console.error('Error in populateCalendar:', error);
        }
    }
    
    highlightSelectedDates() {
        try {
            if (this.startDate && this.startDate.month === this.month && this.startDate.year === this.year) {
                const startDay = this.template.querySelector(
                    `[data-day="${this.startDate.day}"][data-month="${this.startDate.month}"][data-year="${this.startDate.year}"]`
                );
                startDay?.classList.add('selected', 'startborder');
            }
            if (this.endDate && this.endDate.month === this.month && this.endDate.year === this.year) {
                const endDay = this.template.querySelector(
                    `[data-day="${this.endDate.day}"][data-month="${this.endDate.month}"][data-year="${this.endDate.year}"]`
                );
                endDay?.classList.add('selected', 'endborder');
            }
            if (this.startDate && this.endDate) {
                this.calendarDates.forEach(day => {
                    if (
                        day.value &&
                        !day.isDisabled &&
                        this.isWithinRange(
                            { day: day.value, month: this.month, year: this.year },
                            this.startDate,
                            this.endDate
                        )
                    ) {
                        const dayElement = this.template.querySelector(
                            `[data-day="${day.value}"][data-month="${this.month}"][data-year="${this.year}"]`
                        );
                        dayElement?.classList.add('in-range');
                    }
                });
            }
            if (
                this.startDate &&
                this.endDate &&
                this.startDate.day === this.endDate.day &&
                this.startDate.month === this.endDate.month &&
                this.startDate.year === this.endDate.year
            ) {
                const dayElement = this.template.querySelector(
                    `[data-day="${this.startDate.day}"][data-month="${this.startDate.month}"][data-year="${this.startDate.year}"]`
                );
                dayElement?.classList.add('singleborder', 'selected');
            }
    
        } catch (error) {
            console.error('Error in highlightSelectedDates:', error);
        }
    }
    
    isWithinRange(date, startDate, endDate) {
        const d1 = new Date(startDate.year, startDate.month - 1, startDate.day);
        const d2 = new Date(endDate.year, endDate.month - 1, endDate.day);
        const d = new Date(date.year, date.month - 1, date.day);
        return d >= d1 && d <= d2;
    }

    handleInsideClick(event) {
        event.stopPropagation();
    }
}