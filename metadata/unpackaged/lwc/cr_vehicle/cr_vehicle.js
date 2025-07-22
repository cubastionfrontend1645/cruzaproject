import { LightningElement, track } from 'lwc';

export default class RichTextCharacterLimit extends LightningElement {

    vehicleList = [
        {
            id: 1,
            name: "Toyota Camry 2019",
            color: "Red",
            price: "2,500,000",
            year: "2019",
            mileage: "10,000",
            location: "Bangalore"
        },
        {
            id: 2,
            name: "Honda City 2020",
            color: "White",
            price: "2,200,000",
            year: "2020",
            mileage: "8,500",
            location: "Chennai"
        },
        {
            id: 3,
            name: "Hyundai i20 2018",
            color: "Grey",
            price: "850,000",
            year: "2018",
            mileage: "24,000",
            location: "Mumbai"
        },
        {
            id: 4,
            name: "Maruti Suzuki Swift 2017",
            color: "Blue",
            price: "700,000",
            year: "2017",
            mileage: "32,500",
            location: "Pune"
        },
        {
            id: 5,
            name: "Ford EcoSport 2021",
            color: "Black",
            price: "1,190,000",
            year: "2021",
            mileage: "6,000",
            location: "Delhi"
        },
        {
            id: 6,
            name: "Mahindra XUV500 2016",
            color: "Silver",
            price: "1,600,000",
            year: "2016",
            mileage: "39,500",
            location: "Bangalore"
        },
        {
            id: 7,
            name: "Tata Nexon 2022",
            color: "Orange",
            price: "1,320,000",
            year: "2022",
            mileage: "2,400",
            location: "Hyderabad"
        },
        {
            id: 8,
            name: "Volkswagen Polo 2019",
            color: "White",
            price: "980,000",
            year: "2019",
            mileage: "11,000",
            location: "Kolkata"
        },
        {
            id: 9,
            name: "Renault Kwid 2020",
            color: "Green",
            price: "450,000",
            year: "2020",
            mileage: "14,000",
            location: "Ahmedabad"
        },
        {
            id: 10,
            name: "Kia Seltos 2021",
            color: "Maroon",
            price: "1,600,000",
            year: "2021",
            mileage: "4,100",
            location: "Coimbatore"
        },
        {
            id: 11,
            name: "MG Hector 2022",
            color: "Silver",
            price: "1,950,000",
            year: "2022",
            mileage: "1,750",
            location: "Jaipur"
        },
        {
            id: 12,
            name: "Hyundai Creta 2019",
            color: "Red",
            price: "1,420,000",
            year: "2019",
            mileage: "18,500",
            location: "Bhopal"
        },
        {
            id: 13,
            name: "Skoda Rapid 2017",
            color: "Blue",
            price: "1,100,000",
            year: "2017",
            mileage: "41,300",
            location: "Lucknow"
        },
        {
            id: 14,
            name: "Honda Amaze 2020",
            color: "Silver",
            price: "900,000",
            year: "2020",
            mileage: "9,800",
            location: "Surat"
        },
        {
            id: 15,
            name: "Maruti Suzuki Baleno 2018",
            color: "Grey",
            price: "870,000",
            year: "2018",
            mileage: "27,000",
            location: "Nagpur"
        },
        {
            id: 16,
            name: "Ford Figo 2019",
            color: "White",
            price: "725,000",
            year: "2019",
            mileage: "19,300",
            location: "Chandigarh"
        },
        {
            id: 17,
            name: "Tata Altroz 2021",
            color: "Gold",
            price: "1,050,000",
            year: "2021",
            mileage: "3,500",
            location: "Patna"
        },
        {
            id: 18,
            name: "Renault Duster 2016",
            color: "Brown",
            price: "1,280,000",
            year: "2016",
            mileage: "35,600",
            location: "Indore"
        },
        {
            id: 19,
            name: "Hyundai Verna 2018",
            color: "Black",
            price: "1,330,000",
            year: "2018",
            mileage: "21,200",
            location: "Guwahati"
        },
        {
            id: 20,
            name: "Maruti Suzuki Dzire 2019",
            color: "Silver",
            price: "830,000",
            year: "2019",
            mileage: "12,400",
            location: "Bhubaneswar"
        },
        {
            id: 21,
            name: "Kia Sonet 2022",
            color: "Red",
            price: "1,390,000",
            year: "2022",
            mileage: "2,800",
            location: "Mysuru"
        }
    ];
    vehicleCount = this.vehicleList.length;
}