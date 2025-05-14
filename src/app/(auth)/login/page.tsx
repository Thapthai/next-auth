import LoginForm from "@/components/auth/login-form";

export const LoginPage = () => {

    return (
        <div className="container mx-auto p-8 flex">
            <div className="max-w-md w-full mx-auto">
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage