const userProfile = {
        uid: null,
        twic: null,
        role: null,
        position: null,
        phone: '',
        name: null,
        isAdmin: false,
        email: null,
        companyId: null,
        company: null,
    },
    _profileModel = {
        isRequesting: false,
        isUpdating: false,
        profile: userProfile,
    };

export const profileModel = _profileModel;
