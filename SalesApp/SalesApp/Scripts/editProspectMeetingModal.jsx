import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import {
    getProspectMeeting,
    getProspectContacts,
    editProspectMeeting,
    getOptions,
    getProspectParticipators,
    getRoles,
    getProspectContactsSelect,
    getCompanyMembers,
    getSelectedProspectContactsForMeeting,
    saveCustomerContact,
    getCompanyResponsiblesSelect,
    getSelectedCompanyResponsiblesForProspectMeeting
} from './requestHandler'
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Select from 'react-select'
import { BsPencilSquare } from 'react-icons/bs';

var component;
export class EditProspectMeetingModal extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.meeetingId === null)
            return null;

        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            customerId: this.props.customerId,
            meeetingId: this.props.meeetingId,
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
            disabled: true
        }

        $('#spinner').show();

        $.when(getRoles($('#companyId').val())).then(function successHandler(roles) {
            $.when(getCompanyMembers()).then(function successHandler(cm) {
                $.when(getOptions(this.state.companyId)).then(function successHandler(options) {
                    $.when(getProspectContactsSelect(this.state.companyId, this.props.customerId)).then(function successHandler(ccSelects) {
                        $.when(getProspectMeeting(this.state.companyId, this.props.customerId, this.props.meetingId)).then(function successHandler(data) {
                            $.when(getProspectContacts(this.state.companyId, this.state.customerId)).then(function successHandler(contacts) {
                                $.when(getProspectParticipators(this.state.companyId, this.state.customerId, this.props.meetingId)).then(function successHandler(participators) {
                                    $.when(getSelectedProspectContactsForMeeting(this.props.meetingId)).then(function successHandler(selectedContacts) {
                                        this.setState({
                                            meeting: data,
                                            contacts: contacts,
                                            date: data.date,
                                            meetingProject: data.projectId,
                                            typeOfMeeting: data.typeOfMeeting,
                                            resultOfMeeting: data.resultOfMeeting,
                                            participators: participators,
                                            comments: data.comments,
                                            kilometersDriven: data.kilometersDriven,
                                            options: options,
                                            customerContactsSelect: ccSelects,
                                            companyMembers: cm.sort((a, b) => (a.name > b.name) ? 1 : -1),
                                            roles: roles,
                                            selectedContacts: selectedContacts,
                                        }, () => {
                                            this.setSelected();
                                            $('#spinner').hide();
                                        });
                                    }.bind(this));
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));


        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));

        $.when(getSelectedCompanyResponsiblesForProspectMeeting(this.props.meetingId)).then(function successHandler(selectedResponsibles) {
            component.setState({
                selectedCompanyResponsibles: selectedResponsibles
            });
        }.bind(this));
    }

    setSelected() {

        let elementType = document.getElementById("meetingType");
        elementType.value = this.state.typeOfMeeting;

        let elementResult = document.getElementById("meetingResult");
        elementResult.value = this.state.resultOfMeeting;

        let elementContact = document.getElementById("meetingResponsible");
        elementContact.value = this.state.meeting.companyResponsible;

        let elementLocationType = document.getElementById("meetingLocationType");
        elementLocationType.value = this.state.meeting.locationType;

    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.name + "-" + contact.role} value={contact.name}>{contact.name + "-" + contact.role}</option>
        )
    }

    renderCustomer(customer) {
        return (
            <option key={customer.customerId} value={customer.customerId}>{customer.customerName}</option>
        )
    }

    editMeeting() {

        $.when(editProspectMeeting(this.state.customerId, this.state.companyId, this.props.meetingId, this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
            if (status) {
                $("#valueSuccessMeeting").show();
                window.scrollTo(0, 0);
                component.props.closeEditProspectEditMeetingModal();
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
    }

    dateChange(event) {
        component.setState({
            date: event.target.value
        });
    }

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
        $.when(saveCustomerContact(this.state.customerId, $('#companyId').val())).then(function successHandler(status) {
            if (status) {
                $.when(getCustomerContactsSelect(this.state.companyId, this.props.customerId)).then(function successHandler(ccSelects) {
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

    handleCompanyResponsiblesChange = (newList) => {
        this.setState({
            selectedCompanyResponsibles: newList
        })
    }

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                    <div className="col-sm-12" style={{ display: "grid" }}>
                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Redigera aktivitet
                        </h2>
                    </div>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <div id="valueSuccessMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Aktiviteten har sparats</h4>
                </div>
                {this.state.meeting != null ? 
                    (
                        <div className="row col-sm-12" style={{ margin: "0" }}>
                            <div className="col-sm-12">
                                {($("#isAdmin").val() === "True" || $("#userId").val() === this.state.meeting.companyResponsible) && (
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
                                    <label> Typ av aktivitet </label>
                                    <select id="meetingType" className="form-control" disabled={this.state.disabled}>
                                        {this.state.options.map(d => {
                                            return this.renderOption(d);
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label> Resultat av aktivitet </label>
                                    <select id="meetingResult" className="form-control" onChange={() => this.meetingResultChange()} disabled={this.state.disabled}>
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
                                    <select id="meetingLocationType" className="form-control" disabled={this.state.disabled}>
                                        <option value="Hos kund">Hos kund</option>
                                        <option value="Teams">Teams</option>
                                        <option value="På telefon">På telefon</option>
                                        <option value="Epost/mail">Epost/mail</option>
                                        <option value="Säljkontoret">Säljkontoret</option>
                                        <option value="Butik">Butik</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div>
                                    <label>Deltagare motpart</label>
                                    <Select
                                        id="meetingContact"
                                        options={this.state.customerContactsSelect}
                                        closeMenuOnSelect={false}
                                        onChange={this.handleContactsChange}
                                        value={this.state.selectedContacts}
                                        isMulti
                                        isDisabled={this.state.disabled}
                                    />
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
                    ) : (
                        <div id="spinner" style={{ marginTop: "7px" }} className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default EditProspectMeetingModal;