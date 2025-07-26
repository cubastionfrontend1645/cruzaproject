import { LightningElement, track, wire } from 'lwc';
import getAllVehicles from '@salesforce/apex/VehicleManager.getAllVehicles';
const PAGE_SIZE = 5;
export default class Cr_vehicle extends LightningElement {

    @track currentPage = 1;
    @track isModalOpen = false;
    vehicleList = [];
    selectedVehicle = {
        Reg_No__c: '',
        Chassis_No__c: '',
        Date_of_Registration__c: '',
        Date_of_Shaken_Expiry__c: '',
        Weight_kg__c: '',
        Type__c: '',
        Use__c: '',
        Mileage__c: ''
    };


    @wire(getAllVehicles)
    wiredVehicles({ error, data }) {
        if (data) {
            // Optionally add map/transform as needed
            console.log("Data of Vehicles: ", data);
            this.vehicleList = data;
            this.vehicleCount = this.vehicleList.length;
        } else if (error) {
            console.log(
                'Error retrieving vehicles: ',
                JSON.stringify(error));
        }
    }



    vehicleCount = this.vehicleList.length;
    // Computed property for paginated items
    get paginatedVehicles() {
        const startIndex = (this.currentPage - 1) * PAGE_SIZE;
        return this.vehicleList.slice(startIndex, startIndex + PAGE_SIZE);
    }

    get totalPages() {
        return Math.ceil(this.vehicleCount / PAGE_SIZE);

    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }

    handlePrev() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    handleCardClick(event) {
        let id = event.currentTarget.dataset.id;
        console.log(id);
        const vehicle = this.vehicleList.find(v => v.Id === id);
        console.log(vehicle);
        this.selectedVehicle = vehicle;
        console.log(this.selectedVehicle);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedVehicle = {};
    }
}