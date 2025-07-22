import { LightningElement } from 'lwc';
import truck_home from '@salesforce/resourceUrl/truck_home';
import cruza_shop from '@salesforce/resourceUrl/cruza_shop';
import cruza_invoice from '@salesforce/resourceUrl/cruza_invoice';
export default class Cr_home extends LightningElement {
    truck_home = truck_home;
    cruza_shop = cruza_shop;
    cruza_invoice = cruza_invoice;
}