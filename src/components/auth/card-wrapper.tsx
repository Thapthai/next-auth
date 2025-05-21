"use client";

import Link from "next/link";

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
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <h1 className="text-4xl text-center font-thin my-5">{headerLabel}</h1>

            {children}

            <div className="flex justify-between p-8 text-sm border-t border-gray-200 bg-white">
                <Link href={leftButtonHref} className="font-medium text-indigo-500">
                    {leftButtonLabel}
                </Link>
                {rightButtonLabel && (
                    <Link href={rightButtonHref} className="text-gray-600">
                        {rightButtonLabel}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default CardWrapper;
