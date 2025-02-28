import { useAppContext } from "../app/context";

export const PageHome = () =>
{
    const { header } = useAppContext();
    return <>
        {header}

        <div id="page-home" className="page-regular">
            <div className="page-content">
                <div className="page-title">
                    HOME
                </div>
            </div>
        </div>
    </>;
};
