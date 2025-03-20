public with sharing class VehicleService {
    @AuraEnabled(cacheable=true)
    public static List<Vehicle> getVehicles() {
        List<Vehicle> vehicles = new List<Vehicle>();
        vehicles.add(new Vehicle('1', 'Toyota Camry'));
        vehicles.add(new Vehicle('2', 'Honda Accord'));
        vehicles.add(new Vehicle('3', 'Ford Mustang'));
        vehicles.add(new Vehicle('4', 'Chevrolet Camaro'));
        vehicles.add(new Vehicle('5', 'Nissan Altima'));
        vehicles.add(new Vehicle('6', 'BMW 3 Series'));
        vehicles.add(new Vehicle('7', 'Audi A4'));
        vehicles.add(new Vehicle('8', 'Mercedes-Benz C-Class'));
        vehicles.add(new Vehicle('9', 'Tesla Model 3'));
        vehicles.add(new Vehicle('10', 'Hyundai Elantra'));
        return vehicles;
    }

    public class Vehicle {
        @AuraEnabled
        public String Id { get; set; }
        @AuraEnabled
        public String Name { get; set; }
        
        public Vehicle(String id, String name) {
            this.Id = id;
            this.Name = name;
        }
    }
}