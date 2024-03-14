import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Home } from './home';
import { EditCustomerGroups } from './editCustomerGroups';
import { CustomerList } from './customerList';
import { CustomerSearch } from './customerSearch';
import { EditValuedCustomer } from './editValuedCustomer';
import { Admin } from './admin';
import { EditMeeting } from './editMeeting';
import { Projects } from './projects';
import { EditProject } from './editProject';
import { CustomerContacts } from './customerContacts';
import { EditCustomerContact } from './editCustomerContact';
import { QuickRegister } from './quickRegister';
import { KilometerRegister } from './kilometerRegister';
import { EditCampaign } from './editCampaign';
import { BsFillChatRightDotsFill, BsCarFrontFill } from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { contactUs } from './requestHandler';
import { BrowserView } from 'react-device-detect';

var component;
export class App extends React.Component {
    constructor(props) {
        super(props);
        component = this;

        this.state = {
            logo: $('#logo').val(),
            color: $('#color').val(),
            company: $('#company').val(),
            companyId: $('#companyId').val(),
            adress: $('#adress').val(),
            username: $("#username").val(),
            workspaceId: $('#workspaceId').val(),
            reportId: $("#reportId").val(),
            isAdmin: $("#isAdmin").val(),
            isSuperUser: $("#isSuperUser").val(),
            isStoreUser: $("#isStoreUser").val(),
            isLightUser: $("#isLightUser").val(),
            isKilometersObliged: $("#isKilometersObliged").val(),
            salesReportId: $("#salesReportId").val(),
            storeReportId: $("#storeReportId").val(),
            salesReportId2: $("#salesReportId2").val(),
            showContactUs: false
        }
    }

    componentDidUpdate() {
        var url = window.location.href;

        if (url.includes("redirectTo=")) {
            var dest = url.split('redirectTo=')[1];
            if (dest == "customerGroups") {
                document.getElementById('customerGroups').click();
            }
            if (dest == "report") {
                document.getElementById('report').click();
            }
        }
    }

    componentDidMount() {

    }

    handleMenu() {
        var element = document.getElementById("navbarSupportedContent1");
        if (element.classList.contains("show")) {
            $("#menuButton").click();
        }
    }

    handleClose() {
        $("#contactFormSuccess").hide();
        component.setState({
            showContactUs: false,
        })
    }

    handleShow() {
        component.setState({
            showContactUs: true,
        })
    }

