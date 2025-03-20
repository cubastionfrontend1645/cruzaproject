global class Shift_Appointments implements FSL.CustomGanttServiceAppointmentAction {
 
    global String action(List<Id> serviceAppointmentsIds, Datetime ganttStartDate, Datetime ganttEndDate, Map<String, Object> additionalParameters) {
       
        List<ServiceAppointment> saList = [SELECT AppointmentNumber, schedstarttime, schedendtime,FSL__Duration_In_Minutes__c, DueDate, EarliestStartTime, Day_1__c, Day_2__c, Day_3__c FROM ServiceAppointment WHERE Id in : serviceAppointmentsIds];
        String reply = '';
        List<String> saNames = new List<String>();

        for (ServiceAppointment s : saList) {
            if (s.Day_2__c ==True){
                time t1 = s.schedstarttime.time();
                string dt = string.valueOf(date.today())+' '+t1;
                s.schedstarttime = datetime.valueOf(dt);
                s.schedendtime = datetime.valueOf(dt).addMinutes(integer.valueof(s.FSL__Duration_In_Minutes__c));
                s.DueDate= datetime.valueOf(dt).AddDays(3);
                s.EarliestStartTime= datetime.valueOf(dt).AddDays(-3);
                }
                
            if (s.Day_1__c==True){
                time t2 = s.schedstarttime.time();
                string dt2 = string.valueOf(date.today().addDays(-1))+' '+t2;
                s.schedstarttime = datetime.valueOf(dt2);
                s.schedendtime = datetime.valueOf(dt2).addMinutes(integer.valueof(s.FSL__Duration_In_Minutes__c));
                s.DueDate= datetime.valueOf(dt2).AddDays(3);
                s.EarliestStartTime= datetime.valueOf(dt2).AddDays(-3);
                }
                
             if (s.Day_3__c==True){
                time t3 = s.schedstarttime.time();
                string dt3 = string.valueOf(date.today().addDays(1))+' '+t3;
                s.schedstarttime = datetime.valueOf(dt3);
                s.schedendtime = datetime.valueOf(dt3).addMinutes(integer.valueof(s.FSL__Duration_In_Minutes__c));
                s.DueDate= datetime.valueOf(dt3).AddDays(3);
                s.EarliestStartTime= datetime.valueOf(dt3).AddDays(-3);
                }
             
                saNames.add(s.AppointmentNumber);
        }
       
        upsert saList;

        reply = String.join(saNames, ', ');
        return 'Service Appointments successfully processed: ' + reply;
    }
}