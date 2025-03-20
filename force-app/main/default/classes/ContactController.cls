public class ContactController {
    @auraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        //  return [
        //     SELECT FirstName, LastName, Email
        //     FROM Contact
        // ];
        throw new AuraHandledException('Forced error');
    }
}