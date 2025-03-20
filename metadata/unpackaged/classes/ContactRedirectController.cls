public class ContactRedirectController {
    public String accountId { get; private set; }
    
    public ContactRedirectController() {
        // Get the Contact ID from the URL parameter
        String contactId = ApexPages.currentPage().getParameters().get('id');
        
        if (String.isNotBlank(contactId)) {
            Contact con = [SELECT AccountId FROM Contact WHERE Id = :contactId LIMIT 1];
            if (con != null) {
                accountId = con.AccountId;
            }
        }
    }
}