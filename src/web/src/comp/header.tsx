import { Link } from "react-router-dom";

import { useAppContext } from "../app/context";

export const Header = () =>
{
    const { network } = useAppContext();
    return (
    <header>
        <div className="header-item">
            <Link to="/">
                IOTA DEMO
                <span className="header-network-label">{network}</span>
            </Link>
        </div>
    </header>);
};
