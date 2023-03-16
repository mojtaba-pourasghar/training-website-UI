import { Fragment } from "react";
//import MainHeader from "./main-header";


function UserLayout(probs){

    return <Fragment>
        
        <main>
            {probs.children}
        </main>
    </Fragment>

}

export default UserLayout;