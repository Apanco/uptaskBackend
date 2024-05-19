interface I_Email {
    email: string;
    name: string;
    token: string;
}
export declare class AuthEmail {
    static senConfirmationEmail: (user: I_Email) => Promise<void>;
    static sendPasswordResetToken: (user: I_Email) => Promise<void>;
}
export {};
