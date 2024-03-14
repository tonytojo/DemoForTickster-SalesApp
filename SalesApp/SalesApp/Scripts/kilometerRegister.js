import React from "react";
import {
    getKmUnregisteredMeetingsForSalesman, registerKilometers, registerSupplierTravel, getSupplierTravelsForSalesman,
    getKmUnregisteredProspectMeetingsForSalesman, registerProspectKilometers, getRegisteredObjectForSalesman
} from "./requestHandler";
import Table from 'react-bootstrap/Table';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactPaginate from 'react-paginate';

var component;
export class KilometerRegister extends React.Component {
    constructor(props) {
        super(props);
        component = this;
        var curr = new Date();
        curr.setDate(curr.getDate());
        var date = curr.toISOString().substring(0, 10);

        this.state = {
            companyId: $('#companyId').val(),
            color: $('#color').val(),
            meetings: [],
            prospectMeetings: [],
            supplierTravels: [],
            registeredObjects: [],
            currentPage: 0, // Track the current page
            itemsPerPage: 8, // Set the number of items per page
        }

        $.when(getKmUnregisteredMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
            if (meetings != null) {
                meetings.sort((a, b) => new Date(b.date) - new Date(a.date));

                this.setState({
                    meetings: meetings
                })
            }
        }.bind(this));

        $.when(getKmUnregisteredProspectMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(prospectMeetings) {
            if (prospectMeetings != null) {
                prospectMeetings.sort((a, b) => new Date(b.date) - new Date(a.date));

                this.setState({
                    prospectMeetings: prospectMeetings
                })
            }
        }.bind(this));

        $.when(getSupplierTravelsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(supplierTravels) {
            if (supplierTravels != null) {
                supplierTravels.sort((a, b) => new Date(b.date) - new Date(a.date));

                this.setState({
                    supplierTravels: supplierTravels
                })
            }
        }.bind(this));

