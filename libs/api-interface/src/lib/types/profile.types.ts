interface IProfileBase {
    username: string;
    email: string;
}

export interface IProfile extends IProfileBase {
    profilePicture: string;
}

export interface IProfileUpdate extends IProfileBase {
    password: string;
}