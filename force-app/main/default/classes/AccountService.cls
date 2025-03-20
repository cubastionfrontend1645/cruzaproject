public with sharing class AccountService {
    @AuraEnabled(cacheable=true)
    public static Boolean isAccountExist(String phoneNumber) {
        List<Account> accounts = [SELECT Id FROM Account WHERE Phone = :phoneNumber LIMIT 1];
        return !accounts.isEmpty();
    }
}