export interface User{
    id: number;
    uname: string;
    pass: string;
    isAdmin: boolean;
    isLoggedIn: boolean;
    profile: {
        fname: string;
        mname: string;
        lname: string;
        email: string;
        mobile: number;
        bdate: number;
        interests: string[];
    };
}
