public with sharing class VehicleControllers {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getVehicles() {
        List<Map<String, Object>> vehicles = new List<Map<String, Object>>();
        for (Integer i = 1; i <= 50; i++) {
            Map<String, Object> vehicle = new Map<String, Object>();
            vehicle.put('Id', 'v' + i);
            vehicle.put('Name', 'Vehicle ' + i);
            vehicle.put('Model', 'Model ' + i);
            vehicle.put('Year', 2020 + i);
            vehicle.put('Price', 20000 + (i * 1000));
            vehicles.add(vehicle);
        }
        return vehicles;
    }
}