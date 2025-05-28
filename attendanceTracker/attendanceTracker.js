import { LightningElement, track } from 'lwc';
import saveAttendance from '@salesforce/apex/AttendanceController.saveAttendance';
import exportAttendance from '@salesforce/apex/AttendanceController.exportAttendance';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AttendanceTracker extends LightningElement {
    @track employeeId = '';
    @track selectedProgram = '';
    @track selectedStatus = '';
    @track message = '';
    @track messageClass = '';

    get programOptions() {
        return [
            { label: 'HTML and CSS ( April beginners)', value: 'HTML and CSS ( April beginners)' },
            { label: 'HTML and CSS (March Batch)', value: 'HTML and CSS (March Batch)' },
            { label: 'Data Analytics', value: 'Data Analytics' },
            { label: 'AI ML DS', value: 'AI ML DS' },
            { label: 'Python', value: 'Python' },
            { label: 'Java Backend(March Batch)', value: 'Java Backend(March Batch)' },
            { label: 'Java Backend (Beginners Batch)', value: 'Java Backend (Beginners Batch)' },
            { label: 'Java Backend (Afternoon Intermediate Batch)', value: 'Java Backend (Afternoon Intermediate Batch)' },
            { label: 'Java Backend (Morning Intermediate Batch)', value: 'Java Backend (Morning Intermediate Batch)' }
        ];
    }

    get statusOptions() {
        return [
            { label: 'Present', value: 'Present' },
            { label: 'Absent', value: 'Absent' }
        ];
    }

    handleEmployeeIdChange(event) {
        this.employeeId = event.target.value;
    }

    handleProgramChange(event) {
        this.selectedProgram = event.target.value;
    }

    handleStatusChange(event) {
        this.selectedStatus = event.target.value;
    }

    handleCheckIn() {
        this.saveAttendanceRecord('Check In');
    }

    saveAttendanceRecord(actionType) {
        if (!this.employeeId || !this.selectedProgram || !this.selectedStatus) {
            this.message = 'Please enter Employee ID, select a program, and choose a status.';
            this.messageClass = 'slds-text-color_error';
            return;
        }

        saveAttendance({ empId: this.employeeId, program: this.selectedProgram, status: this.selectedStatus, actionType })
            .then(() => {
                this.message = 'Submit Successfully!';
                this.messageClass = 'slds-text-color_success';
                setTimeout(() => { location.reload(); }, 800);
            })
            .catch(error => {
                this.message = `Error: ${error.body ? error.body.message : error}`;
                this.messageClass = 'slds-text-color_error';
            });
    }

    handleExportRecords() {
        exportAttendance()
            .then(result => {
                let element = document.createElement('a');
                element.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);
                element.target = '_blank';
                element.download = 'Attendance_Records.csv';
                element.click();

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Attendance records exported successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body ? error.body.message : error,
                        variant: 'error'
                    })
                );
            });
    }

    get showExportButton() {
        return true;
    }
}