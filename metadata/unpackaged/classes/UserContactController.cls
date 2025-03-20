public with sharing class UserContactController {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getUserContactAndAccountInfo(String user_id) {
        List<User> users = [
            SELECT Id, Username, LastName, FirstName, Name, CompanyName, Division, Department, Email, City,
                   Contact.FirstName, Contact.LastName, Contact.Email, Contact.Phone, Contact.Account.Name, Contact.Account.Id
            FROM User 
            WHERE Id = :user_id
        ];

        if (users.isEmpty()) {
            return new Map<String, Object>();
        }

        User user = users[0];

        Contact contact = user.Contact; 
        Account account = contact != null ? contact.Account : null; 
        Map<String, Object> results = new Map<String, Object>();
        results.put('user', user);
        results.put('contact', contact);
        results.put('account', account);
        
        System.debug('Result: ' + results);
        return results;
    }
}