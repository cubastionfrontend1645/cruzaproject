public with sharing class VehicleManager {
    @AuraEnabled(cacheable=true)
    public static List<Vehicle__c> getAllVehicles() {
        return [
            SELECT 
                Id,
                Name,                // Standard Salesforce Name field
                Name__c,             // Custom Name field? (confirm which you want)
                Reg_No__c,
                Chassis_No__c,
                Date_of_Registration__c,
                Date_of_Shaken_Expiry__c,
                Weight_kg__c,
                Type__c,
                Use__c,
                Mileage__c
            FROM Vehicle__c
        ];
    }
}