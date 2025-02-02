import { IconLayoutDashboard, IconPackage, IconLocation, IconTools, IconCalendar, IconClipboardCheck, IconTruckDelivery, IconShieldCheckeredFilled, IconCarGarage, IconRotateRectangle, IconSettings, IconTruck, IconBuilding, IconUser, IconUserCog, IconBrandSpeedtest, IconCar, IconHistoryToggle, IconForms, IconCalendarClock, Icon24Hours, IconZoomCode, IconZoomScan, IconFiles, IconAlertTriangle, IconBuildingWarehouse, IconShieldLock, IconComponents, IconTool, IconReport } from '@tabler/icons-vue';

import type { navMenu } from '~/types/layout/NavMenuTypes';

function getMaintenancePermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useMaintenanceNavbarMenu() {
    const menu: navMenu[] = [
        {
            title: 'Dashboard',
            icon: IconLayoutDashboard,
            to: '/maintenance',
            show: true,
        },
        {
            title: 'Asset Management',
            icon: IconPackage,
            show: true,
            children: [
                {
                    title: 'Vehicle List',
                    icon: IconCar,
                    to: '/maintenance/AssetListPage'
                },
                {
                    title: 'Meter History',
                    icon: IconBrandSpeedtest,
                    to: '/maintenance/MeterHistoryPage'
                },
                {
                    title: 'Tire History',
                    icon: IconFiles,
                    to: '/maintenance/TireHistory'
                },
                {
                    title: 'Asset Lifecycle',
                    icon: IconHistoryToggle,
                    to: '/maintenance/AssetLifecyclePage'
                },
                // {
                //     title: 'Maintenance History',
                //     icon: IconCarGarage,
                //     to: '/maintenance/MaintenanceHistoryPage'
                // }
            ]
        },
        {
            title: 'Preventive Maintenance',
            icon: IconTools,
            show: true,
            children: [
                // {
                //     title: 'Programs',
                //     icon: IconBuilding,
                //     to: '/maintenance/PreventiveMaintenanceProgramsPage'
                // },
                // {
                //     title: 'Schedule',
                //     icon: IconCalendar,
                //     to: '/maintenance/PreventiveMaintenance'
                // },
                {
                    title: 'Inspections',
                    icon: IconZoomScan,
                    to: '/maintenance/Inspection'
                },
                {
                    title: 'Service Programs',
                    icon: Icon24Hours,
                    to: '/maintenance/ServicePrograms'
                },
                { 
                    title: 'Service Reminders',
                    icon: IconTruckDelivery,
                    to: '/maintenance/ServiceRemindersPage'
                },
                // {
                //     title: 'Service Schedule',
                //     icon: IconCalendarClock,
                //     to: '/maintenance/ServiceSchedule'
                // },
                {
                    title: 'Forms',
                    icon: IconFiles,
                    to: '/maintenance/InspectionForms'
                },
            ]
        },
        {
            title: 'Issues',
            icon: IconAlertTriangle,
            show: true,
            children: [
                // {
                //     title: 'Management',
                //     icon: IconUserCog,
                //     to: '/maintenance/IssueManagementPage'
                // },
                // {
                //     title: 'Resolution',
                //     icon: IconTruck,
                //     to: '/maintenance/VehicleUsage'
                // },
                {
                    title: 'Issues',
                    icon: IconUserCog,
                    to: '/maintenance/IssuesManagement'
                },
                {
                    title: 'Item Failures',
                    icon: IconAlertTriangle,
                    to: '/maintenance/FailureManagement'
                },
                {
                    title: 'Faults',
                    icon: IconTruck,
                    to: '/maintenance/FaultManagement'
                },
                {
                    title: 'Recalls',
                    icon: IconTruck,
                    to: '/maintenance/RecallManagement'
                }
            ]
        },
        {
            title: 'Maintenance Management',
            icon: IconCarGarage,
            show: true,
            children: [
                {
                    title: 'Work Orders',
                    icon: IconTruckDelivery,
                    to: '/maintenance/WorkOrders'
                },
                {
                    title: 'Service History',
                    icon: IconTruckDelivery,
                    to: '/maintenance/ServiceHistory'
                },
                {
                    title: 'Service Task',
                    icon: IconTruckDelivery,
                    to: '/maintenance/ServiceTasks'
                },
                // {
                //     title: 'Maintenance Scheduling', //will take out
                //     icon: IconShieldCheckeredFilled,
                //     to: '/maintenance/MaintenanceSchedulingPage'
                // },
                // {
                //     title: 'Activity Management', //might take out
                //     icon: IconRotateRectangle,
                //     to: '/maintenance/ExpenseActivityManagementPage'
                // }
            ]
        },

        // {
        //     title: 'Maintenance Tracking',
        //     icon: IconClipboardCheck,
        //     show: true,
        //     children: [
        //         {
        //             title: 'Maintenance Tracking',
        //             icon: IconUserCog,
        //             to: '/maintenance/MaintenanceTrackingPage'
        //         },
        //         {
        //             title: 'Vehicle Usage',
        //             icon: IconTruck,
        //             to: '/maintenance/VehicleUsage'
        //         }
        //     ]
        // },
        // {
        //     title: 'Services',
        //     icon: IconSettings,
        //     show: true,
        //     children: [
        //         {
        //             title: 'Work Orders',
        //             icon: IconTruckDelivery,
        //             to: '/maintenance/WorkOrderPage'
        //         },
        //         {
        //             title: 'Maintenance Scheduling',
        //             icon: IconShieldCheckeredFilled,
        //             to: '/maintenance/MaintenanceSchedulingPage'
        //         },
        //         {
        //             title: 'Activity Management',
        //             icon: IconRotateRectangle,
        //             to: '/maintenance/ExpenseActivityManagementPage'
        //         }
        //     ]
        // },

        {
            title: 'Inventory Management',
            icon: IconBuildingWarehouse,
            show: true,
            children: [
                {
                    title: 'Parts',
                    icon: IconUserCog,
                    to: '/maintenance/PartSupplyTrackingPage'
                },
                // {
                //     title: 'Parts Locations',
                //     icon: IconLocation,
                //     to: '/maintenance/PartLocation'
                // },
                // {
                //     title: 'Part Category',
                //     icon: IconLocation,
                //     to: '/maintenance/PartCategory'
                // },
                // {
                //     title: 'Part Manufacturer',
                //     icon: IconLocation,
                //     to: '/maintenance/PartManufacturer'
                // },
                // {
                //     title: 'Measurement Units',
                //     icon: IconLocation,
                //     to: '/maintenance/PartMeasurementUnits'
                // },
                {
                    title: 'Purchase Orders',
                    icon: IconUserCog,
                    to: '/maintenance/PurchaseOrder'
                },
                {
                    title: 'Inventory',
                    icon: IconTruck,
                    to: '/maintenance/InventoryLevels'
                },

                {
                    title: 'Supplier Management',
                    icon: IconTruck,
                    to: '/maintenance/SupplierManagement'
                }
            ]
        },

        {
            title: 'Profiles',
            icon: IconUserCog,
            to: '/maintenance/TechnicianProfilesAndSkillsManagement',
            show: true,
        },

        // {
        //     title: 'Technician Management',
        //     icon: IconClipboardCheck,
        //     show: true,
        //     children: [
        //         {
        //             title: 'Profiles',
        //             icon: IconUserCog,
        //             to: '/maintenance/TechnicianProfilesAndSkillsManagement'
        //         },
        //         {
        //             title: 'Task',
        //             icon: IconTruck,
        //             to: '/maintenance/TechnicianTaskAssignment'
        //         },


        //     ]
        // },

        // {
        //     title: 'Compliance & Safety',
        //     icon: IconShieldLock,
        //     show: true,
        //     children: [
        //         {
        //             title: 'Maintenance Compliance',
        //             icon: IconUserCog,
        //             to: '/maintenance/MaintenanceComplianceManagement'
        //         },
        //         {
        //             title: 'Certification & Renewals',
        //             icon: IconTruck,
        //             to: '/maintenance/VehicleCertification'
        //         },
        //         {
        //             title: 'Safety Inspection', //will take out
        //             icon: IconTruck,
        //             to: '/maintenance/SafetyInspectionsAndChecks'
        //         },
        //     ]
        // },
        {
            title: 'Certification & Renewals',
            icon: IconTruck,
            to: '/maintenance/VehicleCertification',
            show: true,
        },

        {
            title: 'Maintenance Reports',
            icon: IconReport,
            show: true,
            children: [
                {
                    title: 'Reports',
                    icon: IconUserCog,
                    to: '/maintenance/ReportsGeneration'
                },
                {
                    title: 'Analytics',
                    icon: IconTruck,
                    to: '/maintenance/AnalyticsAndDataIntelligencePage'
                },

            ]
        },

        {
            title: 'Integrations',
            icon: IconComponents,
            show: true,
            children: [
                {
                    title: 'Telematics',
                    icon: IconUserCog,
                    to: '/maintenance/TelematicsDataIntegration'
                },
                // {
                //     title: 'NHTSA Recalls',
                //     icon: IconTruck,
                //     to: '/maintenance/Recalls'
                // },
                // {
                //     title: 'Templates',
                //     icon: IconTruck,
                //     to: '/maintenance/Templates'
                // },

            ]
        },
        // {
        //     title: 'Equipmemt Management',
        //     icon: IconTool,
        //     show: true,
        //     children: [
        //         {
        //             title: 'Management',
        //             icon: IconUserCog,
        //             to: '/maintenance/EquipmentManage'
        //         },
        //         {
        //             title: 'Inspections',
        //             icon: IconTruck,
        //             to: '/maintenance/InspectionRecordsManagement'
        //         }


        //     ]
        // }



    ];

    return menu.filter((item) => item.show);
}

// export function useMaintenanceSettingsMenu() {
//     const settings: navMenu[] = [
//         {
//             title: 'Coming Soon',
//             icon: IconLayoutDashboard,
//             to: '',
//             show: true,
//         }
//     ];

//     return settings.filter((item) => item.show);
// }


export function useMaintenanceSettingsMenu() {
    const settings: navMenu[] = [
        {
            title: 'Part Locations',
            icon: IconLayoutDashboard,
            to: 'part_locations',
            show: true, // getAttendancePermissions()?.settings?.children?.leavePolicies?.value || false,
        },
        {
            title: 'Part Manufactuerers',
            icon: IconLayoutDashboard,
            to: 'part_manufacturers',
            show: true, // getAttendancePermissions()?.settings?.children?.leavePolicies?.value || false,
        },
        {
            title: 'Part Measurement Units',
            icon: IconLayoutDashboard,
            to: 'part_measurement_units',
            show: true, // getAttendancePermissions()?.settings?.children?.approverList?.value || false,
        },
        {
            title: 'Part Categories',
            icon: IconLayoutDashboard,
            to: 'part_categories',
            show: true, // getAttendancePermissions()?.settings?.children?.assignApprover?.value || false,
        }
    ];

    return settings.filter((item) => item.show);
}