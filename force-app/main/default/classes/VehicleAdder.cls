public with sharing class VehicleAdder {
    public static void addVehicles() {
        List<Vehicle__c> vehicles = new List<Vehicle__c>();

        for (Integer i = 1; i <= 115; i++) {
            Vehicle__c vehicle = new Vehicle__c();
            vehicle.Name = 'Vehicle ' + i;
            vehicle.Model__c = 'Model ' + i;
            vehicle.Year__c = String.valueOf(2000 + Math.mod(i, 21));
            vehicle.Color__c = 'Color ' + i;
            vehicle.Price__c = 20000 + (i * 1000);
            vehicles.add(vehicle);
        }

        try {
            insert vehicles;
            System.debug('Successfully inserted ' + vehicles.size() + ' vehicle records.');
        } catch (DmlException e) {
            System.debug('An error occurred while inserting vehicle records: ' + e.getMessage());
        }
    }
}