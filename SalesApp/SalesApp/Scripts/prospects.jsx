import "core-js/stable";
import "regenerator-runtime/runtime";
import { BsFillTrashFill, BsInfoCircleFill } from 'react-icons/bs';

import React from "react";
import Table from 'react-bootstrap/Table';
import {
    getProspect,
    getAllProspects,
    saveProspect,
    saveProspectContact,
    getOptions,
    getRoles,
    getCompanyMembers,
    getProspectContactsSelect,
    saveProspectMeeting,
    removeProspectMeeting,
    getProspectContacts,
    convertToCustomer,
    getCompanyResponsiblesSelect
} from './requestHandler'
import Popup from 'reactjs-popup';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select'
import EditProspectMeetingModal from './editProspectMeetingModal';
import { Modal } from "react-bootstrap";
import EditProspectContactModal from './editProspectContactModal';
import { BsStarFill } from 'react-icons/bs';
import ReactTooltip from "react-tooltip";

var component;
export class Prospects extends React.Component {
    constructor(props) {
        super(props);
        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            color: $('#color').val(),
            prospects: [],
            selectedProspectId: null,
            isAddProspectOpen: false,
            isAddProspectContactOpen: false,
            prospectContactsSelect: [],
            selectedContacts: [],
            companyResponsiblesSelect: [],
            selectedCompanyResponsibles: [],
            options: [],
            roles: [],
            companyMembers: [],
            removeMeeting: null,
            showEditMeetingModal: false,
            meetingIdEditModal: null,
            customerIdEditModal: null,
            customerContacts: [],
            contactIdEditModal: null,
            showEditContactModal: false,
            isConvertOpen: false
        }

