public with sharing class VehicleController {
    
    public static List<Map<String, String>> getVehicles() {
        List<Map<String, String>> vehicles = new List<Map<String, String>>();
        
        vehicles.add(new Map<String, String>{'Id' => '1', 'Name' => 'Toyota Camry'});
        vehicles.add(new Map<String, String>{'Id' => '2', 'Name' => 'Honda Accord'});
        vehicles.add(new Map<String, String>{'Id' => '3', 'Name' => 'Ford Mustang'});
        vehicles.add(new Map<String, String>{'Id' => '4', 'Name' => 'Chevrolet Camaro'});
        vehicles.add(new Map<String, String>{'Id' => '5', 'Name' => 'Nissan Altima'});
        vehicles.add(new Map<String, String>{'Id' => '6', 'Name' => 'BMW 3 Series'});
        vehicles.add(new Map<String, String>{'Id' => '7', 'Name' => 'Audi A4'});
        vehicles.add(new Map<String, String>{'Id' => '8', 'Name' => 'Mercedes-Benz C-Class'});
        vehicles.add(new Map<String, String>{'Id' => '9', 'Name' => 'Tesla Model 3'});
        vehicles.add(new Map<String, String>{'Id' => '10', 'Name' => 'Hyundai Elantra'});

        return vehicles;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getVehicleCount() {
        return [SELECT COUNT() FROM Vehicle__c];
    }

    @AuraEnabled
    public static void addVehicles() {
        List<Vehicle__c> vehicles = new List<Vehicle__c>();
        for (Integer i = 1; i <= 115; i++) {
            vehicles.add(new Vehicle__c(
                Name = 'Vehicle ' + i,
                Model__c = 'Model ' + i,
                Year__c = String.valueOf(2000 + Math.mod(i, 21)), // Convert Integer to String
                Color__c = 'Color ' + i,
                Price__c = 20000 + (i * 1000),
                isBilling__c = false
            ));
        }
        insert vehicles;
    }

    @AuraEnabled
    public static void updateVehicleBookmark(Id vehicleId, Boolean isBilling) {
        Vehicle__c vehicle = [SELECT Id, isBilling__c FROM Vehicle__c WHERE Id = :vehicleId LIMIT 1];
        vehicle.isBilling__c = isBilling;
        update vehicle;
    }
}