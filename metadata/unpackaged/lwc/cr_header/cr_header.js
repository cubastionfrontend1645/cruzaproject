import { LightningElement, track } from 'lwc';
import cruza_header_logo from '@salesforce/resourceUrl/cruza_header_logo';

export default class Cr_header extends LightningElement {
    cruza_header_logo = cruza_header_logo;
    loginText = "Login";
    @track loginBox = false;

    connectedCallback() {
        document.addEventListener('click', this.handleOutsideClick);
        this.highlightCurrentPage();
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleOutsideClick);
    }

    highlightCurrentPage() {
        const path = window.location.pathname;
        console.log("Current Page Path:", path);

        const pageClasses = {
            "/": 'a',
            "/vehicle": 'b',
            "/invoice": 'c',
            "/dtfsa": 'd',
            "/basicinfo": 'e',
            "/user": 'f',
            "/branch": 'g',
            "/logout": 'h'
        };

        const targetClass = pageClasses[path];
        setTimeout(() => {
            const element = this.template.querySelector(`.${targetClass}`);
            if (element) element.classList.add('down-underline');
        }, 0);
    }


    showLoginBox(event) {
        event.stopPropagation();
        this.loginBox = !this.loginBox;
    }

    closeLoginBox() {
        this.loginBox = false;
    }

    handleOutsideClick = (event) => {
        const loginBoxElement = this.template.querySelector('[data-id="loginBox"]');
        const loginIconElement = this.template.querySelector('.login-svg');
        
        if (this.loginBox && loginBoxElement && !loginBoxElement.contains(event.target) && 
            loginIconElement && !loginIconElement.contains(event.target)) {
            this.closeLoginBox();
        }
    };

    handleVehicle() {
        window.location.href = '/vehicle';
    }
    handleHome() {
        window.location.href = '/';
    }
    handleInvoice() {
        window.location.href = '/invoice';
    }
    handleDtfsa() {
        window.location.href = '/dtfsa';
    }
    handleBasicInfo() {
        window.location.href = '/basicinfo';
    }
    handleUser() {
        window.location.href = '/user';
    }
    handleBranch() {
        window.location.href = "branch";
    }
    handleLogin() {
        if (this.loginText == "Login") {
            window.location.href = '/logout';
        } 
    }
}