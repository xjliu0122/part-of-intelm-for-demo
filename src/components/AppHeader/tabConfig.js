export default role => {
    let tab = [];
    switch (role) { //'user', 'bco', 'tc', 'dispatcher'
        case 'bco':
            tab = [
                {
                    label: 'dashboard',
                    route: '/dashboard',
                },
                {
                    label: 'jobs',
                    route: '/jobs',
                },
                {
                    label: 'quotes',
                    route: '/quotes',
                },
                {
                    label: 'Statement',
                    route: '/bcostatement',
                },
                {
                    label: 'settings',
                    route: '/setting',
                },
            ];
            break;
        case 'dispatcher':
            tab = [
                {
                    label: 'jobs',
                    route: '/jobs',
                },
                {
                    label: 'Trip Management',
                    route: '/dispatch',
                },
                {
                    label: 'quotes',
                    route: '/quotes',
                },
                {
                    label: 'manage client',
                    route: '/manageclient',
                },
                {
                    label: 'Cont Inventory',
                    route: '/invreport',
                },
                {
                    label: 'settings',
                    route: '/setting',
                },
            ];
            break;
        case 'tc':
            tab = [
                {
                    label: 'loads',
                    route: '/assignment',
                },
                {
                    label: 'assigned loads',
                    route: '/assignment/mc-dispatched',
                },
                {
                    label: 'search loads',
                    route: '/assignment/search',
                },
                {
                    label: 'payments',
                    route: '/assignment/payments',
                },
            ];
            break;
        default:
            tab = [
                {
                    label: 'setup',
                    route: '/setup',
                },

                {
                    label: 'setting',
                    route: '/setting',
                },
            ];
    }
    return tab;
};
