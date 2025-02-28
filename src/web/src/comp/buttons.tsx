import { ReactNode, useState } from "react";

/**
 * A button component.
 */
export const Btn = ({
    onClick,
    children,
    disabled = undefined,
    className = undefined,
}: {
    onClick: () => Promise<unknown>;
    children: ReactNode;
    disabled?: boolean;
    className?: string;
}) =>
{
    const [working, setIsWorking] = useState(false);

    disabled = disabled || working;

    const handleClick = async () => {
        try {
            setIsWorking(true);
            await onClick();
        } finally {
            setIsWorking(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`btn ${working ? "working" : ""} ${className ?? ""}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
