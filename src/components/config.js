export default {
    businessCategoty: [
        {
            Name: 'Shipper/Consignee',
        },

        {
            Name: 'Importer/Exporter',
        },
        {
            Name: '3 PL',
        },
        {
            Name: 'Customs Broker',
        },
        {
            Name: 'Freight Broker',
        },
        {
            Name: 'Container Terminal',
        },

        {
            Name: 'Ocean Carrier',
        },
        {
            Name: 'Others',
        },
    ],
    businessTypeOptions: [
        {
            Name: 'Sole Proprietor',
        },
        {
            Name: 'Corporation',
        },
        {
            Name: 'LLC',
        },
        {
            Name: 'LLP',
        },
    ],
    servedArea: [
        {
            Name: 'AL',
        },
        {
            Name: 'CA',
        },
        {
            Name: 'LA',
        },
        {
            Name: 'PA',
        },
    ],
    operationPorts: [
        {
            Name: 'San Diego Port',
        },
        {
            Name: 'Long beach Port',
        },
        {
            Name: 'Los Angeles Port',
        },
        {
            Name: 'Oakland Port',
        },
    ],
    loadingOptions: ['Live', 'Drop & Hook', 'Drop & Pickup later'],
    // ContainerTypes: [
    //     { code: '22G1', description: '20 Dry', noDimension: true },
    //     { code: '42G1', description: '40 Dry', noDimension: true },
    //     { code: '45G1', description: '40 High Cube' },
    //     { code: '22U1', description: '20 Open Top' },
    //     { code: '42U1', description: '40 Open Top' },
    //     { code: '22P1', description: '20 Flat Fixed' },
    //     { code: '22P3', description: '20 Flat Collapsible' },
    //     { code: '42P1', description: '40 Flat Fixed' },
    //     { code: '42P3', description: '40 Flat Collapsible' },
    //     { code: '22R1', description: '20 Reefer' },
    //     { code: '42R1', description: '40 Reefer High Cube' },
    //     { code: '2CG1', description: '20 Palletwide' },
    //     { code: '4CG1', description: '40 Palletwide' },
    //     { code: '4EG1', description: '40 HC Palletwide' },
    //     { code: '53', description: 'Domestic Container (Dry & Refer)' },
    //     { code: 'Flatbed', description: 'Flatbed' },
    //     { code: 'Lowboy', description: 'Lowboy' },
    //     { code: 'Step Deck', description: 'Step Deck' },
    //     { code: 'Extendable', description: 'Extendable' },
    //     {
    //         code: 'Stretch Single Drop Deck',
    //         description: 'Stretch Single Drop Deck',
    //     },
    //     {
    //         code: 'Stretch Double Drop Deck',
    //         description: 'Stretch Double Drop Deck',
    //     },
    //     {
    //         code: 'Extendable Double Drop',
    //         description: 'Extendable Double Drop',
    //     },
    //     { code: 'RGN', description: 'Removable Gooseneck' },
    //     { code: 'Stretch RGN', description: 'Stretch Removable Gooseneck' },
    //     { code: 'Conestoga', description: 'Conestoga' },
    //     { code: 'Side Kit', description: 'Side Kit' },
    //     { code: 'Other', description: 'Other equipment type' },
    // ],
    ContainerTypes: [
        {
            code: "40' Standard Dry",
            description: "40' Standard Dry",
            noDimension: true,
        },
        {
            code: "20' Standard Dry",
            description: "20' Standard Dry",
            noDimension: true,
        },
        {
            code: "45' High Cube Dry",
            description: "45' High Cube Dry",
            noDimension: true,
        },
        {
            code: "53' Domestic Container",
            description: "53' Domestic Container",
            noDimension: true,
        },
        {
            code: "40' Standard Reefer",
            description: "40' Standard Reefer",
            noDimension: true,
        },
        {
            code: "20' Standard Reefer",
            description: "20' Standard Reefer",
            noDimension: true,
        },
        {
            code: "45' High Cube Reefer",
            description: "45' High Cube Reefer",
            noDimension: true,
        },
        {
            code: "40' Tank Container",
            description: "40' Tank Container",
            noDimension: true,
        },
        {
            code: "20' Tank Container",
            description: "20' Tank Container",
            noDimension: true,
        },
        {
            code: 'Others',
            description: 'Other-specify in instruction',
            noDimension: true,
        },
    ],

    ContainerUnitOptions: ['in', 'cm', 'ft', 'm'],
    locationTypes: ['Port', 'Business', 'Tradeshow', 'Residential'],
    CustomsOptions: ['Pending', 'Under Exam', 'Cleared'],
    TripTypeOptions: [
        'terminal',
        'consignee',
        'dray-yard',
        'stopover',
        'street-turn',
        'shipper',
    ],
    TripActionOptions: [
        'pick-up empty',
        'pick-up load',
        'drop-off load',
        'drop-off empty',
    ],
    MCCreditNoteTypes: [
        'Freight Charge',
        'Fuel Surcharge',
        'Waiting Time',
        'Dryrun Fee',
        'Stop‐Off Fee',
    ],

    APTypes: [
        'Driver Piece Count Exp.',
        'Waiting Time (Power Detention) Exp.',
        'Layover Exp.',
        'Split Chassis Exp.',
        'Detention Exp.',
        'Chassis Exp.',
        'Driver Assist Exp.',
        'Tri-alxe Exp.',
        'Freight Exp.',
        'Storage Exp.',
        'Stop-off Exp.',
        'Scale Exp.',
        'Driver Sweep Exp.',
        'Switcher Work Exp.',
        'Night Delivery Exp.',
        'Other Service Exp.',
        'Lumper (Unloading) Exp.',
        'Flip Exp.',
        'Driver Pallet Count Exp.',
        'Dry-run (Bobtail Run) Exp.',
        'Haz-mat Exp.',
        'Demurrage Exp.',
        'Driver Wash-out Exp.',
        'Fuel Surcharge Exp.',
        'Dunnage Disposal Exp.',
        'Diversion Exp.',
        'GVW Citation Exp.',
    ],

    ARTypes: [
        'Diversion Chg.',
        'Demurrage',
        'Detention Chg',
        'Special Discount',
        'Freight Chg.',
        'Hours',
        'Haz-mat Chg.',
        'Driver Count (Pallet) Fee',
        'GVW Citation Service Chg.',
        'Lumper (Unloading) Fee',
        'Night Delivery Fee',
        'Driver Assist Fee',
        'Other Service Chg.',
        'Pre-pull (Yard-pull) Chg.',
        'Dryrun (Bobtail) Chg.',
        'GVW Citation',
        'Driver Count (Piece) Fee',
        'Dunnage Disposal Chg.',
        'Split Chassis Chg.',
        'Driver Clean (Sweep) Fee',
        'Stop Off Chg.',
        'Driver Layover Fee',
        'Driver Clean (Wash-out) Fee',
        'Switcher Work Chg.',
        'Scale Chg.',
        'Tri-Axle Chg.',
        'Flip Chg.',
        'Chassis Chg.',
        'Fuel Surcharge (FSC)',
        'Scale Service Fee',
        'Waiting Time (Power Detention) Chg.',
        'Storage Chg',
    ],
    JobStatusSelectionCriteria: [
        {
            label: 'All',
            value: '',
        },
        {
            label: 'New',
            value: 'New',
        },
        {
            label: 'Active',
            value: 'Active',
        },
        {
            label: 'Complete',
            value: 'Complete',
        },
    ],
    JobTypeSelectionCriteria: [
        {
            label: 'All',
            value: '',
        },
        {
            label: 'Import',
            value: 'Import',
        },
        {
            label: 'Export',
            value: 'Export',
        },
        {
            label: 'Cross Town',
            value: 'Cross Town',
        },
    ],
    QuoteStatusSelectionCriteria: [
        {
            label: 'All',
            value: '',
        },
        {
            label: 'New',
            value: 'New',
        },
        {
            label: 'Quoted',
            value: 'Quoted',
        },
        {
            label: 'Booked',
            value: 'Booked',
        },
    ],
    QuoteTypeSelectionCriteria: [
        {
            label: 'All',
            value: '',
        },
        {
            label: 'Import',
            value: 'Import',
        },
        {
            label: 'Export',
            value: 'Export',
        },
        {
            label: 'Cross Town',
            value: 'Cross Town',
        },
    ],
    noCancelAssginment: ['En Route', 'Complete'],
    TripStatusSelectionCriteria: [
        {
            label: 'All',
            value: '',
        },
        {
            label: 'New',
            value: 'New',
        },
        {
            label: 'Active',
            value: 'Active',
        },
        {
            label: 'Sent',
            value: 'Sent',
        },
        {
            label: 'No Bid',
            value: 'No Bid',
        },
        {
            label: 'Has Bid',
            value: 'Has Bid',
        },
        {
            label: 'Assigned',
            value: 'Assigned',
        },
        {
            label: 'Retracted',
            value: 'Retracted',
        },
        {
            label: 'Delay',
            value: 'Delay',
        },
        {
            label: 'En Route',
            value: 'En Route',
        },
        {
            label: 'Complete',
            value: 'Complete',
        },
    ],
};
