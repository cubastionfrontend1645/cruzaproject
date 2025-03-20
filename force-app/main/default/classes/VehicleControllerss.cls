public with sharing class VehicleControllerss {
    private static List<Vehicle> vehicles = new List<Vehicle>();

    // Initialize the vehicle list with sample data
    static {
        for (Integer i = 1; i <= 115; i++) {
            vehicles.add(new Vehicle(
                'Vehicle ' + i,
                'Model ' + i,
                String.valueOf(2000 + Math.mod(i, 21)),  // Convert Integer to String for Year
                'Color ' + i,
                20000 + (i * 1000)
            ));
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Vehicle> getVehicles(Integer pageNumber) {
        Integer recordsPerPage = 10;
        Integer offset = (pageNumber - 1) * recordsPerPage;

        List<Vehicle> pagedVehicles = new List<Vehicle>();
        Integer endIdx = offset + recordsPerPage;

        for (Integer i = offset; i < endIdx && i < vehicles.size(); i++) {
            pagedVehicles.add(vehicles[i]);
        }
        return pagedVehicles;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getVehicleCount() {
        return vehicles.size();
    }

    public class Vehicle {
        @AuraEnabled public String Name { get; set; }
        @AuraEnabled public String Model { get; set; }
        @AuraEnabled public String Year { get; set; }
        @AuraEnabled public String Color { get; set; }
        @AuraEnabled public Decimal Price { get; set; }

        public Vehicle(String name, String model, String year, String color, Decimal price) {
            this.Name = name;
            this.Model = model;
            this.Year = year;
            this.Color = color;
            this.Price = price;
        }
    }
}