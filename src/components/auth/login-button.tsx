"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChildren?: boolean
};

export const LogingButton = ({
    children,
    mode = "redirect", // default mode redirect
    asChildren
}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {

        router.push('/login');
    }

    if (mode === "modal") {
        return (
            <span>
                Todo Imprement modal
            </span>
        )
    }

    return (
        <span onClick={onClick} >
            {children}
        </span>
    )

}

export default LogingButton;