        $.when(getAllProspects(this.state.companyId).then(function successHandler(data) {
            if (data != undefined) {
                this.setState({
                    prospects: data
                })
            }
            else {
                "Något gick fel."
            }
        }.bind(this)));
        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));
    }

    renderProspect(prospect) {
        return (
            <tr key={prospect.id} className="tableRow" style={{ borderBottom: "1px solid black", borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{prospect.name}</td>
                <td style={{ width: "20%" }}>
                    <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.selectProspect(prospect.id)}>Välj</button>
                </td>
            </tr>
        )
    }

    selectProspect(prospectId) {
        $.when(getProspect(this.state.companyId, prospectId)).then(function successHandler(data) {
            this.setState({
                selectedProspectId: data.info.id,
                selectedProspect: data
            })
        }.bind(this));

        $.when(getProspectContactsSelect(this.state.companyId, prospectId)).then(function successHandler(data) {
            if (data != undefined) {
                this.setState({
                    prospectContactsSelect: data
                })
            }
            else {
            }
        }.bind(this));

        $.when(getOptions($('#companyId').val())).then(function successHandler(options) {
            if (options != undefined) {
                this.setState({
                    options: options
                })
            }
            else {
            }
        }.bind(this));

        $.when(getRoles($('#companyId').val())).then(function successHandler(roles) {
            if (roles != undefined) {
                this.setState({
                    roles: roles
                })
            }
            else {
            }
        }.bind(this));

        $.when(getCompanyMembers()).then(function successHandler(data) {
            if (data != undefined) {
                this.setState({
                    companyMembers: data.sort((a, b) => (a.name > b.name) ? 1 : -1)
                }, () => {
                        this.setSelected();
                })
            }
            else {
            }
        }.bind(this));

        $.when(getProspectContacts(this.state.companyId, prospectId)).then(function successHandler(data) {
            this.setState({
                customerContacts: data
            })
        }.bind(this));
    }

    setSelected() {
        $('#meetingProspectResponsible').val($('#userId').val())
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'prospectName':
                    this.prospectDescriptionInput.focus();
                    break;
                case 'prospectDescription':
                    this.prospectSaveButton.focus();
                    break;
                default:
                    break;
            }
        }
    };

    save() {
        if ($("#prospectName").val() == "" || $("#prospectName").val() == null) {
            alert("Namn måste fyllas i.");
        }
        else {
            $.when(saveProspect(this.state.companyId, $("#prospectName").val(), $("#prospectDescription").val())).then(function successHandler(status) {
                if (status) {
                    $.when(getAllProspects(this.state.companyId)).then(function successHandler(prospects) {
                        if (prospects != undefined) {
                            $("#spinner").hide();
                            $("#prospectName").val("");
                            $("#prospectDescription").val("");
                            this.setState({
                                prospects: prospects
                            });
                            setTimeout(function () {
                                $("#valueSuccessProspect").hide();
                            }, 2000);

                            setTimeout();
                        }
                        else {
                            $("#spinner").hide();
                        }
                    }.bind(this));
                }
                else {
                    alert("Kunde inte spara prospekten. Detta kan bero på att namnet redan finns på ett annat prospekt.")
                }
            }.bind(this));
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'contactProspectFirstName':
                    this.contactLastNameInput.focus();
                    break;
                case 'contactProspectLastName':
                    this.contactEmailInput.focus();
                    break;
                case 'contactProspectEmail':
                    this.contactTelephoneInput.focus();
                    break;
                case 'contactProspectTelephone':
                    this.contactRoleInput.focus();
                    break;
                case 'contactProspectRole':
                    //this.contactSaveButton.focus();
                    break;
                default:
                    break;
            }
        }
    };

    saveContact() {
            $.when(saveProspectContact(this.state.selectedProspect.info.id, this.state.companyId)).then(function successHandler(status) {
                if (status) {
                    $("#spinner").hide();

                    $("#contactProspectFirstName").val("");
                    $("#contactProspectLastName").val("");
                    $("#contactProspectEmail").val("");
                    $("#contactProspectTelephone").val("");
                    $("#valueSuccessContact").show();

                    $.when(getProspectContactsSelect(this.state.companyId, this.state.selectedProspect.info.id)).then(function successHandler(data) {
                        if (data != undefined) {
                            this.setState({
                                prospectContactsSelect: data
                            })
                        }
                        else {
                        }
                    }.bind(this));

                    $.when(getProspectContacts(this.state.companyId, this.state.selectedProspect.info.id)).then(function successHandler(data) {
                        this.setState({
                            customerContacts: data
                        })
                    }.bind(this));

                    setTimeout(function () {
                        $("#valueSuccessContact").hide();
                    }, 5000);

                    setTimeout();
                }
                else {

                }

            }.bind(this));
    }

    handleContactsChange = (e) => {
        this.setState({
            selectedContacts: Array.isArray(e) ? e.map(x => x.value) : []
        })
    }

    saveProspectMeeting() {
        var date = document.getElementById('meetingProspectDate').value;
        if ($("#meetingProspectResponsible").val() == null ||
            $("#meetingProspectContact").length == 0 ||
            $("#meetingProspectType").val() == null ||
            $("#meetingProspectResult").val() == null ||
            !date) {
            alert("Kontrollera fält.")
        }
        else {
            var name = this.state.selectedProspect.info.name;

            $.when(saveProspectMeeting(this.state.selectedProspect.info.id, this.state.companyId, name, this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                if (status) {
                    $.when(getProspect(this.state.companyId, this.state.selectedProspect.info.id)).then(function successHandler(data) {
                        this.setState({
                            selectedProspectId: data.info.id,
                            selectedProspect: data
                        })
                    }.bind(this));

                    $("#valueSuccessProspectMeeting").show();

                    setTimeout(function () {
                        $("#valueSuccessProspectMeeting").hide();
                    }, 2000);

                    setTimeout();
                }
                else {
                    alert("Kunde inte registrera aktiviteten. Kontrollera att alla fält är ifyllda.")
                }
            }.bind(this));

            //var dateFollowUp = document.getElementById('dateFollowUp').value;
            //if (dateFollowUp != "") {
            //    $.when(saveFollowUpOnCreateMeeting(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(status) {
            //        if (status) {
            //            $.when(getFollowUps(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(followUps) {
            //                if (followUps != undefined) {
            //                    $("#spinner").hide();
            //                    this.setState({
            //                        followUps: followUps
            //                    })
            //                }
            //                else {
            //                    $("#spinner").hide();
            //                }
            //            }.bind(this));
            //            window.scrollTo(0, 0);

            //            setTimeout();
            //        }
            //        else {
            //            alert("Kunde inte registrera uppföljningen. Kontrollera att alla fält är ifyllda.")
            //        }
            //    }.bind(this));
            //}
        }
    }

    renderOption(option) {
        return (
            <option key={option.optionValue} value={option.optionValue}>
                {option.optionValue}
            </option>
        )
    }

    renderRoleSelect(role) {
        return (
            <option value={role.role}>{role.role}</option>
        )
    }

    renderCompanyMemberSelect(member) {
        return (
            <option key={member.id} value={member.id}>{member.name}</option>
        )
    }

    renderMeeting(meeting) {
        return (
            <tr key={meeting.meetingId} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{meeting.date.split('T')[0]}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.typeOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.resultOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>
                    {this.state.companyMembers.length > 0 &&
                        <>
                            {this.state.companyMembers.find(x => x.id === meeting.companyResponsible)
                                ? this.state.companyMembers.find(x => x.id === meeting.companyResponsible).name
                                : "Säljare borttagen"}
                        </>
                    }
                </td>
                <td style={{ width: "20%" }}>
                    <button onClick={() => { this.setState({ showEditMeetingModal: true, meetingIdEditModal: meeting.meetingId, customerIdEditModal: meeting.prospectId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                </td>
                <td>
                    {($("#userId").val() === meeting.companyResponsible) && (
                        <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemove(meeting)} />
                    )}
                </td>
            </tr>
        )
    }

    showRemove(meeting) {
        $("#removeBoxMeeting").show();
        this.setState({
            removeMeeting: meeting
        })
    }

    async removeMeeting() {
        var meeting = this.state.removeMeeting;
        $.when(removeProspectMeeting(meeting)).then(function successHandler(data) {
            if (data) {
                $.when(getProspect(this.state.companyId, meeting.prospectId)).then(function successHandler(prospect) {
                    if (data != undefined) {
                        $("#spinner").hide();
                        this.setState({
                            selectedProspectId: prospect.info.id,
                            selectedProspect: prospect
                        })
                    }
                    else {
                        $("#spinner").hide();
                    }
                }.bind(this));
                $("#removeBoxMeeting").hide();
            }
            else {
                $("#removeBoxMeeting").hide();
                alert("Kunde inte radera aktiviteten. Kontakta administratör om problemet kvarstår.")
            }
        }.bind(this));
    }

    cancelRemove() {
        $("#removeBoxMeeting").hide();
        this.setState({
            removeMeeting: null
        })
    }

    renderCustomerContact(contact) {
        return (
            <tr style={{ borderBottom: "1px solid #dee2e6" }} key={contact.name}>
                <td> {contact.firstName} {contact.lastName} </td>
                <td> ({contact.role}) </td>
                <td> {contact.telephone} </td>
                <td> {contact.email} </td>
                <td>
                    <button onClick={() => { this.setState({ showEditContactModal: true, contactIdEditModal: contact.id }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                </td>
                <td>
                    <BsFillTrashFill style={{ cursor: "pointer", color: "red", marginLeft: "10px", fontSize: "33px" }} onClick={() => this.openRemoveContact(contact.id)} />
                </td>
                {contact.createdBy != null &&
                    <td>
                        <BsInfoCircleFill data-tip={"Skapad av " + contact.createdBy} data-for="contactTip" style={{ fontSize: "14px", marginLeft: "5px", height: "17px", marginBottom: "3px", marginTop: "8px" }} />
                        <ReactTooltip id="contactTip" place="top" effect="solid" />
                    </td>
                }
                {contact.createdBy == null &&
                    <td>
                        
                    </td>
                }
            </tr>
        )
    }

    convertProspect() {
        $("#spinner").show();
        var companyId = this.state.companyId;
        $.when(convertToCustomer(this.state.companyId, this.state.selectedProspectId, $("#convertId").val())).then(function successHandler(status) {
            if (status) {
                $("#valueSuccessConvert").show();
                $("#spinner").hide();

                setTimeout(function () {
                    $.when(getAllProspects(companyId).then(function successHandler(data) {
                        if (data != undefined) {
                            component.setState({
                                prospects: data,
                                selectedProspectId: null
                            })
                        }
                        else {
                            "Något gick fel."
                        }
                    }.bind(this)));
                    $("#valueSuccessConvert").hide();
                }, 2000);

                setTimeout();
            }
            else {
                alert("Något gick fel. Prospektet har inte konverterats. Kontakta supporten ifall problemet kvarstår.")
            }
        }.bind(this));
    }

    closePopup() {
        component.setState({ isAddProspectContactOpen: false })
    }

    handleCompanyResponsiblesChange = (e) => {
        this.setState({
            selectedCompanyResponsibles: Array.isArray(e) ? e.map(x => x.value) : []
        })
    }

    closeEditProspectEditMeetingModal() {
        component.setState({ showEditMeetingModal: false });
        $.when(getProspect(component.state.companyId, component.state.customerIdEditModal)).then(function successHandler(data) {
            component.setState({
                selectedProspectId: data.info.id,
                selectedProspect: data
            })
        }.bind(this));
    }

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", minHeight: "750px" }}>
                {this.state.selectedProspectId != null ?
                    (
                        <React.Fragment>
                            <div className="col-sm-12" style={{ display: "block", marginBottom: "15px", textAlign: "center" }}>
                                <div className="col-sm-12">
                                    <h2 style={{ marginTop: "15px", marginBottom: "0" }}>
                                        {this.state.selectedProspect.info.name} (Prospekt)
                                        <Popup trigger={
                                            <div style={{ cursor: "pointer", float: "right" }} onClick={() => { this.setState({ isConvertOpen: true }) }}>
                                                <BsStarFill title="Konvertera prospekt till kund" style={{ color: this.state.color, fontSize: "32px" }} />
                                            </div>
                                        } open={this.state.isConvertOpen} position="right">
                                            <div>
                                                <p> Konvertera till kundnummer(Pengvin)</p>
                                                <input id="convertId" className="form-control" />
                                                <button
                                                    className="btn btn-primary form-control"
                                                    style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }}
                                                    onClick={() => this.convertProspect()}>
                                                    Konvertera
                                                </button>
                                                <div id="valueSuccessConvert" style={{ display: "none" }}>Prospektet har konverterats</div>
                                            </div>
                                        </Popup>
                                    </h2>
                                </div>
                                <hr style={{ borderTop: "2px solid black" }} />
                                <Tabs>
                                    <TabList>
                                        <Tab>Skapa aktivitet</Tab>
                                        <Tab>Aktiviteter</Tab>
                                        <Tab>Kontakter</Tab>
                                    </TabList>
                                    <TabPanel>
                                        <div id="addProspectMeeting" className="row col-sm-12" style={{ marginTop: "15px", textAlign: "center" }}>
                                            <div id="valueSuccessProspectMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                                                <h4>Aktiviteten har sparats</h4>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div>
                                                    <label> Datum </label>
                                                    <input type="date" id="meetingProspectDate" name="trip-start" className="form-control"
                                                        min="2022-01-01" max="2030-12-31" required />
                                                </div>
                                                <div>
                                                    <label> Typ av aktivitet </label>
                                                    <select id="meetingProspectType" className="form-control">
                                                        {this.state.options.map(d => {
                                                            return this.renderOption(d);
                                                        })}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label> Resultat av aktivitet </label>
                                                    <select id="meetingProspectResult" className="form-control" onChange={() => this.meetingResultChange()}>
                                                        <option value="Beställning/affär">Beställning/affär</option>
                                                        <option value="Offert">Offert</option>
                                                        <option value="Nytt möte">Nytt möte</option>
                                                        <option value="Smarthyra">Smarthyra</option>
                                                        <option value="Övrigt">Övrigt</option>
                                                        <option value="Inget">Inget</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label> Typ av plats </label>
                                                    <select id="meetingProspectLocationType" className="form-control">
                                                        <option value="Hos kund">Hos kund</option>
                                                        <option value="Teams">Teams</option>
                                                        <option value="På telefon">På telefon</option>
                                                        <option value="Epost/mail">Epost/mail</option>
                                                        <option value="Säljkontoret">Säljkontoret</option>
                                                        <option value="Butik">Butik</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div>
                                                    <label>Deltagare motpart</label>
                                                    <Popup trigger={
                                                        <span style={{ cursor: "pointer" }} onClick={() => { this.setState({ isAddProspectContactOpen: true})}}><i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i></span>
                                                    } open={this.state.isAddProspectContactOpen} position="left center">
                                                        <div>
                                                            <div className="col-sm-12">
                                                                <div className="col-sm-12">
                                                                    <label> Förnamn </label>
                                                                    <input
                                                                        ref={(input) => (this.contactFirstNameInput = input)}
                                                                        id="contactProspectFirstName"
                                                                        className="form-control"
                                                                        onKeyDown={this.handleKeyDown}
                                                                    />
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <label> Efternamn </label>
                                                                    <input
                                                                        ref={(input) => (this.contactLastNameInput = input)}
                                                                        id="contactProspectLastName"
                                                                        className="form-control"
                                                                        onKeyDown={this.handleKeyDown}
                                                                    />
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <label> Email </label>
                                                                    <input
                                                                        ref={(input) => (this.contactEmailInput = input)}
                                                                        id="contactProspectEmail"
                                                                        className="form-control"
                                                                        onKeyDown={this.handleKeyDown}
                                                                    />
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <label> Telefon </label>
                                                                    <input
                                                                        ref={(input) => (this.contactTelephoneInput = input)}
                                                                        id="contactProspectTelephone"
                                                                        className="form-control"
                                                                        onKeyDown={this.handleKeyDown}
                                                                    />
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <label> Roll </label>
                                                                    <select
                                                                        ref={(input) => (this.contactRoleInput = input)}
                                                                        id="contactProspectRole"
                                                                        className="form-control"
                                                                        onKeyDown={this.handleKeyDown}
                                                                    >
                                                                        {this.state.roles.map(d => {
                                                                            return this.renderRoleSelect(d);
                                                                        })}
                                                                        <option value="Inget av alternativen passar">Inget av alternativen passar</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12">
                                                                <button
                                                                    ref={(input) => (this.contactSaveButton = input)}
                                                                    id="saveContact"
                                                                    className="btn btn-primary form-control"
                                                                    style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }}
                                                                    onClick={() => this.saveContact()}>
                                                                    Spara
                                                                </button>
                                                            </div>
                                                            <div id="valueSuccessContact" style={{ display: "none" }}>Kontakten har sparats</div>
                                                        </div>
                                                    </Popup>
                                                    <Select
                                                        id="meetingProspectContact"
                                                        options={this.state.prospectContactsSelect}
                                                        closeMenuOnSelect={false}
                                                        onChange={this.handleContactsChange}
                                                        isMulti />

                                                </div>
                                                <div>
                                                    <label>Vår deltagare</label>
                                                    <select id="meetingProspectResponsible" className="form-control">
                                                        {this.state.companyMembers.map(d => {
                                                            return this.renderCompanyMemberSelect(d);
                                                        })}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Extra deltagande säljare</label>
                                                    <Select
                                                        id="meetingContact"
                                                        options={this.state.companyResponsiblesSelect}
                                                        closeMenuOnSelect={false}
                                                        onChange={this.handleCompanyResponsiblesChange}
                                                        isMulti />
                                                </div>
                                                <div>
                                                    <label> Kommentar(valfritt, max 1500 tecken)</label>
                                                    <textarea id="meetingProspectComment" className="form-control" maxlength="1500" />
                                                </div>
                                                <div>
                                                    <label> Datum uppföljning(valfritt, notis till din mail) </label>
                                                    <input type="date" id="dateProspectFollowUp" name="trip-start" className="form-control"
                                                        min="2022-01-01" max="2030-12-31" required />
                                                </div>
                                            </div>
                                            <button className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveProspectMeeting()}>Registrera</button>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="col-sm-12" style={{ overflow: "scroll" }}>
                                            <div id="removeBoxMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                                <h4>Vill du ta bort aktiviteten?</h4>
                                                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeMeeting()}>Ta bort</button>
                                                <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                                            </div>
                                            <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                                <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                    <tr>
                                                        <th>Datum</th>
                                                        <th>Typ</th>
                                                        <th>Resultat</th>
                                                        <th>Säljare</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ backgroundColor: "white" }}>
                                                    {this.state.selectedProspect.meetings.map(d => {
                                                        return this.renderMeeting(d);
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="col-sm-12" style={{ overflowY: "scroll" }}>
                                            <div className="col-sm-12">
                                                <Popup trigger={
                                                <span style={{ cursor: "pointer" }} onClick={() => { this.setState({ isAddProspectContactOpen: true }) }}><i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i></span>
                                            } open={this.state.isAddProspectContactOpen} position="right">
                                                    <div>
                                                    <div className="col-sm-12">
                                                        <div className="col-sm-12">
                                                            <label> Förnamn </label>
                                                            <input
                                                                ref={(input) => (this.contactFirstNameInput = input)}
                                                                id="contactProspectFirstName"
                                                                className="form-control"
                                                                onKeyDown={this.handleKeyDown}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <label> Efternamn </label>
                                                            <input
                                                                ref={(input) => (this.contactLastNameInput = input)}
                                                                id="contactProspectLastName"
                                                                className="form-control"
                                                                onKeyDown={this.handleKeyDown}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <label> Email </label>
                                                            <input
                                                                ref={(input) => (this.contactEmailInput = input)}
                                                                id="contactProspectEmail"
                                                                className="form-control"
                                                                onKeyDown={this.handleKeyDown}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <label> Telefon </label>
                                                            <input
                                                                ref={(input) => (this.contactTelephoneInput = input)}
                                                                id="contactProspectTelephone"
                                                                className="form-control"
                                                                onKeyDown={this.handleKeyDown}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <label> Roll </label>
                                                            <select
                                                                ref={(input) => (this.contactRoleInput = input)}
                                                                id="contactProspectRole"
                                                                className="form-control"
                                                                onKeyDown={this.handleKeyDown}
                                                            >
                                                                {this.state.roles.map(d => {
                                                                    return this.renderRoleSelect(d);
                                                                })}
                                                                <option value="Inget av alternativen passar">Inget av alternativen passar</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <button
                                                            ref={(input) => (this.contactSaveButton = input)}
                                                            id="saveContact"
                                                            className="btn btn-primary form-control"
                                                            style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }}
                                                            onClick={() => this.saveContact()}>
                                                            Spara
                                                        </button>
                                                    </div>
                                                    <div id="valueSuccessContact" style={{ display: "none" }}>Kontakten har sparats</div>
                                                </div>
                                                </Popup>
                                            </div>
                                            <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                                <tbody>
                                                    {this.state.customerContacts.map(d => {
                                                        return this.renderCustomerContact(d);
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="col-sm-12" style={{ display: "block", marginBottom: "15px", textAlign: "center" }}>
                                <h2 style={{ marginTop: "15px", marginBottom: "0" }}>
                                    Prospekt
                                            <Popup trigger={
                                        <span style={{ cursor: "pointer" }} onClick={() => { this.setState({ isAddProspectOpen: true }) }}>
                                            <i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px", marginLeft: "10px" }}></i>
                                        </span>
                                    } open={this.state.isAddProspectOpen} position="right">
                                        <div>
                                            <div className="col-sm-12">
                                                <div className="col-sm-12">
                                                    <label> Namn </label>
                                                    <input
                                                        ref={(input) => (this.contactNameInput = input)}
                                                        id="prospectName"
                                                        className="form-control"
                                                        onKeyDown={this.handleKeyDown}
                                                    />
                                                </div>
                                                <div className="col-sm-12">
                                                    <label> Beskrivning </label>
                                                    <textarea
                                                        ref={(input) => (this.contactDescriptionInput = input)}
                                                        id="prospectDescription"
                                                        className="form-control"
                                                        onKeyDown={this.handleKeyDown}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <button
                                                    ref={(input) => (this.prospectSaveButton = input)}
                                                    id="saveProspect"
                                                    className="btn btn-primary form-control"
                                                    style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }}
                                                    onClick={() => this.save()}>
                                                    Spara
                                                </button>
                                            </div>
                                            <div id="valueSuccessProspect" style={{ display: "none" }}>Prospekten har sparats</div>
                                        </div>
                                    </Popup>
                                </h2>
                                <hr style={{ borderTop: "2px solid black" }} />
                            </div>
                            <div className="col-sm-12" style={{ overflow: "scroll" }}>
                                <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                        <tr>
                                            <th>Namn</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ backgroundColor: "white" }}>
                                        {this.state.prospects.map(d => {
                                            return this.renderProspect(d);
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </React.Fragment>
                    )
                }
                {this.state.meetingIdEditModal != null &&
                    <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                    show={this.state.showEditMeetingModal}
                        onHide={() => {
                            this.setState({ showEditMeetingModal: false });
                            $.when(getProspect(this.state.companyId, this.state.customerIdEditModal)).then(function successHandler(data) {
                                this.setState({
                                    selectedProspectId: data.info.id,
                                    selectedProspect: data
                                })
                            }.bind(this));
                        }}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                        <EditProspectMeetingModal meetingId={this.state.meetingIdEditModal} customerId={this.state.customerIdEditModal} closeEditProspectEditMeetingModal={component.closeEditProspectEditMeetingModal} />
                        </Modal.Body>
                    </Modal>
                }
                {this.state.contactIdEditModal != null &&
                    <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                        show={this.state.showEditContactModal}
                        onHide={() => {
                            this.setState({ showEditContactModal: false });
                            $.when(getProspectContacts(this.state.companyId, this.state.selectedProspectId)).then(function successHandler(data) {
                                this.setState({
                                    customerContacts: data
                                })
                            }.bind(this));
                        }}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                        <EditProspectContactModal prospectId={this.state.selectedProspectId} id={this.state.contactIdEditModal} />
                        </Modal.Body>
                    </Modal>
                }
            </div>
        );
    }
}
