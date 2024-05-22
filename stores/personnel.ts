import { defineStore } from 'pinia';

interface PersonnelInfo {
    personnel_id: number;
    type: string;
    driver_type: string | null
    last_name: string;
    first_name: string;
    middle_initial: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    telephone: string;
    cell_phone: string;
    cell_carrier: string;
    other_phone: string;
    office: string;
    department: string;
    email: string;
    user_defined1: string;
    user_defined2: string;
    ssn: string;
    passport_no: string | null;
    passport_exp: string | null;
    date_of_birth: string;
    hire_date: string;
    termination_date: string | null;
    mail_list: boolean;
    maintenance: boolean;
    notes: string;
    code: string;
}

interface State {
    personnelList: PersonnelInfo[]
}

export const usePersonnelStore = defineStore('personnel', {
    state: (): State => ({
        personnelList: [
            {
                personnel_id: 1,
                type: "driver",
                driver_type: "owner operator",
                last_name: "DriverLastName",
                first_name: "DriverFirstName",
                middle_initial: "D",
                address1: "DriverAddress1",
                address2: "DriverAddress2",
                city: "DriverCity",
                state: "DriverState",
                zip: "DriverZip",
                telephone: "DriverTelephone",
                cell_phone: "DriverCellPhone",
                cell_carrier: "DriverCellCarrier",
                other_phone: "DriverOtherPhone",
                office: "DriverOffice",
                department: "DriverDepartment",
                email: "driver@example.com",
                user_defined1: "DriverUserDefined1",
                user_defined2: "DriverUserDefined2",
                ssn: "DriverSSN",
                passport_no: "DriverPassportNo",
                passport_exp: "2023-12-31",
                date_of_birth: "1990-01-01",
                hire_date: "2022-01-01",
                termination_date: "2022-12-31",
                mail_list: true,
                maintenance: false,
                notes: "Driver notes",
                code: "DriverCode"
            },
            {
                personnel_id: 2,
                type: "employee",
                driver_type: null,
                last_name: "EmployeeLastName",
                first_name: "EmployeeFirstName",
                middle_initial: "E",
                address1: "EmployeeAddress1",
                address2: "EmployeeAddress2",
                city: "EmployeeCity",
                state: "EmployeeState",
                zip: "EmployeeZip",
                telephone: "EmployeeTelephone",
                cell_phone: "EmployeeCellPhone",
                cell_carrier: "EmployeeCellCarrier",
                other_phone: "EmployeeOtherPhone",
                office: "EmployeeOffice",
                department: "EmployeeDepartment",
                email: "employee@example.com",
                user_defined1: "EmployeeUserDefined1",
                user_defined2: "EmployeeUserDefined2",
                ssn: "EmployeeSSN",
                passport_no: null,
                passport_exp: null,
                date_of_birth: "1995-01-01",
                hire_date: "2023-01-01",
                termination_date: null,
                mail_list: true,
                maintenance: true,
                notes: "Employee notes",
                code: "EmployeeCode"
            }
        ]
    }),

    getters: {
        getPersonnelList: (state) => { return state.personnelList }
    },
    actions: {
        loadPersonnelList() {
        },
    },
})
