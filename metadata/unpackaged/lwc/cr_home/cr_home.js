import { LightningElement, track } from 'lwc';
import truck_home from '@salesforce/resourceUrl/truck_home';
import cruza_shop from '@salesforce/resourceUrl/cruza_shop';
import cruza_invoice from '@salesforce/resourceUrl/cruza_invoice';
import userId from '@salesforce/user/Id';
import communityBasePath from '@salesforce/community/basePath';
import cruzaTop1 from '@salesforce/label/c.cruza_1';
import cruzaTop2 from '@salesforce/label/c.cruza_top2';
import cruzaTop3 from '@salesforce/label/c.cruza_top3';

export default class Cr_home extends LightningElement {
    truck_home = truck_home;
    cruza_shop = cruza_shop;
    cruza_invoice = cruza_invoice;
    isGuestUser = true;

    handleLoginRedirect() {
        window.location.href = communityBasePath + '/login'; // Redirects to login page
    }

    connectedCallback() {
        if (userId) {
            this.isGuestUser = false;
        }
        this.showSlides();
    }

    showSlides() {
        let slides = this.template.querySelectorAll('.mySlide');
        slides.forEach(slide => (slide.style.display = 'none'));

        this.slideIndex++;
        if (this.slideIndex > slides.length) this.slideIndex = 1;

        slides[this.slideIndex - 1].style.display = 'block';

        setTimeout(() => this.showSlides(), 2000); // Change image every 2 seconds
    }

    // slideshowComponent.js
    @track slideIndex = 1;
    @track slides = [
        { id: 1, src: cruzaTop1, caption: 'Cruza Top 1' },
        { id: 2, src: cruzaTop2, caption: 'Cruza Top 2' },
        { id: 3, src: cruzaTop3, caption: 'Cruza Top 3' }
    ];

    get totalSlides() {
        return this.slides.length;
    }

    showSlide(index) {
        const slides = this.template.querySelectorAll('.mySlide');
        slides.forEach(slide => (slide.style.display = 'none'));

        if (index > slides.length) {
            this.slideIndex = 1;
        } else if (index < 1) {
            this.slideIndex = slides.length;
        } else {
            this.slideIndex = index;
        }

        slides[this.slideIndex - 1].style.display = 'block';
    }

    handlePrev() {
        this.showSlide(this.slideIndex - 1);
    }

    handleNext() {
        this.showSlide(this.slideIndex + 1);
    }

    handleDotClick(event) {
        const index = parseInt(event.target.dataset.index, 10);
        this.showSlide(index);
    }
}