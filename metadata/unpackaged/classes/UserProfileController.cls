public with sharing class UserProfileController {

    @AuraEnabled(cacheable=true)
    public static void setContact(String jsonContactData) {
        try {
            // Deserialize JSON into a Map<String, Object>
            Map<String, Object> contactData = (Map<String, Object>) JSON.deserializeUntyped(jsonContactData);

            // Extract values
            String userId = (String) contactData.get('userId');
            if (String.isBlank(userId)) {
                throw new AuraHandledException('Invalid contact data or userId is missing.');
            }

            // Query for existing Contact
            List<Contact> existingContacts = [
                SELECT Id, LastName, FirstName, Email, Phone, Country__c, PostalCode__c, State__c, City__c
                FROM Contact
                WHERE User__c = :userId
                LIMIT 1
            ];
            
            Contact contactRecord;
            if (!existingContacts.isEmpty()) {
                contactRecord = existingContacts[0]; // Update existing
            } else {
                contactRecord = new Contact(User__c = userId); // Create new
            }

            // Assign values
            contactRecord.LastName = (String) contactData.get('lastName');
            contactRecord.FirstName = (String) contactData.get('firstName');
            contactRecord.Email = (String) contactData.get('email');
            contactRecord.Phone = (String) contactData.get('phone');
            contactRecord.Country__c = (String) contactData.get('country');
            contactRecord.PostalCode__c = (String) contactData.get('postalCode');
            contactRecord.State__c = (String) contactData.get('state');
            contactRecord.City__c = (String) contactData.get('city');

            // Perform DML operation
            upsert contactRecord;

        } catch (DmlException dmlEx) {
            System.debug('DML Exception: ' + dmlEx.getMessage());
            throw new AuraHandledException('An error occurred while saving the contact: ' + dmlEx.getMessage());
        } catch (Exception ex) {
            System.debug('Unexpected Exception: ' + ex.getMessage());
            throw new AuraHandledException('An unexpected error occurred: ' + ex.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContact(String userId) {
        try {
            if (String.isBlank(userId)) {
                throw new AuraHandledException('Invalid userId.');
            }

            // Get the User record
            List<User> users = [SELECT LastName FROM User WHERE Id = :userId LIMIT 1];
            if (users.isEmpty()) {
                throw new AuraHandledException('User not found.');
            }
            
            String userLastName = users[0].LastName;

            // Fetch contacts based on last name
            List<Contact> contacts = [
                SELECT FirstName, LastName, Email, Phone, Country__c, PostalCode__c, State__c, City__c
                FROM Contact 
                WHERE LastName = :userLastName
            ];
            
            System.debug('Contacts Retrieved: ' + contacts);
            return contacts;

        } catch (QueryException queryEx) {
            System.debug('Query Exception: ' + queryEx.getMessage());
            throw new AuraHandledException('An error occurred while retrieving the contacts: ' + queryEx.getMessage());
        } catch (Exception ex) {
            System.debug('Unexpected Exception: ' + ex.getMessage());
            throw new AuraHandledException('An unexpected error occurred: ' + ex.getMessage());
        }
    }
}