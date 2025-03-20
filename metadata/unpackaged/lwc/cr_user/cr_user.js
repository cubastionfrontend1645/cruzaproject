import { LightningElement, track } from 'lwc';
import getPaginatedUsers from '@salesforce/apex/UserController.getPaginatedUsers';
import getTotalUserCount from '@salesforce/apex/UserController.getTotalUserCount';

export default class Cr_user extends LightningElement {
    actionModal = "";
    isModalOpen = false;
    @track userlist = [];
    @track currentPage = 1;
    @track totalPages = 1;
    @track paginationButtons = [];
    usersPerPage = 5;

    connectedCallback() {
        this.fetchTotalPages();
        this.fetchPaginatedUsers();
        console.log("User List in ConnectedCallback: ", JSON.stringify(this.userlist));
    }
 
    async fetchTotalPages() {
        try {
            const totalUserCount = await getTotalUserCount();
            this.totalPages = Math.ceil(totalUserCount / this.usersPerPage);
            this.updatePaginationButtons();
        } catch (error) {
            console.error('Error fetching total user count:', error);
        }
    }

    async fetchPaginatedUsers() {
        try {
            const users = await getPaginatedUsers({ pageNumber: this.currentPage, pageSize: this.usersPerPage });
            this.userlist = users;
        } catch (error) {
            console.error('Error fetching paginated users:', error);
        }
    }

    updatePaginationButtons() {
        this.paginationButtons = [];
        for (let i = 1; i <= this.totalPages; i++) {
            this.paginationButtons.push({
                number: i,
                label: i,
                className: i === this.currentPage ? 'pagination-button pagination-button-selected' : 'pagination-button',
            });
        }
    }

    gotohome() {
        this.actionModal = "go to Home?";
        this.isModalOpen = true;
    }

    handleadduser() {
        this.actionModal = "add user?";
        this.isModalOpen = true;
    }

    handleno() {
        this.isModalOpen = false;
    }

    handleyes() {
        this.isModalOpen = false;
    }

    get disablePrev() {
        return this.currentPage === 1;
    }

    get disableNext() {
        return this.currentPage === this.totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.fetchPaginatedUsers();
            this.updatePaginationButtons();
            
        console.log("User List in Previous Page: ", JSON.stringify(this.userlist));
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
            this.fetchPaginatedUsers();
            this.updatePaginationButtons();

            
        console.log("User List in Next Page: ", JSON.stringify(this.userlist));
        }
    }

    handlePageClick(event) {
        const selectedPage = parseInt(event.target.dataset.page, 10);
        if (selectedPage !== this.currentPage) {
            this.currentPage = selectedPage;
            this.fetchPaginatedUsers();
            this.updatePaginationButtons();
        }
    }
}