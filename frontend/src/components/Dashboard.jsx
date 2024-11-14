import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const DashboardPage = (props) => {

    const navigate = useNavigate();

    useEffect(() => {
        const userName = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        if (!token || token === "null" || token === "undefined") {
            navigate("/");
        } else {
            setUser(userName);
        }
    }, [navigate]);
    
    const [user, setUser] = useState('Keshava');

    return <>
    <div className="card">
        <div className="card-header">
            <div className="row justify-content-evenly">
                <div className="col">Home</div>
                <div className="col"> <Link to="/employee-list">Employee List</Link> </div>
                <div className="col">{ user }</div>
                <div className="col"> <a href="/" > Logout </a>  </div>
            </div>
        </div>
        <div className="bg-warning-subtle"> Dashboard </div>

        <div className="card-body">
            <div>
                Welcome Admin Panel
            </div>
        </div>
    </div>
    </>
}

export {
    DashboardPage
}