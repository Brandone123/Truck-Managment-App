//import { IconReportAnalytics, IconLayoutDashboard, IconCalendarStats } from '@tabler/icons-vue';
import {
    IconLayoutDashboard,       // for Dashboard
    IconUsers,                 // for Driver Management
    IconCalendarTime,          // for Testing & Screening Scheduler
    IconLicense,               // for MVR
    IconClock,                 // for HOS & ELD top-level
    IconNotes,                 // for Log Management
    IconDeviceAnalytics,       // for Real Time Monitoring
    IconAlertCircle,           // for Violations
    IconSchool,                // for Driver Training
    IconTruck,                 // for Fleet Management
    IconClipboardCheck,        // for DVIR
    IconAlertTriangle,         // for Incident Management
    IconCurrencyDollar,        // for Claims
    IconBiohazard,             // for HazMat
    IconFirstAidKit,           // for Emergency Procedures
    IconShieldCheck,           // for Insurance
    IconActivity,              // for Risk Analysis
    IconClipboardList,         // for Audit Readiness
    IconReceiptTax,            // for IFTA/IRP/Tax
    IconFileText,              // for Document Repository
    IconReportAnalytics,       // for Reports
  } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getSafetyPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useSafetyNavbarMenu() {

    const menu: navMenu[] = [
        {
          title: 'Dashboard',
          icon: IconLayoutDashboard,
          to: '/safety_and_compliance',
          show: true,
        },
        {
          title: 'Driver Management',
          icon: IconUsers,
          show: true,
          children: [
            {
              title: 'Driver Lists',
              icon: IconUsers,
              to: '/safety_and_compliance/driverManagement',
            },
            {
              title: 'Testing & Screening Scheduler',
              icon: IconCalendarTime,
              to: '/safety_and_compliance/testingScheduler',
            },
            {
              title: 'MVR Request & Tracking',
              icon: IconLicense,
              to: '/safety_and_compliance/mvrTracking',
            },
          ],
        },
        {
          title: 'HOS & ELD Compliance',
          icon: IconClock,
          show: true,
          children: [
            {
              title: 'Log Management',
              icon: IconNotes,
              to: '/safety_and_compliance/driverLogManagement',
            },
            {
              title: 'Log Test',
              icon: IconNotes,
              to: '/safety_and_compliance/driverLogManagement/logs',
            },
            {
              title: 'Real Time Monitoring',
              icon: IconDeviceAnalytics,
              to: '/safety_and_compliance/realTimeMonitoring',
            },
            {
              title: 'Violations & Discrepancy Resolution',
              icon: IconAlertCircle,
              to: '/safety_and_compliance/violationDiscrepancies',
            },
            {
              title: 'Driver Training & ELD',
              icon: IconSchool,
              to: '/safety_and_compliance/driverTrainingEld',
            },
          ],
        },
        {
          title: 'Vehicles & Inspections',
          icon: IconTruck,
          show: true,
          children: [
            {
              title: 'Fleet Management',
              icon: IconTruck,
              to: '/safety_and_compliance/vehicleManagement',
            },
            {
              title: 'DVIRs',
              icon: IconClipboardCheck,
              to: '/safety_and_compliance/dvirManagement',
            },
          ],
        },
        {
          title: 'Incidents & Claims',
          icon: IconAlertTriangle,
          show: true,
          children: [
            {
              title: 'Incident Management',
              icon: IconAlertTriangle,
              to: '/safety_and_compliance/incidentManagement',
            },
            {
              title: 'Claims',
              icon: IconCurrencyDollar,
              to: '/safety_and_compliance/claimsManagement',
            },
          ],
        },
        {
          title: 'HazMat Compliance',
          icon: IconBiohazard,
          show: true,
          children: [
            {
              title: 'Loads Compliance',
              icon: IconBiohazard,
              to: '/safety_and_compliance/hazmatManagement',
            },
            {
              title: 'Emergency Procedures',
              icon: IconFirstAidKit,
              to: '/safety_and_compliance/emergencyProcedures',
            },
          ],
        },
        {
          title: 'Risk & Insurance',
          icon: IconShieldCheck,
          show: true,
          children: [
            {
              title: 'Insurance Management',
              icon: IconShieldCheck,
              to: '/safety_and_compliance/insurancePolicies',
            },
            {
              title: 'Risk Analysis',
              icon: IconActivity,
              to: '/safety_and_compliance/riskAnalysis',
            },
          ],
        },
        {
          title: 'Regulatory Compliance',
          icon: IconClipboardList,
          show: true,
          children: [
            {
              title: 'Audit Readiness & Management',
              icon: IconClipboardList,
              to: '/safety_and_compliance/auditReadiness',
            },
            {
              title: 'IFTA / IRP / Tax Management',
              icon: IconReceiptTax,
              to: '/safety_and_compliance/ifta_irp_tax',
            },
            {
              title: 'Document Repository & Management',
              icon: IconFileText,
              to: '/safety_and_compliance/auditReadiness', 
              // note: same route as auditReadiness? 
              // change if needed: e.g. '/safety_and_compliance/docRepository'
            },
          ],
        },
        {
          title: 'Safety Training',
          icon: IconSchool,
          to: '/safety_and_compliance/safetyTraining',
          show: true,
        },
        {
          title: 'Reports',
          icon: IconReportAnalytics,
          to: '/safety_and_compliance/reporting_analytics',
          show: true,
        },
      ];

    return menu.filter((item) => item.show);
}

export function useSafetySettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
