import { api, LightningElement, track } from 'lwc';
import getContact from '@salesforce/apex/UserProfileController.getContact';
import setContact from '@salesforce/apex/UserProfileController.setContact';
import USER_ID from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import shadowimg from '@salesforce/resourceUrl/shadowimg';

export default class Cr_basicInfo extends LightningElement {
    shadowimage = shadowimg; // Placeholder image URL
    isModalOpen = false; // Controls modal visibility
    editBasicInfo = false; // Toggles between view and edit modes
    @api userId = USER_ID; // Current user's ID
    contacts; // Stores contact records fetched from Apex
    error; // Stores any errors during data fetching
    actionModal = ''; // Action to be performed in modal

    // Tracks the basic information displayed or edited
    @track basicInfo = [
        { id: 1, label: 'First Name', value: '' },
        { id: 2, label: 'Last Name', value: '' },
        { id: 3, label: 'Email', value: '' },
        { id: 4, label: 'Phone', value: '' },
        { id: 5, label: 'Address', value: '' },
        { id: 6, label: 'Country', value: '' },
        { id: 7, label: 'State', value: '' },
        { id: 8, label: 'City', value: '' },
        { id: 9, label: 'Zip', value: '' }
    ];

    // Fetch contacts from Apex on component initialization
    connectedCallback() {
        this.fetchContacts();
    }

    // Fetch contacts from Apex
    fetchContacts() {
        getContact({ userId: this.userId })
            .then((data) => {
                this.contacts = data || [];
                console.log("Data coming From Backend: ", JSON.stringify(this.contacts));
                this.error = undefined;
                if (this.contacts.length > 0) {
                    this.updateBasicInfo(this.contacts[0]); // Use the first contact
                }
            })
            .catch((error) => {
                this.error = error;
                this.contacts = [];
                console.error('Error fetching contacts:', error);
            });
    }

    // Update `basicInfo` fields with fetched contact data
    updateBasicInfo(contact) {
        this.basicInfo = [
            { id: 1, label: 'First Name', value: contact.FirstName || '-' },
            { id: 2, label: 'Last Name', value: contact.LastName || '-' },
            { id: 3, label: 'Email', value: contact.Email || '-' },
            { id: 4, label: 'Phone', value: contact.Phone || '-' },
            { id: 5, label: 'Address', value: ` ${contact.City__c || ''}, ${contact.State__c || ''}, ${contact.PostalCode__c || ''}, ${contact.Country__c || ''}` },
            { id: 6, label: 'Country', value: contact.Country__c || '-' },
            { id: 7, label: 'State', value: contact.State__c || '-' },
            { id: 8, label: 'City', value: contact.City__c || '-' },
            { id: 9, label: 'Zip', value: contact.PostalCode__c || '-' }
        ];
    }

    // Handle input changes in edit mode
    handleInputChange(event) {
        const fieldId = parseInt(event.target.dataset.id, 10); // Get field ID
        const updatedValue = event.target.value; // Get updated value

        // Update the corresponding field in `basicInfo`
        this.basicInfo = this.basicInfo.map((field) =>
            field.id === fieldId ? { ...field, value: updatedValue } : field
        );
    }

    // Open modal with specified action
    openModal(action) {
        this.isModalOpen = true;
        this.actionModal = action;
    }

    // Close modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle modal "Yes" confirmation
    handleYes(event) {
        const action = event.target.dataset.name;

        if (action === 'edit basic info') {
            this.editBasicInfo = true;
        } else if (action === 'save basic info') {
            this.saveContactInfo();
            this.editBasicInfo = false;
        }

        this.closeModal();
    }

    // Handle "No" action in modal
    handleNo() {
        this.closeModal();
    }

    // Save updated contact information
    saveContactInfo() {
        const contactData = {
            userId: this.userId,
            firstName: this.basicInfo.find((field) => field.label === 'First Name').value == "-" ? "" : this.basicInfo.find((field) => field.label === 'First Name').value,
            lastName: this.basicInfo.find((field) => field.label === 'Last Name').value == "-" ? "" : this.basicInfo.find((field) => field.label === 'Last Name').value,
            email: this.basicInfo.find((field) => field.label === 'Email').value == "-" ? "" : this.basicInfo.find((field) => field.label === 'Email').value,
            phone: this.basicInfo.find((field) => field.label === 'Phone').value =="-" ? "" : this.basicInfo.find((field) => field.label === 'Phone').value,
            country: this.basicInfo.find((field) => field.label === 'Country').value == "-" ? "" : this.basicInfo.find((field) => field.label === 'Country').value,
            postalCode: this.basicInfo.find((field) => field.label === 'Zip').value == "-" ? "" : this.basicInfo.find((field) => field.label === 'Zip').value,
            state: this.basicInfo.find((field) => field.label === 'State').value =="-" ? "" : this.basicInfo.find((field) => field.label === 'State').value,
            city: this.basicInfo.find((field) => field.label === 'City').value == "-" ? "" : this.basicInfo.find((field) => field.label === 'City').value
        };
        console.log("Data to Save: ", JSON.stringify(contactData));

        const jsonContactData = JSON.stringify(contactData);
        
    
        setContact({jsonContactData})
            .then(() => {
                console.log('Contact information saved successfully');
                return refreshApex(this.contacts); // Refresh the wired Apex data
            })
            .catch((error) => {
                console.error('Error saving contact information:', error);
                this.error = 'An error occurred while saving the contact. Please try again later.'; // Show user-friendly error message
            });
    }
    

    // Button actions
    gotohome() {
        // Navigate to Home
        window.location.href = '/';
    }

    handleeditbasic() {
        this.openModal('edit basic info');
    }

    handlesavebasic() {
        this.openModal('save basic info');
    }

    gotobasic() {
        this.editBasicInfo = false;
    }
}