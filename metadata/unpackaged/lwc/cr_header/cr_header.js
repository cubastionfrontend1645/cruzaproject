import { LightningElement, track } from 'lwc';
import cruza_header_logo from '@salesforce/resourceUrl/cruza_header_logo';
import userId from '@salesforce/user/Id';

export default class Cr_header extends LightningElement {
    cruza_header_logo = cruza_header_logo;
    loginText = "Login";
    @track loginBox = false;
    isGuestUser = true;

    connectedCallback() {
        if (userId) {
            this.isGuestUser = false;
            this.loginText = "Logout";
        }
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
        // window.location.href = '/vehicle';
    }
    handleHome() {
        // window.location.href = '/';
    }
    handleInvoice() {
        // window.location.href = '/invoice';
    }
    handleDtfsa() {
        // window.location.href = '/dtfsa';
    }
    handleBasicInfo() {
        // window.location.href = '/basicinfo';
    }
    handleUser() {
        // window.location.href = '/user';
    }
    handleBranch() {
        // window.location.href = "branch";
    }

    logoutUser() {
        // Step 1: Logout from Salesforce and redirect correctly
        window.location.href = 'https://personalusage-dev-ed.develop.my.site.com/cruzacentral/secur/logout.jsp?retUrl=https://personalusage-dev-ed.develop.my.site.com/cruzacentral/s/';

        // Step 2: Logout from Microsoft Entra ID after a slight delay (increased to 3 seconds)
        setTimeout(() => {
            window.location.href = 'https://login.microsoftonline.com/ab6e770e-1c90-4d9f-9808-6d0fd951f84a/oauth2/v2.0/logout?post_logout_redirect_uri=https://personalusage-dev-ed.develop.my.site.com/cruzacentral/s/';
        }, 3000);  // Delay set to 3 seconds
    }



    handleLogin() {
        if (this.loginText == "Login") {
            console.log("Working 1", window.location.href);
            window.location.href = "login";
            this.isGuestUser = true;
        } else {
            console.log("Working 2", window.location.href);
            this.logoutUser();
        }
    }
}