import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import {
    getMeeting,
    getCustomerContacts,
    editMeeting,
    getOptions,
    getParticipators,
    getRoles,
    getCustomerContactsSelect,
    getCompanyMembers,
    getSelectedCustomerContactsForMeeting,
    saveCustomerContact,
    getProjects,
    getProjectsOfEntireCustomerGroup,
    getCampaigns,
    getCustomerGroupIdFromCustomerId,
    getCustomersInGroup,
    getCompanyResponsiblesSelect,
    getSelectedCompanyResponsiblesForMeeting
} from './requestHandler'
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Select from 'react-select'
import { BsInfoCircleFill, BsFillTrashFill, BsXLg } from 'react-icons/bs';
import { BsPencilSquare } from 'react-icons/bs';

var component;
export class EditMeeting extends React.Component {
    constructor(props) {
        super(props);
        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            customerId: this.getCustomerId(),
            meeetingId: this.getMeetingId(),
            color: $('#color').val(),
            meeting: null,
            date: "",
            meetingProject: "",
            typeOfMeeting: "",
            resultOfMeeting: "",
            participators: [],
            comments: "",
            kilometersDriven: "",
            //miscExplanation: "",
            contacts: [],
            options: [],
            roles: [],
            customerContactsSelect: [],
            companyMembers: [],
            selectedContacts: [],
            companyResponsiblesSelect: [],
            selectedCompanyResponsibles: [],
            initialSelectedContacts: [],
            isOpen: false,
            customerProjects: [],
            campaigns: [],
            customerGroupId: null,
            customers: [],
            disabled: true,
            projektArbeteActive: false
        }

        $('#spinner').show();


