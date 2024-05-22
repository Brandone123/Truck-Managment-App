import type { EmployeeInformationAndOperationPermissionInfo, PermissionCRUDInfo } from "@/types/store/role"

const crudOperations: PermissionCRUDInfo = {
  create: { name: 'Create', value: false },
  update: { name: 'Update', value: false },
  delete: { name: 'Delete', value: false }
}

export const employeeInformationAndOperationPermissions: EmployeeInformationAndOperationPermissionInfo = {
  // dashboard: { name: 'Dashboard', value: false },
  organizationalCharts: { name: 'Organizational Charts', value: false },
  standardOperatingProcedures: { name: 'Standard Operating Procedures', value: false },
  employmentHistory: { name: 'Employment History', value: false },
  // trainingAndDevelopment: { name: 'Training And Development', value: false },
  frequentlyAskedQuestions: { name: 'Frequently Asked Questions', value: false },
  benefitsAndCompensation: { name: 'Benefits & Compensation', value: false },
  feedbackAndCommunicationChannel: { name: 'Feedback And Communication Channels', value: false },
  complianceAndEthics: { name: 'Compliance & Ethics', value: false },
  settings: {
    name: 'Settings',
    value: false,
    children: {
      positionsAndDuties: { name: 'Positions & Duties', value: false, children: { ...crudOperations } },
      assignPositions: { name: 'Assign Positions', value: false, children: { ...crudOperations } },
      benefits: { name: 'Benefits', value: false, children: { ...crudOperations } },
      employeeBenefits: { name: 'Employee Benefits', value: false, children: { ...crudOperations } },
    }
  }
}


