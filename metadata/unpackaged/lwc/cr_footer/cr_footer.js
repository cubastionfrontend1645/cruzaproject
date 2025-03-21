import { LightningElement } from 'lwc';
import userId from '@salesforce/user/Id';

export default class Cr_footer extends LightningElement {
    isGuestUser = true;
    
    connectedCallback() {
        if (userId) {
            this.isGuestUser = false;
        }}
}