        $.when(getRegisteredObjectForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(objects) {
            if (objects != null) {
                objects.sort((a, b) => new Date(b.date) - new Date(a.date));

                this.setState({
                    registeredObjects: objects
                })
            }
        }.bind(this));

    }

    handlePageChange = (selectedPage) => {
        this.setState({ currentPage: selectedPage.selected });
    };

    renderMeetingTableItem(meeting) {
        var dateString = meeting.date.split('T')[0];

        return (
            <tr key={meeting.meetingId} className="tableRow">
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.customerName}</td>
                <td style={{ paddingTop: "18px" }}><input id={meeting.meetingId} className="form-control" type="number" /></td>
                <td style={{ paddingTop: "18px" }}>
                    <button onClick={() => { this.saveKilometers(meeting.meetingId) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Spara</button>
                </td>
            </tr>
        )
    }

    renderProspectMeetingTableItem(meeting) {
        var dateString = meeting.date.split('T')[0];

        return (
            <tr key={meeting.meetingId} className="tableRow">
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.prospectName}</td>
                <td style={{ paddingTop: "18px" }}><input id={meeting.meetingId} className="form-control" type="number" /></td>
                <td style={{ paddingTop: "18px" }}>
                    <button onClick={() => { this.saveProspectKilometers(meeting.meetingId) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Spara</button>
                </td>
            </tr>
        )
    }

    renderSupplierTravelTableItem(supplierTravel) {
        var dateString = supplierTravel.date.split('T')[0];

        return (
            <tr key={supplierTravel.id} className="tableRow">
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                <td style={{ paddingTop: "18px" }}>{supplierTravel.supplierName}</td>
                <td style={{ paddingTop: "18px" }}>{supplierTravel.kilometersDriven}</td>
                <td style={{ paddingTop: "18px" }}>
                    {supplierTravel.comments}
                </td>
            </tr>
        )
    }

    saveKilometers(meetingId) {
            $.when(registerKilometers($('#companyId').val(), meetingId, $("#" + meetingId).val())).then(function successHandler(status) {
                if (status) {
                    $.when(getKmUnregisteredMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
                        if (meetings != null) {
                            meetings.sort((a, b) => new Date(b.date) - new Date(a.date));

                            this.setState({
                                meetings: meetings
                            })
                        }
                    }.bind(this));
                    $.when(getRegisteredObjectForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(objects) {
                        if (objects != null) {
                            objects.sort((a, b) => new Date(b.date) - new Date(a.date));

                            this.setState({
                                registeredObjects: objects
                            })
                        }
                    }.bind(this));
                }
                else {
                    alert("Något gick fel.")
                }
            }.bind(this));
    }

    saveProspectKilometers(meetingId) {
        $.when(registerProspectKilometers($('#companyId').val(), meetingId, $("#" + meetingId).val())).then(function successHandler(status) {
            if (status) {
                $.when(getKmUnregisteredProspectMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(prospectMeetings) {
                    if (prospectMeetings != null) {
                        prospectMeetings.sort((a, b) => new Date(b.date) - new Date(a.date));

                        this.setState({
                            prospectMeetings: prospectMeetings
                        })
                    }
                }.bind(this));
                $.when(getRegisteredObjectForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(objects) {
                    if (objects != null) {
                        objects.sort((a, b) => new Date(b.date) - new Date(a.date));

                        this.setState({
                            registeredObjects: objects
                        })
                    }
                }.bind(this));
            }
            else {
                alert("Något gick fel.")
            }
        }.bind(this));
    }

    saveSupplierTravel() {
        $.when(registerSupplierTravel($('#companyId').val(), $('#userId').val() )).then(function successHandler(status) {
            if (status) {
                $("#date").val("");
                $("#supplier").val("");
                $("#kilometer").val("");
                $("#comment").val("");
                $.when(getSupplierTravelsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(supplierTravels) {
                    if (supplierTravels != null) {
                        supplierTravels.sort((a, b) => new Date(b.date) - new Date(a.date));

                        this.setState({
                            supplierTravels: supplierTravels
                        })
                    }
                }.bind(this));
                $.when(getRegisteredObjectForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(objects) {
                    if (objects != null) {
                        objects.sort((a, b) => new Date(b.date) - new Date(a.date));

                        this.setState({
                            registeredObjects: objects
                        })
                    }
                }.bind(this));
            }
            else {
                alert("Något gick fel.")
            }
        }.bind(this));
    }

    renderRegisteredTableItem(meeting) {
        var dateString = meeting.date.split('T')[0];

        return (
            <tr key={meeting.meetingId} className="tableRow">
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.name}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.type}</td>
                <td style={{ paddingTop: "18px" }}><input value={meeting.kilometersDriven} className="form-control" type="number" disabled/></td>
            </tr>
        )
    }

    render() {
        const { currentPage, itemsPerPage } = this.state;
        // Calculate the index range for the current page
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return (
            <div className="col-sm-12">
                <div>
                    <nav className="navbar navbar-light light-blue lighten-4" style={{ backgroundColor: $('#color').val(), height: "70px" }}>
                        <a href="/" style={{ height: "100%" }}><img src={$('#logo').val()} style={{ height: "100%" }} /></a>
                        <div style={{ float: "right", display: "flex" }}>
                            <div className="username" style={{ color: "white", margin: "10px" }}> {$('#username').val()} </div>
                            <a id="prevLink" href="/"><i className="fas fa-arrow-circle-left" style={{ color: "white", fontSize: "44px" }}></i></a>
                        </div>
                    </nav>
                    <div className="container" style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px", textAlign: "center" }}>
                        <h2> Registrera antal körda kilometer </h2>
                        <Tabs>
                            <TabList>
                                <Tab>Översikt</Tab>
                                <Tab>Per kundaktivitet</Tab>
                                <Tab>Per prospektaktivitet</Tab>
                                <Tab>Leverantörsbesök</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="col-sm-12">
                                    <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                            <tr>
                                                <th>Datum</th>
                                                <th>Kund</th>
                                                <th>Typ</th>
                                                <th style={{ width: "10%" }}>Km</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ backgroundColor: "white" }}>
                                            {this.state.registeredObjects.slice(startIndex, endIndex).map(d => {
                                                return this.renderRegisteredTableItem(d);
                                            })}
                                        </tbody>
                                    </Table>
                                    {/* Pagination */}
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={Math.ceil(this.state.registeredObjects.length / itemsPerPage)}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageChange}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="col-sm-12">
                                    <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                            <tr>
                                                <th>Datum</th>
                                                <th>Kund</th>
                                                <th style={{ width: "10%" }}>Km</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ backgroundColor: "white" }}>
                                            {this.state.meetings.map(d => {
                                                return this.renderMeetingTableItem(d);
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="col-sm-12">
                                    <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                            <tr>
                                                <th>Datum</th>
                                                <th>Kund</th>
                                                <th style={{ width: "10%" }}>Km</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ backgroundColor: "white" }}>
                                            {this.state.prospectMeetings.map(d => {
                                                return this.renderProspectMeetingTableItem(d);
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="col-sm-12" style={{display: "flex"}}>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="col-sm-12">
                                            <label> Datum </label>
                                            <input id="date" type="date" className="form-control" />
                                        </div>
                                        <div className="col-sm-12">
                                            <label> Leverantör (fritext) </label>
                                            <input id="supplier" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="col-sm-12">
                                            <label> Antal kilometer </label>
                                            <input id="kilometer" className="form-control" type="number" />
                                        </div>
                                        <div className="col-sm-12">
                                            <label> Kommentar </label>
                                            <input id="comment" type="textarea" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <button id="saveContact" className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveSupplierTravel()}>Spara</button>
                                </div>
                                <div className="col-sm-12" style={{paddingTop: "10px"}}>
                                    <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                            <tr>
                                                <th>Datum</th>
                                                <th>Leverantör</th>
                                                <th style={{ width: "10%" }}>Kilometer</th>
                                                <th>Kommentar</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ backgroundColor: "white" }}>
                                            {this.state.supplierTravels.map(d => {
                                                return this.renderSupplierTravelTableItem(d);
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <footer class="text-center text-lg-start" style={{ backgroundColor: $('#color').val(), color: "white" }}>
                        <div class="container p-4">
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div style={{ height: "50%" }}>
                                        <img src={$('#logo').val()} style={{ height: "100%", maxHeight: "100px" }} />
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <p>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}
