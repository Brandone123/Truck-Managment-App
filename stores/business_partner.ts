import { defineStore } from 'pinia';

interface PartnerDefaults {
    default_id?: number;
    partner_id?: number;
    rate_source?: string;
    load_matrix?: string;
    commodity_matrix?: string;
    accessorial_matrix?: string;
    discount?: number;
    currency?: string;
    ignore_cwt_rate_breaks_for_better_pricing?: boolean;
    mileage_system?: string;
    calculation_method?: string;
    salesman1?: string;
    salesman1_pay_type?: string;
    salesman1_rate?: number;
    salesman2?: string;
    salesman2_pay_type?: string;
    salesman2_rate?: number;
    collector?: string;
    mail_list?: boolean;
    send_210?: boolean;
    send_214?: boolean;
    other_bill_to?: string;
    invoice_style?: string;
    invoicing_method?: string;
    invoicing_email?: string;
    send_invoice_copies_to_invoicing_contacts?: boolean;
    send_invoices_as_pdf_attachment?: boolean;
    factor_invoices_for_this_customer?: boolean;
    hide_load_mileages_on_invoices?: boolean;
    do_not_send_statements_to_invoicing_email?: boolean;
    pre_billing_allowed?: boolean;
    backup_required?: boolean;
    send_all_load_scans_with_each_invoice?: boolean;
    original_documents_required?: boolean;
    bill_of_lading?: boolean;
    delivery_receipt?: boolean;
    purchase_order?: boolean;
    transport_agreement?: boolean;
    interchanges?: boolean;
    packing_slip?: boolean;
    scale_tickets?: boolean;
    load_receipts?: boolean;
    work_orders?: boolean;
}

interface BusinessPartnerInfo {
    partner_id?: number;
    type?: string;
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    toll_free?: string;
    fax?: string;
    email?: string;
    website?: string;
    dispatch_contact?: string;
    ar_contact?: string;
    other_contact?: string;
    account_number?: string;
    mail_list?: boolean;
    notes?: string;
    special_instructions?: string;
    partner_defaults: PartnerDefaults
}

interface State {
    businessPartnerList: BusinessPartnerInfo[]
}

export const useBusinessPartnerStore = defineStore('businessPartner', {
    state: (): State => ({
        businessPartnerList: [
            {
                partner_id: 1,
                type: "customer",
                name: "Customer 1",
                address1: "Customer Address 1",
                address2: "Customer Address 2",
                city: "Customer City",
                state: "Customer State",
                zip: "Customer Zip",
                phone: "Customer Phone",
                toll_free: "Customer Toll-Free",
                fax: "Customer Fax",
                email: "customer@example.com",
                website: "Customer Website",
                dispatch_contact: "Customer Dispatch Contact",
                ar_contact: "Customer AR Contact",
                other_contact: "Customer Other Contact",
                account_number: "Customer Account Number",
                mail_list: true,
                notes: "Customer Notes",
                special_instructions: "Customer Special Instructions",
                partner_defaults: {
                    default_id: 1,
                    partner_id: 1,
                    rate_source: "Default Rate Source",
                    load_matrix: "Default Load Matrix",
                    commodity_matrix: "Default Commodity Matrix",
                    accessorial_matrix: "Default Accessorial Matrix",
                    discount: 0.1,
                    currency: "USD",
                    ignore_cwt_rate_breaks_for_better_pricing: true,
                    mileage_system: "Default Mileage System",
                    calculation_method: "Default Calculation Method",
                    salesman1: "Default Salesman 1",
                    salesman1_pay_type: "Default Salesman 1 Pay Type",
                    salesman1_rate: 0.2,
                    salesman2: "Default Salesman 2",
                    salesman2_pay_type: "Default Salesman 2 Pay Type",
                    salesman2_rate: 0.3,
                    collector: "Default Collector",
                    mail_list: true,
                    send_210: true,
                    send_214: true,
                    other_bill_to: "Default Other Bill To",
                    invoice_style: "Default Invoice Style",
                    invoicing_method: "Default Invoicing Method",
                    invoicing_email: "default@example.com",
                    send_invoice_copies_to_invoicing_contacts: true,
                    send_invoices_as_pdf_attachment: true,
                    factor_invoices_for_this_customer: true,
                    hide_load_mileages_on_invoices: false,
                    do_not_send_statements_to_invoicing_email: true,
                    pre_billing_allowed: true,
                    backup_required: true,
                    send_all_load_scans_with_each_invoice: true,
                    original_documents_required: true,
                    bill_of_lading: true,
                    delivery_receipt: true,
                    purchase_order: true,
                    transport_agreement: true,
                    interchanges: true,
                    packing_slip: true,
                    scale_tickets: true,
                    load_receipts: true,
                    work_orders: true
                },
            },
            {
                partner_id: 2,
                type: "vendor",
                name: "Vendor 1",
                address1: "Vendor Address 1",
                address2: "Vendor Address 2",
                city: "Vendor City",
                state: "Vendor State",
                zip: "Vendor Zip",
                phone: "Vendor Phone",
                toll_free: "Vendor Toll-Free",
                fax: "Vendor Fax",
                email: "vendor@example.com",
                website: "Vendor Website",
                dispatch_contact: "Vendor Dispatch Contact",
                ar_contact: "Vendor AR Contact",
                other_contact: "Vendor Other Contact",
                account_number: "Vendor Account Number",
                mail_list: false,
                notes: "Vendor Notes",
                special_instructions: "Vendor Special Instructions",
                partner_defaults: {
                    default_id: 2,
                    partner_id: 2,
                    rate_source: "Default Rate Source",
                    load_matrix: "Default Load Matrix",
                    commodity_matrix: "Default Commodity Matrix",
                    accessorial_matrix: "Default Accessorial Matrix",
                    discount: 0.2,
                    currency: "USD",
                    ignore_cwt_rate_breaks_for_better_pricing: false,
                    mileage_system: "Default Mileage System",
                    calculation_method: "Default Calculation Method",
                    salesman1: "Default Salesman 1",
                    salesman1_pay_type: "Default Salesman 1 Pay Type",
                    salesman1_rate: 0.15,
                    salesman2: "Default Salesman 2",
                    salesman2_pay_type: "Default Salesman 2 Pay Type",
                    salesman2_rate: 0.25,
                    collector: "Default Collector",
                    mail_list: true,
                    send_210: true,
                    send_214: true,
                    other_bill_to: "Default Other Bill To",
                    invoice_style: "Default Invoice Style",
                    invoicing_method: "Default Invoicing Method",
                    invoicing_email: "default@example.com",
                    send_invoice_copies_to_invoicing_contacts: true,
                    send_invoices_as_pdf_attachment: true,
                    factor_invoices_for_this_customer: true,
                    hide_load_mileages_on_invoices: false,
                    do_not_send_statements_to_invoicing_email: true,
                    pre_billing_allowed: true,
                    backup_required: true,
                    send_all_load_scans_with_each_invoice: true,
                    original_documents_required: true,
                    bill_of_lading: true,
                    delivery_receipt: true,
                    purchase_order: true,
                    transport_agreement: true,
                    interchanges: true,
                    packing_slip: true,
                    scale_tickets: true,
                    load_receipts: true,
                    work_orders: true
                }
            }
        ]
    }),

    getters: {
        getBusinessPartnerList: (state) => { return state.businessPartnerList }
    },
    actions: {
        loadBusinessPartnerList() {
        },
    },
})