    sendContactUsForm() {

        $.when(contactUs($("#contactTitle").val(), $("#contactDescription").val())).then(function successHandler(status) {
            if (status) {
                $("#contactFormSuccess").show();
                $("#contactTitle").val("");
                $("#contactDescription").val("");
            }
            else {
                alert("Det gick inte att skicka meddelandet.");
                $("#contactFormSuccess").hide();
            }
        }.bind(this));
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-light light-blue lighten-4" style={{ backgroundColor: this.state.color, height: "70px" }}>
                    <a href="/" style={{height: "100%"}}><img src={window.location.origin + this.state.logo} style={{ height: "100%" }} /></a>
                    <div style={{ float: "right", display: "flex" }}>
                        <div id="spinner" style={{ marginTop: "7px", display:"none" }} className="spinner-border text-light" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        {this.state.isAdmin == "True" ? (
                            <BrowserView>
                                <div style={{margin: "10px", color: "white"}}>
                                    <a id="adminLink" href="/" style={{color: "white"}}>Admin</a>
                                </div>
                            </BrowserView>
                        ):(<div> </div>)}
                        <div className="username" style={{ color: "white", margin: "10px" }}>{this.state.username}</div>
                        {this.state.isKilometersObliged == "True" || this.state.isAdmin == "True" ?
                            (<a href="/?kilometerregister"> 
                                <BsCarFrontFill style={{color: "white", height: "100%", width: "40px"}}/>
                            </a>): (<div> </div>)
                        }
                        <button id="menuButton" className="navbar-toggler toggler-example" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1"
                            aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation" style={{marginLeft: "10px"}}>
                            <span className="dark-blue-text">
                                <i className="fas fa-bars fa-1x" style={{ color: "white", fontSize: "34px" }}></i>
                            </span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent1" style={{ backgroundColor: "#f7f7f7", textAlign: "center", marginTop: "8px", zIndex: "1", borderBottom: "2px solid black" }}>
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/" onClick={() => this.handleMenu()}>START</Link>
                            </li>
                            {this.state.isStoreUser == "True" ?
                                (
                                    <React.Fragment>
                                        {this.state.companyId == '5eb7b09b-105a-4160-96b5-95b0353efcee' &&
                                            <li className="nav-item">
                                                <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.storeReportId} onClick={() => this.handleMenu()}>BUTIKSRAPPORT</a>
                                            </li>
                                        }
                                    </React.Fragment>
                                ) :
                                (
                                    <React.Fragment>
                                        {this.state.isAdmin == "True" || this.state.isSuperUser == "True" ?
                                            (
                                                <React.Fragment>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/CustomerSearch" onClick={() => this.handleMenu()}>PROJEKT & KUNDAKTIVITETER</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/CustomerContacts" onClick={() => this.handleMenu()}>KUNDKONTAKTER</Link>
                                                    </li>
                                                    <hr style={{ width: "100%", borderTop: "1px solid lightgray", margin: "0" }} />
                                                </React.Fragment>
                                            ) :
                                            (
                                                <li> </li>
                                            )
                                        }
                                        {this.state.isLightUser == "True" ?
                                            (
                                                <React.Fragment>
                                                    <li className="nav-item">
                                                        <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.reportId} onClick={() => this.handleMenu()}>KUNDANALYS (Intern)</a>
                                                    </li>
                                                    {this.state.companyId == '23c5b39f-6ea9-4e9b-b20a-27606982c79e' &&
                                                        <li className="nav-item">
                                                            <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.salesReportId} onClick={() => this.handleMenu()}>KUNDANALYS (Slutkund)</a>
                                                        </li>
                                                    }
                                                    {this.state.companyId == '5eb7b09b-105a-4160-96b5-95b0353efcee' &&
                                                        <li className="nav-item">
                                                            <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.salesReportId2} onClick={() => this.handleMenu()}>KUNDANALYS (Extern)</a>
                                                        </li>
                                                    }
                                                </React.Fragment>
                                            ) :
                                            (
                                                <React.Fragment>
                                                    <li className="nav-item">
                                                        <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.reportId} onClick={() => this.handleMenu()}>KUNDANALYS (Intern)</a>
                                                    </li>
                                                    {this.state.companyId == '5eb7b09b-105a-4160-96b5-95b0353efcee' &&
                                                        <li className="nav-item">
                                                            <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.salesReportId2} onClick={() => this.handleMenu()}>KUNDANALYS (Extern)</a>
                                                        </li>
                                                    }
                                                    {this.state.companyId == '7f011702-09b2-4fc3-8f94-3033436a6fc5' &&
                                                        <li className="nav-item">
                                                            <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.salesReportId} onClick={() => this.handleMenu()}>KUNDANALYS (Extern)</a>
                                                        </li>
                                                    }
                                                    {this.state.companyId == '1133f4a4-c61f-4131-bfcd-183192f766bd' &&
                                                        <li className="nav-item">
                                                            <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.salesReportId} onClick={() => this.handleMenu()}>KUNDANALYS KUND</a>
                                                        </li>
                                                    }
                                                    {this.state.companyId == '23c5b39f-6ea9-4e9b-b20a-27606982c79e' &&
                                                        <li className="nav-item">
                                                            <a id="report" className="nav-link" href={"/Reports/Index?workspaceId=" + this.state.workspaceId + "&reportId=" + this.state.salesReportId} onClick={() => this.handleMenu()}>KUNDANALYS (Slutkund)</a>
                                                        </li>
                                                    }
                                                </React.Fragment>
                                            )
                                        }
                                    </React.Fragment>
                                )
                            }
                            <hr style={{ width: "100%", borderTop: "1px solid lightgray", margin: "0" }} />
                            <li>
                                <a className="nav-link" href="/MicrosoftIdentity/Account/SignOut">LOGGA UT</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container" style={{ minHeight: "700px" }}>
                    <Route exact path="/" component={Admin} />
                    <Route exact path="/Admin" component={Admin} />
                    <Route exact path="/CustomerList" component={CustomerList} />
                    <Route exact path="/CustomerSearch" component={CustomerSearch} />
                    <Route exact path="/CustomerContacts" component={CustomerContacts} />
                    <Route path="/CustomerGroups/EditCustomerGroups/:id">
                        <EditCustomerGroups />
                    </Route>
                    <Route path="/Customer/EditValuedCustomer/:id">
                        <EditValuedCustomer />
                    </Route>
                    <Route path="/EditMeeting/:customerId/:date">
                        <EditMeeting />
                    </Route>
                    <Route path="/EditProject/:customerId/:projectId">
                        <EditProject />
                    </Route>
                    <Route path="/Projects/:id">
                        <Projects />
                    </Route>
                    <Route path="/EditCustomerContact/:customerId/:id">
                        <EditCustomerContact />
                    </Route>
                    <Route path="/Campaigns/EditCampaign/:id">
                        <EditCampaign />
                    </Route>
                    <Redirect from="*" to path="/" />
                </div>
                <footer className="text-center text-lg-start" style={{ backgroundColor: this.state.color, color: "white"}}>
                    <div className="container p-4">                
                        <div className="row">                       
                            <div className="col-lg-6 col-md-12">
                                <div style={{ height: "50%" }}>
                                    <img src={window.location.origin + this.state.logo} style={{ height: "100%", maxHeight: "100px" }} />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <p>
                                    { this.state.adress}
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
                <div style={{ position: "fixed", right:"10px", top:"70%" }}>
                    <BsFillChatRightDotsFill style={{ fontSize: "40px", color: "black", marginTop: "7px", cursor: "pointer" }} onClick={() => { this.handleShow() }}/>
                </div>
                <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }} show={this.state.showContactUs} onHide={this.handleClose}>
                    <Modal.Header style={{ backgroundColor: this.state.color, textAlign: "center" }} >
                        <Modal.Title style={{ color: "white", width: "100%" }}>Kontakta support</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="contactFormSuccess" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                            <h4>Meddelandet har skickats. Vi återkopplar så snart vi kan.</h4>
                        </div>
                        <div className="col-sm-12">
                            <label>Rubrik</label>
                            <input id="contactTitle" className="form-control" />
                        </div>
                        <div className="col-sm-12">
                            <label>Meddelande</label>
                            <textarea id="contactDescription" className="form-control" />
                        </div>             
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Stäng
                        </Button>
                        <Button variant="primary" style={{ backgroundColor: this.state.color }} onClick={() => { this.sendContactUsForm() }}>
                            Skicka
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

if (window.location.href.includes("quickregister")) {
    window.onload = () => {
        ReactDOM.render(<BrowserRouter>
            <QuickRegister />
        </BrowserRouter>, document.getElementById("content"));
    }
}
else if (window.location.href.includes("kilometerregister")) {
    window.onload = () => {
        ReactDOM.render(<BrowserRouter>
            <KilometerRegister />
        </BrowserRouter>, document.getElementById("content"));
    }
}
else {
    window.onload = () => {
        ReactDOM.render(<BrowserRouter>
            <App />
        </BrowserRouter>, document.getElementById("content"));
    }
}

