import ForgetPasswordForm from "@/components/auth/forget-password-form";

export const forgetPasswarodPage = () => {

    return (
        <div className="container mx-auto p-8 flex">
            <div className="max-w-md w-full mx-auto">
                <ForgetPasswordForm />
            </div>
        </div>
    );
}

export default forgetPasswarodPage