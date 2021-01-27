/*
    A class for the navigation bar that appears on the side of the dashboard.
*/

import React, {Component} from 'react'
import {isMobile} from 'react-device-detect';
import {Container, Button, Row, Navbar, Nav} from 'react-bootstrap';

import {connect} from "react-redux";
import store from "../../Redux/store";
import {LogOutUser} from "../../Redux/Actions/authAction";
import scheduleIcon from '../../icons/appointment.png';
import dashboardIcon from '../../icons/dashboard2.png';
import myAccountIcon from '../../icons/myAccount.png';
import logoutIcon from '../../icons/logout.png';

import '../../componentsStyle/Sidebar.css';


class Sidebar extends Component {
    render() {
        var itemClass = "sidebar-items";
        var activeItemClass = itemClass + " sidebar-active-item"; //Highlight nav link when on page
        var iconClass = "sidebar-icon";
        var navLinkClass = "sidebar-item-text";

        if (isMobile) { //Adjust on mobile devices
            return (
                <Navbar bg="dark" expand="lg" variant="dark">
                    <Navbar.Brand style={{ color: "white" }} 
                        onClick={() => {
                            this.props.history.push('/user');
                            window.location.reload();
                        }}
                    >Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav"> {/* Hamburger menu */}
                        <Nav className="mr-auto">
                            <Nav.Link onClick={() => this.props.history.push("/user/schedule") }>Treatment Schedule</Nav.Link>
                            <Nav.Link onClick={() => this.props.history.push("/user/myAccount")}>My Account</Nav.Link>
                            <Nav.Link onClick={() => {
                                store.dispatch(LogOutUser());
                                window.location.href = "/";
                            }}>Log out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
        else {
            return (
                <div className="sidebar">
                    {/* Upload Image Button */}
                    <div>
                        <Button className="new-appointment-button"
                            onClick={() => {
                                this.props.history.push('/upload');
                                window.location.reload();
                            }}
                        >+ Upload Image</Button>
                    </div>

                    {/* Nav Options - Highlight when seleected */}
                    <Container className="main-sidebar-options">
                        {/* Dashboard */}
                        <Row className={window.location.pathname === "/user" ? activeItemClass : itemClass}>
                            <span onClick={() => this.props.history.push("/user")}>
                                <img src={dashboardIcon} alt="Dashboard-Icon" className={iconClass}></img>
                                <h6 className={navLinkClass}>Dashboard</h6>
                            </span>
                        </Row>

                        {/* Treatment Schedule */}
                        <Row className={window.location.pathname === "/user/schedule" ? activeItemClass : itemClass}>
                            <span onClick={() => this.props.history.push("/user/schedule")}>
                                <img src={scheduleIcon} alt="Schedule-Icon" className={iconClass}></img>
                                <h6 className={navLinkClass}>Treatment Schedule</h6>
                            </span>
                        </Row>

                        {/* My Account */}
                        <Row className={window.location.pathname === "/user/myAccount" ? activeItemClass : itemClass}>
                            <span onClick={() => this.props.history.push("/user/myAccount")}>
                                <img src={myAccountIcon} alt="Account-Icon" className={iconClass}></img>
                                <h6 className={navLinkClass}>My Account</h6>
                            </span>
                        </Row>

                        {/* Log out */}
                        <Row className={itemClass}>
                            <span onClick={() => {
                                store.dispatch(LogOutUser());
                                window.location.href = "/";
                            }}>
                                <img src={logoutIcon} alt="Log-Out-Icon" className={iconClass}></img>
                                <h6 className={navLinkClass}>Log Out</h6>
                            </span>
                        </Row>
                    </Container>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Sidebar);