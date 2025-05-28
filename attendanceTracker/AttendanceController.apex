public with sharing class AttendanceController {
    @AuraEnabled
    public static void saveAttendance(String empId, String program, String status, String actionType) {
        if (String.isBlank(empId) || String.isBlank(program) || String.isBlank(status)) {
            throw new AuraHandledException('Employee ID, Program, and Status are required.');
        }

        program = program.replace('&amp;', '&'); 

        Attendance__c record = new Attendance__c();
        record.Employee_ID__c = empId;
        record.Programs__c = program;
        record.Status__c = status;

        if (actionType == 'Check In') {
            record.CheckInTime__c = System.now();
        } else if (actionType == 'Check Out') {
            record.CheckOutTime__c = System.now();
        }

        insert record;
    }

    @AuraEnabled(cacheable=true)
    public static String exportAttendance() {
        List<Attendance__c> records = [SELECT Employee_ID__c, Programs__c, Status__c, CheckInTime__c, CheckOutTime__c FROM Attendance__c];

        String header = 'Employee ID,Program,Status,Check In Time,Check Out Time\n';
        String csvData = header;

        for (Attendance__c rec : records) {
            csvData += rec.Employee_ID__c + ',' + rec.Programs__c + ',' + rec.Status__c + ',' + rec.CheckInTime__c + ',' + rec.CheckOutTime__c + '\n';
        }

        return csvData;
    }
}