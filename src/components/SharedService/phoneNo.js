export default {
    formatPhoneNumber: s => {
        const s2 = `${s}`.replace(/\D/g, '');
        const m = s2
            .replace(/[^\d]+/g, '')
            .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        return m || '';
    },
    getValueFromMaskedPhoneNumber: s => {
        const s2 = `${s}`.replace(/\D/g, '');
        return s2 || '';
    },
};
