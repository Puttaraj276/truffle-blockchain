import React from 'react';
import { Link } from 'react-router-dom';

const ViewCaseNav = (props) => {
    const { crimeId } = props;
    const url = `/crimedata/forensics/${crimeId}`;

    return (
        <nav className="nav-wrapper grey darken-4 navbar">
            <div className="container">
                <b><Link to="/" className="brand-logo">Thadam</Link></b>
                <ul className="right">
                    <li><Link to="#">FIR Details</Link></li>
                    <li><Link to={url}>Forensic Reports</Link></li>
                    <li><Link to="#">Other Reports</Link></li>
                    <li><Link to="#">Crime Scene Photographs</Link></li>
                </ul>
            </div>
        </nav>
    );
};
export default ViewCaseNav;