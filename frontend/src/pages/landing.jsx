import React from 'react';
import {Link, useNavigate} from "react-router-dom";
export default function Landing() {
    const router = useNavigate();
    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>Face Flow Call</h2>
                </div>
                <div className='navlist'>
                   <p onClick={()=>{router("/home/sdsd")}}>Join as Guest</p>
                    <p onClick={()=>{router("/auth")}}>Register</p>
                    <div onClick={()=>{router("/auth")}} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div>
                    <h2><span style={{color:"#FF9839"}}>Connect</span> with your Loved Ones</h2>
                    <p>Cover a distance by Face Flow Call </p>
                    <div role="button">
                    <Link to={"/auth"}>Get Started</Link>
                    </div>
                    </div>
                <div>
                    <img src="mobile.png" alt="" />
                </div>
            </div>
        </div>

    );
}

