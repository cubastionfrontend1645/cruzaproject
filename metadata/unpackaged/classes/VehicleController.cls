public with sharing class VehicleController {
    @AuraEnabled(cacheable=true)
    public static List<Vehicle__c> getVehicles() {
        try {
            return [SELECT Vehicle_Id__c, Model_Number__c, Car_Name__c, Mileage__c, Expiration_Date__c, Next_Maintainance_Date__c FROM Vehicle__c];
        } catch (Exception e) {
            System.debug('Error fetching vehicle records: ' + e.getMessage());
            return new List<Vehicle__c>();
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static Vehicle__c getVehicleById(Id vehicleId) {
        try {
            return [SELECT Vehicle_Id__c, Model_Number__c, Car_Name__c, Mileage__c, Expiration_Date__c, Next_Maintainance_Date__c FROM Vehicle__c WHERE Id = :VehicleId LIMIT 1];
        } catch (Exception e) {
            System.debug('Error fetching vehicle record: ' + e.getMessage());
            return null;
        }
    }
}