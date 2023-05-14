declare module "OTPModule" {
    function createNewOTP(
        phone: string,
        otp: string,
        key?: string,
        expiresAfter?: number,
        algorithm?: string
    ): string;

    function verifyOTP(
        phone: string,
        otp: string,
        hash: string,
        key?: string,
        algorithm?: string
    ): boolean;

    export { createNewOTP, verifyOTP };
}