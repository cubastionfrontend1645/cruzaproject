public with sharing class UserProfileController {

    @AuraEnabled(cacheable=true)
    public static void setContact(String jsonContactData) {
        try {
            // Parse the JSON string
            Map<String, String> contactData = parseJson(jsonContactData);

            // Validate permissions
            validatePermissions();

            // Retrieve existing Contact
            Contact existingContact = getExistingContact(contactData.get('userId'));

            // Save or update Contact
            saveOrUpdateContact(existingContact, contactData);
        } catch (DmlException dmlEx) {
            throw new AuraHandledException('Error saving contact: ' + dmlEx.getMessage());
        } catch (Exception ex) {
            throw new AuraHandledException('Unexpected error: ' + ex.getMessage());
        }
    }

    // 🔹 JSON Parsing
    private static Map<String, String> parseJson(String jsonContactData) {
        Map<String, String> contactData = (Map<String, String>) JSON.deserializeUntyped(jsonContactData);
        return contactData;
    }

    // 🔹 Validate CRUD Permissions
    private static void validatePermissions() {
        if (!Schema.sObjectType.Contact.isAccessible() || !Schema.sObjectType.Contact.isCreateable() || !Schema.sObjectType.Contact.isUpdateable()) {
            throw new AuraHandledException('Insufficient permissions to read, create or update Contacts.');
        }
    }

    // 🔹 Retrieve Existing Contact
    private static Contact getExistingContact(String userId) {
        if (String.isBlank(userId)) {
            throw new AuraHandledException('UserId is required.');
        }

        return [
            SELECT Id, LastName, FirstName, Email, Phone, Country__c, PostalCode__c, State__c, City__c
            FROM Contact
            WHERE User__c = :userId
            LIMIT 1
        ];
    }

    // 🔹 Save or Update Contact
    private static void saveOrUpdateContact(Contact existingContact, Map<String, String> contactData) {
        Contact contactToSave = existingContact != null ? existingContact : new Contact(User__c = contactData.get('userId'));

        contactToSave.LastName = contactData.get('lastName');
        contactToSave.FirstName = contactData.get('firstName');
        contactToSave.Email = contactData.get('email');
        contactToSave.Phone = contactData.get('phone');
        contactToSave.Country__c = contactData.get('country');
        contactToSave.PostalCode__c = contactData.get('postalCode');
        contactToSave.State__c = contactData.get('state');
        contactToSave.City__c = contactData.get('city');

        upsert contactToSave;
    }
}