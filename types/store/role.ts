export interface PermissionDetails {
    name: string;
    value: boolean;
}

export interface PermissionCRUDInfo {
    create: PermissionDetails;
    update: PermissionDetails;
    delete: PermissionDetails
}

export interface PermissionLeaf extends PermissionDetails {
    children: PermissionCRUDInfo;
}

export interface ModuleDetails {
    title: string;
    value: boolean;
}

// ATTENDANCE
export interface AttendanceSettingsPermissionInfo extends PermissionDetails {
    children: {
        leavePolicies: PermissionLeaf;
        assignPolicy: PermissionLeaf;
        approverList: PermissionLeaf;
        assignApprover: PermissionLeaf;
        leaveTypes: PermissionLeaf;
    }
}

export interface AttendancePermissionInfo {
    adminDashboard: PermissionDetails;
    employeeDashboard: PermissionDetails;
    reports: PermissionDetails;
    adminTimeoffView: PermissionDetails;
    employeeTimeoffView: PermissionDetails;
    settings: AttendanceSettingsPermissionInfo;
}

export interface AttendanceModulePermissionInfo extends ModuleDetails {
    permissions: AttendancePermissionInfo
}

// DISPATCH

export interface DispatchSettingsPermissionInfo extends PermissionDetails {
    // todo
}

export interface DispatchPermissionInfo {
    // todo
}

export interface DispatchModulePermissionInfo extends ModuleDetails {
    permissions: DispatchPermissionInfo
}

// MAINTENANCE

export interface MaintenanceSettingsPermissionInfo extends PermissionDetails {
    //todo
}

export interface MaintenancePermissionInfo {
    // todo
}

export interface MaintenanceModulePermissionInfo extends ModuleDetails {
    permissions: MaintenancePermissionInfo;
}

// SAFETY AND COMPLIANCE

export interface SafetyAndComplianceSettingsPermissionInfo extends PermissionDetails {
    //todo
}

export interface SafetyAndCompliancePermissionInfo {
    // todo
}

export interface SafetyAndComplianceModulePermissionInfo  extends ModuleDetails{
    permissions: SafetyAndCompliancePermissionInfo;
}

// YARD CHECK

export interface YardCheckSettingsPermissionInfo extends PermissionDetails {
    //todo
}

export interface YardCheckPermissionInfo {
    // todo
}

export interface YardCheckModulePermissionInfo extends ModuleDetails {
    permissions: YardCheckPermissionInfo;
}


// EMPLOYEE INFORMATION AND OPERATION

export interface EmployeeInformationAndOperationSettingsPermissionInfo extends PermissionDetails {
    children: {
        positionsAndDuties: PermissionLeaf;
        assignPositions: PermissionLeaf;
        benefits: PermissionLeaf;
        employeeBenefits: PermissionLeaf;
    }
}

export interface EmployeeInformationAndOperationPermissionInfo {
    standardOperatingProcedures: PermissionDetails;
    organizationalCharts: PermissionDetails;
    employmentHistory: PermissionDetails;
    frequentlyAskedQuestions: PermissionDetails;
    benefitsAndCompensation: PermissionDetails;
    feedbackAndCommunicationChannel: PermissionDetails;
    complianceAndEthics:PermissionDetails;
    settings: EmployeeInformationAndOperationSettingsPermissionInfo;
}

export interface EmployeeInformationAndOperationModulePermissionInfo extends ModuleDetails {
    permissions: EmployeeInformationAndOperationPermissionInfo;
}

// ROLE PERMISSIONS
export interface RolePermissions {
    attendance: AttendanceModulePermissionInfo;
    dispatch: DispatchModulePermissionInfo;
    maintenance: MaintenanceModulePermissionInfo;
    safetyAndCompliance: SafetyAndComplianceModulePermissionInfo;
    yardCheck: YardCheckModulePermissionInfo;
    employeeInformationAndOperation: EmployeeInformationAndOperationModulePermissionInfo;
}

// ROLE INFO
export interface RoleInfo {
    id?: number | null;
    name: string | null;
    permissions: RolePermissions | null;
    description: string | null;
}



