import { ChangeEventHandler } from "react";

export const InputText = ({
    value,
    onChange,
    label,
}: {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    label: string;
}) =>
{
    return <>
        <div className="poly-input">
             <div className="input-label">{label}</div>
            <input className="input"
                onChange={onChange}
                value={value}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
            />
        </div>
    </>;
};
