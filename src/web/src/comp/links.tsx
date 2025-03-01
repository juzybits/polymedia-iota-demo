import { AnchorHTMLAttributes } from "react";

/**
 * An external link like:
 * `<a target='_blank' rel='noopener noreferrer nofollow' href={href}>{text}</a>`
 */
export const LinkExternal: React.FC<AnchorHTMLAttributes<HTMLAnchorElement> & {
    follow?: boolean;
    children: React.ReactNode;
}> = ({
    follow = true,
    children,
    ...props
}) => {
    const target = props.target ?? "_blank";
    const rel = props.rel ?? `noopener noreferrer ${follow ? "" : "nofollow"}`;
    return <a {...props} target={target} rel={rel}>
        {children}
    </a>;
};
