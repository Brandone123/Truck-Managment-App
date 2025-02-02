import { IconTool,IconEngine,IconChartRadar,IconChartArrows,IconExchange,IconDeviceFloppy, IconMap,IconArrowDownCircle, IconFlag,IconBuildingSkyscraper,IconToolsKitchen2, IconLayoutDashboard,IconEdit ,IconFileChart,IconCalculator,IconFilePlus,IconChecklist ,IconCar , IconCalendarStats } from '@tabler/icons-vue';
import { IconKey, IconFileInvoice, IconTrendingUp, IconClock ,IconPackage, IconFileText , IconCreditCard, IconReceipt, IconWallet, IconBook, IconCurrencyDollar, IconLink, IconChartPie, IconTank, IconBriefcase, IconGavel, IconGasStation, IconTruckDelivery,IconShieldCheckeredFilled,IconCarGarage,IconRotateRectangle,IconSettings,IconTruck, IconBuilding, IconUser, IconUserCog} from '@tabler/icons-vue';

import type { navMenu } from '~/types/layout/NavMenuTypes';

function getAccountingPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useAccountingNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Accounting Dashboard',
            icon: IconLayoutDashboard,
            to: '/accounting',
            show: true
        },
        {
            title: 'Receivable (AR)',
            icon: IconCurrencyDollar,
            show: true,
            children: [
                {
                    title: 'Billing',
                    icon: IconFileInvoice,
                    to: '/accounting/BillingPage'
                },

                {
                    title: 'Invoicing',
                    icon: IconFileInvoice,
                    to: '/accounting/Invoicing'
                },
                {
                    title: 'Payments',
                    icon: IconCreditCard,
                    to: '/accounting/PaymentProcessing'
                }, 
                {
                    title: 'Aging Reports',
                    icon: IconClock,
                    to: '/accounting/AgingReportsPage'
                },
                {
                    title: 'Credit Management',
                    icon: IconTrendingUp,
                    to: '/accounting/CreditManagementPage'
                },
               
            ]
        },

        {
            title: 'Payable (AP)',
            icon: IconReceipt,
            show: true,
            children: [
                {
                    title: 'Vendor Management',
                    icon: IconTool,
                    to: '/accounting/VendorManagementPage'
                },
                {
                    title: 'Bill Entry',
                    icon: IconFileText,
                    to: '/accounting/BillEntryTrackingPage'
                }, 
                {
                    title: 'Payment',
                    icon: IconCreditCard,
                    to: '/accounting/PaymentProcessingAP'
                },
                {
                    title: 'Aging Report',
                    icon: IconClock,
                    to: '/accounting/APAgingReportPage'
                },
               
            ]
        },

        {
            title: 'General Ledger',
            icon: IconBook,
            show: true,
            children: [
                {
                    title: 'Chart Of Accounts',
                    icon: IconBook,
                    to: '/accounting/ChartOfAccountsPage'
                },
                {
                    title: 'Journal Entries',
                    icon: IconEdit,
                    to: '/accounting/JournalEntriesPage'
                }, 
                {
                    title: 'Financial Reporting',
                    icon: IconFileChart  ,
                    to: '/accounting/FinancialReportingPage'
                },
            ]
        },

        {
            title: 'Payroll',
            icon: IconWallet,
            show: true,
            children: [
                {
                    title: 'Personnel',
                    icon: IconUser,
                    to: '/accounting/PersonnelManagementPage'
                },
                {
                    title: 'Payroll Batch',
                    icon: IconPackage,
                    to: '/accounting/PayrollBatch'
                },
                {
                    title: 'Payroll Journal',
                    icon: IconFileText,
                    to: '/accounting/PayrollJournalPage'
                },
                {
                    title: 'Pay Calculation',
                    icon: IconCalculator,
                    to: '/accounting/PayCalculationPage'
                }, 
                {
                    title: 'Tax Filing',
                    icon: IconFilePlus ,
                    to: '/accounting/TaxFilingPage'
                },
                {
                    title: 'Direct Deposit',
                    icon: IconCreditCard,
                    to: '/accounting/DirectDepositPage'
                },
            ]
        },

        {
            title: 'Expense Management',
            icon: IconCreditCard,
            show: true,
            children: [
                {
                    title: 'Expense Tracking',
                    icon: IconReceipt,
                    to: '/accounting/ExpenseTrackingPage'
                },
                {
                    title: 'Approval WorkFlows',
                    icon: IconChecklist ,
                    to: '/accounting/ApprovalWorkflowsPage'
                }, 
                {
                    title: 'Reimbursement',
                    icon: IconCurrencyDollar,
                    to: '/accounting/ReimbursementPage'
                },
                
            ]
        },

        {
            title: 'Fuel Management',
            icon: IconGasStation,
            show: true,
            children: [
                {
                    title: 'Fuel Purchases',
                    icon: IconCar ,
                    to: '/accounting/FuelPurchasesPage'
                },
                {
                    title: 'Fuel Taxes',
                    icon: IconGasStation ,
                    to: '/accounting/FuelTaxesPage'
                }, 
                {
                    title: 'Fuel Efficiency',
                    icon: IconEngine,
                    to: '/accounting/FuelEfficiencyPage'
                },
                
            ]
        },

        {
            title: 'Compliance & Taxation',
            icon: IconFileText,
            show: true,
            children: [
                {
                    title: 'IFTA Reporting',
                    icon: IconMap   ,
                    to: '/accounting/IftaReportsPage'
                },
                {
                    title: 'State & Federal',
                    icon: IconFlag,
                    to: '/accounting/StateAndFederalTaxesPage'
                }, 
            ]
        },

        {
            title: 'Asset Management',
            icon: IconPackage,
            show: true,
            children: [
                {
                    title: 'Depreciation',
                    icon: IconArrowDownCircle  ,
                    to: '/accounting/DepreciationPage'
                },
                {
                    title: 'Asset Valuation',
                    icon: IconBuildingSkyscraper,
                    to: '/accounting/AssetValuationPage'
                }, 
                {
                    title: 'Maintenance Cost',
                    icon: IconToolsKitchen2,
                    to: '/accounting/MaintenanceCostPage'
                },
                
            ]
        },

        {
            title: 'Financial Analysis',
            icon: IconChartPie,
            show: true,
            children: [
                {
                    title: 'Budgeting',
                    icon: IconCalendarStats,
                    to: '/accounting/BudgetingPage'
                },
                {
                    title: 'Forecasting',
                    icon: IconChartRadar,
                    to: '/accounting/ForecastingPage'
                }, 
                {
                    title: 'Variance Analysis',
                    icon: IconChartArrows,
                    to: '/accounting/VarianceAnalysisPage'
                },
                
            ]
        },

        {
            title: 'Integrations',
            icon: IconLink,
            show: true,
            children: [
                {
                    title: 'Bank Reconciliation',
                    icon: IconDeviceFloppy,
                    to: '/accounting/BankReconciliationPage'
                },
                {
                    title: 'Quickbook',
                    icon: IconBook,
                    to: '/accounting/QuickBooksIntegrationPage'
                }, 
                {
                    title: 'EDI',
                    icon: IconExchange,
                    to: '/accounting/EDIPage'
                },
                
            ]
        },
       
        
    ];

    return menu.filter((item) => item.show);
}

export function useAccountingSettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
