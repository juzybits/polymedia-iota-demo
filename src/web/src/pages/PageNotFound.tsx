import { Header } from "../comp/header";

export const PageNotFound = () =>
{
    return <>
        <Header />
        <div id="page-not-found" className="page-regular">
            <div className="page-content">
                <div className="page-title">
                    Page not found
                </div>
            </div>
        </div>
    </>;
};
