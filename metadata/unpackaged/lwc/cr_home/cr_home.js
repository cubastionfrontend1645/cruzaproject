import { LightningElement } from 'lwc';
import truck_home from '@salesforce/resourceUrl/truck_home';
import cruza_shop from '@salesforce/resourceUrl/cruza_shop';
import cruza_invoice from '@salesforce/resourceUrl/cruza_invoice';
export default class Cr_home extends LightningElement {
    truck_home = truck_home;
    cruza_shop = cruza_shop;
    cruza_invoice = cruza_invoice;

    val = '';

    handleChange(event) {
        this.val = event.target.value;
    }

    handleClick() {
        // Replace with your desired URL
        const baseUrl = 'https://cubastionconsultingprivate6-dev-ed.develop.my.site.com/bikemanager/s/';
        const param = encodeURIComponent(this.val);
        const fullUrl = `${baseUrl}?value=${param}`;

        window.open(fullUrl, '_blank'); // Opens in a new tab
        // Or use: window.location.href = fullUrl; to open in same tab
    }
}