        $.when(getCustomerGroupIdFromCustomerId(this.getCustomerId())).then(function successHandler(customerGroupId) {
            $.when(getCustomersInGroup(customerGroupId)).then(function successHandler(customers) {
                $.when(getRoles($('#companyId').val())).then(function successHandler(roles) {
                    $.when(getCompanyMembers()).then(function successHandler(cm) {
                        $.when(getOptions($('#companyId').val())).then(function successHandler(options) {
                            $.when(getCustomerContactsSelect($('#companyId').val(), customerGroupId)).then(function successHandler(ccSelects) {
                                $.when(getMeeting($('#companyId').val(), component.getCustomerId(), component.getMeetingId())).then(function successHandler(data) {
                                    $.when(getCustomerContacts($('#companyId').val(), customerGroupId)).then(function successHandler(contacts) {
                                        $.when(getParticipators($('#companyId').val(), component.getCustomerId(), component.getMeetingId())).then(function successHandler(participators) {
                                            $.when(getSelectedCustomerContactsForMeeting(component.getMeetingId())).then(function successHandler(selectedContacts) {
                                                $.when(getProjects($('#companyId').val(), component.getCustomerId())).then(function successHandler(projects) {
                                                    $.when(getCampaigns($('#companyId').val())).then(function successHandler(campaigns) {
                                                        if (projects.length == 0) {
                                                            $.when(getProjectsOfEntireCustomerGroup(customerGroupId)).then(function successHandler(d) {
                                                                projects = d;
                                                                component.setState({
                                                                    meeting: data,
                                                                    contacts: contacts,
                                                                    date: data.date,
                                                                    meetingProject: data.projectId,
                                                                    meetingCustomer: data.customerId,
                                                                    typeOfMeeting: data.typeOfMeeting,
                                                                    resultOfMeeting: data.resultOfMeeting,
                                                                    participators: participators,
                                                                    comments: data.comments,
                                                                    kilometersDriven: data.kilometersDriven,
                                                                    //miscExplanation: data.miscExplanation,
                                                                    options: options,
                                                                    customerContactsSelect: ccSelects,
                                                                    companyMembers: cm.sort((a, b) => (a.name > b.name) ? 1 : -1),
                                                                    roles: roles,
                                                                    selectedContacts: selectedContacts,
                                                                    customerProjects: projects,
                                                                    campaigns: campaigns,
                                                                    customerGroupId: customerGroupId,
                                                                    customers: customers
                                                                }, () => {
                                                                        component.setSelected();
                                                                    $('#spinner').hide();
                                                                });
                                                            }.bind(this));
                                                        }
                                                        else {
                                                            component.setState({
                                                                meeting: data,
                                                                contacts: contacts,
                                                                date: data.date,
                                                                meetingProject: data.projectId,
                                                                meetingCustomer: data.customerId,
                                                                typeOfMeeting: data.typeOfMeeting,
                                                                resultOfMeeting: data.resultOfMeeting,
                                                                participators: participators,
                                                                comments: data.comments,
                                                                kilometersDriven: data.kilometersDriven,
                                                                //miscExplanation: data.miscExplanation,
                                                                options: options,
                                                                customerContactsSelect: ccSelects,
                                                                companyMembers: cm.sort((a, b) => (a.name > b.name) ? 1 : -1),
                                                                roles: roles,
                                                                selectedContacts: selectedContacts,
                                                                customerProjects: projects,
                                                                campaigns: campaigns,
                                                                customerGroupId: customerGroupId,
                                                                customers: customers
                                                            }, () => {
                                                                component.setSelected();
                                                                $('#spinner').hide();
                                                            });
                                                        }
                                                    }.bind(this));
                                                }.bind(this));
                                            }.bind(this));
                                        }.bind(this));
                                    }.bind(this));
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        });

        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));

        $.when(getSelectedCompanyResponsiblesForMeeting(this.getMeetingId())).then(function successHandler(selectedResponsibles) {
            component.setState({
                selectedCompanyResponsibles: selectedResponsibles
            });
        }.bind(this));
    }

    setSelected() {
        if (this.state.companyId != "23c5b39f-6ea9-4e9b-b20a-27606982c79e") {
            let elementProject = document.getElementById("meetingProject");
            elementProject.value = this.state.meetingProject;
        }
        let elementCustomer = document.getElementById("meetingCustomer");
        elementCustomer.value = this.state.meetingCustomer;

        let elementType = document.getElementById("meetingType");
        elementType.value = this.state.typeOfMeeting;
        if (this.state.typeOfMeeting == "Projektarbete") {
            this.setState({
                projektArbeteActive: true
            });
        }

        let elementResult = document.getElementById("meetingResult");
        elementResult.value = this.state.resultOfMeeting;

        let elementContact = document.getElementById("meetingResponsible");
        elementContact.value = this.state.meeting.companyResponsible;

        let elementLocationType = document.getElementById("meetingLocationType");
        elementLocationType.value = this.state.meeting.locationType;

        //let elementCampaign = document.getElementById("meetingCampaign");
        //elementCampaign.value = this.state.meeting.campaignId;
        
        if (this.state.resultOfMeeting == "Övrigt") {
        //    $("#miscExplanationBox").show();
        }

    }

    getCustomerId() {
        const windowUrl = window.location.href;
        const params = windowUrl.split("/");
        return params[4];
    }

    getMeetingId() {
        const windowUrl = window.location.href;
        const params = windowUrl.split("/");
        return params[5];
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.name + "-" + contact.role} value={contact.name}>{contact.name + "-" + contact.role}</option>
        )
    }

    editMeeting() {
        $.when(editMeeting($("#meetingCustomer").val(), this.state.companyId, this.getMeetingId(), this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
            if (status) {
                $("#valueSuccessMeeting").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $("#valueSuccessMeeting").hide();
                }, 5000);

                setTimeout();
            }
            else {
                alert("Kunde inte redigera aktiviteten. Kontrollera att alla fält är ifyllda.")
            }
        }.bind(this));
    }

    meetingResultChange() {
        var value = $("#meetingResult").val();
        if (value == "Övrigt") {
        //    $("#miscExplanationBox").show();
        }
        else {
        //    $("#miscExplanationBox").hide();
        }
    }

    dateChange(event) {
        component.setState({
            date: event.target.value
        });
    }

    //miscChange(event) {
    //    component.setState({
    //        miscExplanation: event.target.value
    //    });
    //}

    commentsChange(event) {
        component.setState({
            comments: event.target.value
        });
    }
    
    kilometersDrivenChange(event) {
        component.setState({
            kilometersDriven: event.target.value
        });
    }

    renderOption(option) {
        return (
            <option key={option.optionValue} value={option.optionValue}>{option.optionValue}</option>
        )
    }

    renderProject(project) {
        return (
            <option value={project.projectId} key={project.projectId}>
                {project.activity}
            </option>
        )
    }

    renderCampaign(campaign) {
        return (
            <option value={campaign.id} key={campaign.id}>
                {campaign.title}
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

    handleContactsChange = (newList) => {
        this.setState({
            selectedContacts: newList
        })
    }

    saveContact() {
        $.when(saveCustomerContact(this.state.customerGroupId, $('#companyId').val())).then(function successHandler(status) {
            if (status) {
                $.when(getCustomerContactsSelect(this.state.companyId, this.state.customerGroupId)).then(function successHandler(ccSelects) {
                    if (ccSelects != undefined) {
                        $("#spinner").hide();
                        this.setState({
                            customerContactsSelect: ccSelects,
                            isOpen: false
                        })
                    }
                    else {
                        $("#spinner").hide();
                    }
                }.bind(this));

                $("#contactName").val(""),
                $("#contactTelephone").val(""),
                $("#contactEmail").val(""),
                $("#valueSuccessContact").show();

                setTimeout(function () {
                    $("#valueSuccessContact").hide();
                }, 5000);

                setTimeout();
            }
            else {
                alert("Kunde inte skapa kontakten. Detta kan bero på att den redan finns.");
            }
        }.bind(this));
    }

    handleOpen = () => {
        this.setState({ isOpen: true });
    }

    renderCustomer(customer) {
        return (
            <option key={customer.customerId} value={customer.customerId}>{customer.customerName}</option>
        )
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'contactFirstName':
                    this.contactLastNameInput.focus();
                    break;
                case 'contactLastName':
                    this.contactEmailInput.focus();
                    break;
                case 'contactEmail':
                    this.contactTelephoneInput.focus();
                    break;
                case 'contactTelephone':
                    this.contactRoleInput.focus();
                    break;
                case 'contactRole':
                    //this.contactSaveButton.focus();
                    break;
                default:
                    break;
            }
        }
    };

    closePopup() {
        component.setState({ isOpen: false })
    }

    handleCompanyResponsiblesChange = (newList) => {
        this.setState({
            selectedCompanyResponsibles: newList
        })
    }

    typeOfActivityChange(e) {
        this.setState({
            projektArbeteActive: e.target.value == "Projektarbete"
        });

        if (e.target.value == "Projektarbete") {
            $("#meetingResult").val("Övrigt");
            $("#meetingLocationType").val("Säljkontoret");
            this.setState({
                selectedContacts: []
            });
        }
    }

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                    <div className="col-sm-12" style={{ display: "grid" }}>
                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Redigera kundaktivitet
                            <Link to="/CustomerSearch">
                                <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                            </Link>
                        </h2>
                    </div>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <div id="valueSuccessMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Aktiviteten har sparats</h4>
                </div>
                <div className="row col-sm-12" style={{ margin: "0" }}>
                    <div className="col-sm-12 col-md-6">
                        {this.state.meeting && ($("#isAdmin").val() === "True" || $("#userId").val() === this.state.meeting.companyResponsible) && (
                            <BsPencilSquare
                                style={{ cursor: "pointer", float: "right" }}
                                onClick={() => this.setState({ disabled: !this.state.disabled })}
                            />
                        )}
                        <div>
                            <label> Datum </label>
                            <input type="date" id="meetingDate" name="trip-start" className="form-control"
                                min="2022-01-01" max="2030-12-31" value={this.state.date.split('T')[0]} onChange={this.dateChange} disabled={this.state.disabled}/>
                        </div>
                        <div>
                            <label> Kund </label>
                            <select id="meetingCustomer" className="form-control" disabled={this.state.disabled}>
                                {this.state.customers.map(d => {
                                    return component.renderCustomer(d);
                                })}
                            </select>
                        </div>
                        <div>
                            <label> Projekt(frivilligt) </label>
                            <select id="meetingProject" className="form-control" disabled={this.state.companyId == "23c5b39f-6ea9-4e9b-b20a-27606982c79e"} disabled={this.state.disabled}>
                                <option value="Inget valt" key="Inget valt">
                                    Inget valt
                                </option>
                                {this.state.customerProjects.map(d => {
                                    return this.renderProject(d);
                                })}
                            </select>
                        </div>
                        <div>
                            <label> Typ av aktivitet </label>
                            <select id="meetingType" className="form-control" disabled={this.state.disabled} onChange={(e) => { this.typeOfActivityChange(e) }}>
                                {this.state.options.map(d => {
                                    return this.renderOption(d);
                                })}
                            </select>
                        </div>
                        <div>
                            <label> Resultat av aktivitet </label>
                            <select id="meetingResult" className="form-control" onChange={() => this.meetingResultChange()} disabled={this.state.disabled || this.state.projektArbeteActive}>
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
                            <select id="meetingLocationType" className="form-control" disabled={this.state.disabled || this.state.projektArbeteActive}>
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
                                <span style={{ cursor: "pointer" }}><i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i></span>
                            } position="left center"
                                open={this.state.isOpen}>
                                <div>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12">
                                            <label> Förnamn </label>
                                            <input
                                                ref={(input) => (this.contactFirstNameInput = input)}
                                                id="contactFirstName"
                                                className="form-control"
                                                onKeyDown={this.handleKeyDown}
                                            />
                                        </div>
                                        <div className="col-sm-12">
                                            <label> Efternamn </label>
                                            <input
                                                ref={(input) => (this.contactLastNameInput = input)}
                                                id="contactLastName"
                                                className="form-control"
                                                onKeyDown={this.handleKeyDown}
                                            />
                                        </div>
                                        <div className="col-sm-12">
                                            <label> Email </label>
                                            <input
                                                ref={(input) => (this.contactEmailInput = input)}
                                                id="contactEmail"
                                                className="form-control"
                                                onKeyDown={this.handleKeyDown}
                                            />
                                        </div>
                                        <div className="col-sm-12">
                                            <label> Telefon </label>
                                            <input
                                                ref={(input) => (this.contactTelephoneInput = input)}
                                                id="contactTelephone"
                                                className="form-control"
                                                onKeyDown={this.handleKeyDown}
                                            />
                                        </div>
                                        <div className="col-sm-12">
                                            <label> Roll </label>
                                            <select
                                                ref={(input) => (this.contactRoleInput = input)}
                                                id="contactRole"
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
                                id="meetingContact"
                                options={this.state.customerContactsSelect}
                                closeMenuOnSelect={false}
                                onChange={this.handleContactsChange}
                                value={this.state.selectedContacts}
                                isDisabled={this.state.disabled || this.state.projektArbeteActive}
                                isMulti />
                        </div>
                        <div>
                            <label>Vår deltagare</label>
                            <select id="meetingResponsible" className="form-control" disabled={this.state.disabled}>
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
                                value={this.state.selectedCompanyResponsibles}
                                closeMenuOnSelect={false}
                                onChange={this.handleCompanyResponsiblesChange}
                                isMulti
                                isDisabled={this.state.disabled}
                            />
                        </div>
                        <div>
                            <label> Kommentar(valfritt, max 1500 tecken)</label>
                            <textarea id="meetingComment" className="form-control" value={this.state.comments} onChange={this.commentsChange} maxlength="1500" disabled={this.state.disabled}/>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.editMeeting()} style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }} disabled={this.state.disabled}>Spara kundaktivitet</button>
                </div>
            </div>
        );
    }
}

export default EditMeeting;