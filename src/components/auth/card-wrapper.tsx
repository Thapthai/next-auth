"use client";

import { useRouter } from "next/navigation";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backbuttonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backbuttonHref,
     
}: CardWrapperProps) => {
    const router = useRouter();

    const registerOnClick = () => router.push(backbuttonHref)

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <h1 className="text-4xl text-center font-thin my-5">{headerLabel} </h1>

            <div className="bg-white rounded-lg overflow-hidden shadow-2xl"></div>
            {children}
            <div className="flex justify-between p-8 text-sm border-t border-gray-200 bg-white">
                <a href="#" onClick={registerOnClick} className="font-medium text-indigo-500">{backButtonLabel}</a>
                <a href="#" className="text-gray-600">ลืมรหัสผ่าน ?</a>

   

            </div>
        </div>
    )

}
export default CardWrapper;