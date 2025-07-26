import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import XLSX from '@salesforce/resourceUrl/xlsx';

export default class BookingSummary extends LightningElement {
    @track totalBookings = 0;
    @track reportDate = '';

    @track bookings = [
        { id: 'b1', name: 'Booking 001', status: 'Confirmed', date: '2025-07-10', customer: 'John Doe' },
        { id: 'b2', name: 'Booking 002', status: 'Pending', date: '2025-07-12', customer: 'Jane Smith' },
        { id: 'b3', name: 'Booking 003', status: 'Cancelled', date: '2025-07-15', customer: 'Alice Johnson' }
    ];

    @track services = [
        { id: 's1', name: 'Service A', price: 200, quantity: 2 },
        { id: 's2', name: 'Service B', price: 150, quantity: 1 },
        { id: 's3', name: 'Service C', price: 300, quantity: 3 }
    ];

    xlsxInitialized = false;

    connectedCallback() {
        this.totalBookings = this.bookings.length;
        this.reportDate = new Date().toLocaleDateString();
    }

    renderedCallback() {
        if (this.xlsxInitialized) {
            return;
        }
        this.xlsxInitialized = true;
        loadScript(this, XLSX)
            .then(() => {
                // Library loaded
                // console.log('SheetJS loaded');
            })
            .catch(error => {
                console.error('Error loading SheetJS: ', error);
            });
    }

    handleDownloadExcel() {
        if (!window.XLSX) {
            console.error('SheetJS library not loaded yet');
            return;
        }

        // Create a new workbook
        const wb = window.XLSX.utils.book_new();

        // ========== Header Sheet with summary info ==========
        const headerSheetData = [
            ['Booking Report'],
            ['Total Bookings', this.totalBookings],
            ['Report Date', this.reportDate]
        ];
        const wsHeader = window.XLSX.utils.aoa_to_sheet(headerSheetData);

        // Style the header title (A1)
        wsHeader['A1'].s = {
            font: { sz: 20, bold: true, color: { rgb: '1F4E78' } }
        };
        // Add some space after header
        wsHeader['A4'] = { t: 's', v: '' };

        window.XLSX.utils.book_append_sheet(wb, wsHeader, 'Summary');

        // ========== Bookings Sheet ==========
        // Prepare bookings data with header row:
        const bookingsData = [
            ['Name', 'Status', 'Date', 'Customer'],
            ...this.bookings.map(b => [b.name, b.status, b.date, b.customer])
        ];

        const wsBookings = window.XLSX.utils.aoa_to_sheet(bookingsData);

        // Apply header style
        for (let col = 0; col < 4; col++) {
            const cellRef = window.XLSX.utils.encode_cell({ r: 0, c: col });
            if (wsBookings[cellRef]) {
                wsBookings[cellRef].s = {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4F81BD' } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                };
            }
        }

        // Add thin borders to all cells in bookings sheet for neatness
        const range = window.XLSX.utils.decode_range(wsBookings['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = window.XLSX.utils.encode_cell({ r: R, c: C });
                if (!wsBookings[cell_address]) continue;
                if (!wsBookings[cell_address].s) wsBookings[cell_address].s = {};
                wsBookings[cell_address].s.border = {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } }
                };
            }
        }

        window.XLSX.utils.book_append_sheet(wb, wsBookings, 'Bookings');

        // ========== Services Sheet ==========
        // Prepare services data with header row
        const servicesData = [
            ['Service', 'Price', 'Quantity'],
            ...this.services.map(s => [s.name, s.price, s.quantity])
        ];

        const wsServices = window.XLSX.utils.aoa_to_sheet(servicesData);

        // Style header row services
        for (let col = 0; col < 3; col++) {
            const cellRef = window.XLSX.utils.encode_cell({ r: 0, c: col });
            if (wsServices[cellRef]) {
                wsServices[cellRef].s = {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4F81BD' } },
                    alignment: { horizontal: 'center', vertical: 'center' }
                };
            }
        }

        // Borders for service sheet
        const srvRange = window.XLSX.utils.decode_range(wsServices['!ref']);
        for (let R = srvRange.s.r; R <= srvRange.e.r; ++R) {
            for (let C = srvRange.s.c; C <= srvRange.e.c; ++C) {
                const cell_address = window.XLSX.utils.encode_cell({ r: R, c: C });
                if (!wsServices[cell_address]) continue;
                if (!wsServices[cell_address].s) wsServices[cell_address].s = {};
                wsServices[cell_address].s.border = {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } }
                };
            }
        }

        window.XLSX.utils.book_append_sheet(wb, wsServices, 'Services');

        // Set column widths for readability
        wsBookings['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
        wsServices['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 10 }];

        // Generate XLSX file and trigger download
        window.XLSX.writeFile(wb, `Booking_Report_${this.reportDate.replace(/\//g, '-')}.xlsx`);
    }
}