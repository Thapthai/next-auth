import RegisterForm from "@/components/auth/register-form";

export const RegisterPage = () => {

    return (
        <div className="container mx-auto p-8 flex">
            <div className="max-w-md w-full mx-auto">
                <RegisterForm />
            </div>
        </div>
    );
}

export default RegisterPage