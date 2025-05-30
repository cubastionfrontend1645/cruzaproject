import { api, LightningElement } from 'lwc';

export default class Cruza_home extends LightningElement {

    @api recordId;
    connectedCallback() {
        console.log("Current record Id: " + this.recordId);
    }
    renderedCallback() {
        console.log("rendered record id: ", this.recorId);
    }
}