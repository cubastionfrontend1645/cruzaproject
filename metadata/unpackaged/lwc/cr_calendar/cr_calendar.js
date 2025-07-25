import { LightningElement, track, wire } from 'lwc';
// Uncomment and use your Apex method in real situation
import getAllVehicles from '@salesforce/apex/VehicleManager.getAllVehicles';

const DUMMY_VEHICLES = [
    {
        Id: '1',
        Name__c: 'Truck Alpha',
        Reg_No__c: 'MH12AB1234',
        Chassis_No__c: 'CHS123456',
        Date_of_Registration__c: '2019-01-25',
        Weight_kg__c: 8300,
        Type__c: '1',
        Use__c: 'LDT'
    },
    {
        Id: '2',
        Name__c: 'Van Beta',
        Reg_No__c: 'DL09ZY7890',
        Chassis_No__c: 'CHS654321',
        Date_of_Registration__c: '2020-05-15',
        Weight_kg__c: 7000,
        Type__c: '2',
        Use__c: 'MDTPrivate'
    }
];

// UTILITIES

function getShakenTenkenIntervals({ Weight_kg__c: weight, Type__c: type, Use__c: use }) {
    weight = Number(weight);
    type = (type && String(type).toUpperCase()) || "";
    use = (use && String(use).toUpperCase()) || "";
    let shaken, tenken;

    if (weight >= 8000) {
        shaken = 12; tenken = 3;
    } else if (type === '1' && use === 'LDT') {
        shaken = 24; tenken = 12;
    } else if (type === '1' && (use.includes('MDT') || use.includes('HDT'))) {
        shaken = 24; tenken = 3; // 1st Shaken at 24 months, then every 12? Expand as needed.
    } else if (type === '2' && use.includes('PRIVATE')) {
        shaken = 23; tenken = 6;
    } else {
        shaken = 12; tenken = 6; // fallback
    }
    return { shakenInterval: shaken, tenkenInterval: tenken };
}

function getMaintenanceMonths({ startDate, shakenInterval, tenkenInterval, calendarYear }) {
    if (!startDate) return Array(12).fill().map((_, i) => ({ monthIdx: i, shaken: false, tenken: false }));
    // Shaken: Repeat every shakenInterval months from reg date
    let shakenMonths = [];
    let tenkenMonths = [];
    let start = new Date(startDate);
    let regYear = start.getFullYear();

    // Calc all shaken months in this year
    let d = new Date(start);
    while (d.getFullYear() <= calendarYear) {
        if (d.getFullYear() === calendarYear) {
            shakenMonths.push(d.getMonth());
        }
        d.setMonth(d.getMonth() + shakenInterval);
    }
    // Calc tenken months
    d = new Date(start);
    while (d.getFullYear() <= calendarYear) {
        if (d.getFullYear() === calendarYear) {
            tenkenMonths.push(d.getMonth());
        }
        d.setMonth(d.getMonth() + tenkenInterval);
    }
    // Map results, giving Shaken priority
    const months = [];
    for (let i = 0; i < 12; i++) {
        months.push({
            monthIdx: i,
            label: new Date(calendarYear, i, 1).toLocaleString('default', { month: 'long' }),
            shaken: shakenMonths.includes(i),
            tenken: tenkenMonths.includes(i) && !shakenMonths.includes(i)
        });
    }
    return months;
}


// LWC CLASS

export default class Cr_Calendar extends LightningElement {
    @track vehicles = DUMMY_VEHICLES; // Use wire(getAllVehicles) for real
    @track vehicleIndex = 0;
    @track calendarYear = new Date().getFullYear();

    // Uncomment to use Apex for real vehicles
    @wire(getAllVehicles)
    wiredVehicles({ error, data }) {
        if (data) {
            this.vehicles = data;
        }
    }

    get selectedVehicle() {
        return this.vehicles[this.vehicleIndex] || {};
    }

    get months() {
        let monthsArray = [];
        for (let i = 0; i < 12; i++) {
            monthsArray.push({
                value: i,
                label: new Date(this.calendarYear, i, 1).toLocaleString('default', { month: 'long' })
            });
        }
        return monthsArray;
    }

    // Key getter for the maintenance calendar
    get maintenanceDisplayMonths() {
        if (!this.selectedVehicle || !this.selectedVehicle.Date_of_Registration__c)
            return this.months.map((m, i) => ({ monthIdx: i, label: m.label, shaken: false, tenken: false }));
        const { shakenInterval, tenkenInterval } = getShakenTenkenIntervals(this.selectedVehicle);
        return getMaintenanceMonths({
            startDate: this.selectedVehicle.Date_of_Registration__c,
            shakenInterval,
            tenkenInterval,
            calendarYear: this.calendarYear
        });
    }

    prevVehicle() {
        if (this.vehicleIndex > 0) this.vehicleIndex--;
        else this.vehicleIndex = this.vehicles.length - 1;
    }
    nextVehicle() {
        if (this.vehicleIndex < this.vehicles.length - 1) this.vehicleIndex++;
        else this.vehicleIndex = 0;
    }
    prevYear() {
        this.calendarYear--;
    }
    nextYear() {
        this.calendarYear++;
    }
}