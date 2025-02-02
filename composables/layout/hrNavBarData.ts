// src/composables/useHrNavbarMenu.ts

import {
    // Top-Level / Common
    IconLayoutDashboard,      // Dashboard
    IconUsers,                // Employee Management or general "people"
    IconGauge,                // Performance Management
    IconShieldCheck,          // Compliance Management
    IconBuildingSkyscraper,   // Organization Management
    IconForms,                // Survey Management
    IconSchool,               // Training Management
    IconScript,               // Document Management
    IconUserCircle,           // Another Employee Management link if needed
  
    IconAlertTriangle,        // Incident Reporting
    IconCalendarTime,         // Leave Management
    IconBellRinging,          // Notification Center
    IconCoin,                 // Payroll
    IconChartLine,            // Performance Evaluation
    IconSchool as IconTraining, // If you want a separate “Training” icon
    // Sub-Item Icons
    IconListSearch,           // Employee Lists
    IconHeartHandshake,       // Benefits
    IconIdBadge,              // Job Titles
    IconCheckupList,          // Performance Reviews
    IconChartBar,             // Driver Metrics
    IconChartDots,            // Performance Improvement
    IconFileDescription,      // Policy
    IconDiscountCheck,        // Ethics Programs (or IconAward, etc.)
    IconAlertCircle,          // Incidents
    IconClipboardList,        // SOPs, or general checklist items
    IconBuildingFactory,      // Departments
    IconHierarchy2,           // Organization Charts
    IconMessages,             // Survey Responses
    IconBulb,                 // Development Plans
  } from '@tabler/icons-vue';
  
  import type { navMenu } from '~/types/layout/NavMenuTypes';
  // import { useAuthStore } from '~/stores/auth'; // if you need auth checks
  
  function getHrPermissions() {
    // const auth = useAuthStore();
    // return auth.user?.employee?.role?.permissions?.hr?.permissions;
  }
  
  export function useHrNavbarMenu() {
  
    const menu: navMenu[] = [
      {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/hr',
        show: true,
      },
      {
        title: 'Employee Management',
        icon: IconUsers,
        show: true,
        children: [
          {
            title: 'Employee Lists',
            icon: IconListSearch,
            to: '/hr/employeeManagement/EmployeeInfoManagementPage',
          },
          {
            title: 'Benefits Management',
            icon: IconHeartHandshake,
            to: '/hr/employeeManagement/BenefitsPage',
          },
          {
            title: 'Job Titles',
            icon: IconIdBadge,
            to: '/hr/employeeManagement/JobTitlesPage',
          },
        ],
      },
      {
        title: 'Performance Management',
        icon: IconGauge,
        show: true,
        children: [
          {
            title: 'Performance Reviews',
            icon: IconCheckupList,
            to: '/hr/performanceManagement/PerformanceReviewsListPage',
          },
          {
            title: 'Driver Metrics',
            icon: IconChartBar,
            to: '/hr/performanceManagement/DriverMetricsListPage',
          },
          {
            title: 'Performance Improvement',
            icon: IconChartDots,
            to: '/hr/performanceManagement/PIPListPage',
          },
        ],
      },
      {
        title: 'Compliance Management',
        icon: IconShieldCheck,
        show: true,
        children: [
          {
            title: 'Policy',
            icon: IconFileDescription,
            to: '/hr/compliancePolicyManagement/PoliciesListPage',
          },
          {
            title: 'Ethics Programs',
            icon: IconDiscountCheck,
            to: '/hr/compliancePolicyManagement/EthicsProgramsListPage',
          },
          {
            title: 'Incidents Reports',
            icon: IconAlertCircle,
            to: '/hr/compliancePolicyManagement/IncidentReportsListPage',
          },
        ],
      },
      {
        title: 'Organisation Management',
        icon: IconBuildingSkyscraper,
        show: true,
        children: [
          {
            title: 'SOPs',
            icon: IconClipboardList,
            to: '/hr/organizationManagement/SOPListPage',
          },
          {
            title: 'Departments',
            icon: IconBuildingFactory,
            to: '/hr/organizationManagement/DepartmentListPage',
          },
          {
            title: 'Duties',
            icon: IconClipboardList,
            to: '/hr/organizationManagement/DutiesListPage',
          },
          {
            title: 'Organization Charts',
            icon: IconHierarchy2,
            to: '/hr/organizationManagement/OrganizationChartsListPage',
          },
        ],
      },
      {
        title: 'Survey Management',
        icon: IconForms,
        show: true,
        children: [
          {
            title: 'Surveys',
            icon: IconForms,
            to: '/hr/surveyManagement/SurveyManagementPage',
          },
          {
            title: 'Survey Responses',
            icon: IconMessages,
            to: '/hr/surveyManagement/SurveyResponsePage',
          },
        ],
      },
      {
        title: 'Training Management',
        icon: IconSchool,
        show: true,
        children: [
          {
            title: 'Development Plans',
            icon: IconBulb,
            to: '/hr/trainingManagement/DevelopmentPlansListPage',
          },
          {
            title: 'Training Coordinations',
            icon: IconSchool,
            to: '/hr/trainingManagement/TrainingCoordinationsListPage',
          },
        ],
      },
      {
        title: 'Document Management',
        icon: IconScript,
        to: '/hr/document_management',
        show: true,
      },
      {
        title: 'Employee Management', // Possibly rename to avoid confusion with the above
        icon: IconUserCircle,
        to: '/hr/employee_management',
        show: true,
      },
      {
        title: 'Employee Relation',
        icon: IconBulb,
        to: '/hr/employee_relation',
        show: true,
      },
      {
        title: 'Incident Reporting',
        icon: IconAlertTriangle,
        to: '/hr/incident_reporting',
        show: true,
      },
      {
        title: 'Leave Management',
        icon: IconCalendarTime,
        to: '/hr/leave_management',
        show: true,
      },
      {
        title: 'Notification Center',
        icon: IconBellRinging,
        to: '/hr/notification_center',
        show: true,
      },
      {
        title: 'Payroll',
        icon: IconCoin,
        to: '/hr/payroll',
        show: true,
      },
      {
        title: 'Performance Evaluation',
        icon: IconChartLine,
        to: '/hr/performance_evaluation',
        show: true,
      },
      {
        title: 'Training',
        icon: IconTraining,
        to: '/hr/training',
        show: true,
      },
    ];
  
    return menu.filter((item) => item.show);
  }
  
  export function useHrSettingsMenu() {
    const settings: navMenu[] = [];
    return settings.filter((item) => item.show);
  }
  