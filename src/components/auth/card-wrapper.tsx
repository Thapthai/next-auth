"use client";

import { useRouter } from "next/navigation";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    leftButtonLabel: string;
    leftButtonHref: string;
    showSocial?: boolean;
    rightButtonHref: string;
    rightButtonLabel?: string;
}

export const CardWrapper = ({
    children,
    headerLabel,
    leftButtonLabel,
    leftButtonHref,
    rightButtonHref,
    rightButtonLabel,


}: CardWrapperProps) => {
    const router = useRouter();

    const leftOnClick = () => router.push(leftButtonHref)
    const rightOnClick = () => router.push(rightButtonHref)

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <h1 className="text-4xl text-center font-thin my-5">{headerLabel} </h1>

            <div className="bg-white rounded-lg overflow-hidden shadow-2xl"></div>
            {children}
            <div className="flex justify-between p-8 text-sm border-t border-gray-200 bg-white">
                <a href="#" onClick={leftOnClick} className="font-medium text-indigo-500">{leftButtonLabel}</a>
                <a href="#" onClick={rightOnClick} className="text-gray-600">{rightButtonLabel}</a>
            </div>
        </div>
    )

}
export default CardWrapper;