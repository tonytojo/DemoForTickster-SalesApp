import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import {
    getProject,
    getCustomerContacts,
    getCompanyMembers,
    getOptions,
    editProject,
    getCustomersInGroup,
    getCampaigns,
    checkIfCustomerIsInCustomerGroup,
    getCompanyResponsiblesSelect,
    getSelectedCompanyResponsiblesForProject,
    getProjectResult
} from './requestHandler'

import { BsPencilSquare } from 'react-icons/bs';
import Select from 'react-select'

var component;
export class EditProjectModal extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.projectId === null)
            return null;

        component = this;
        var isCustomerGroup = false;

        this.state = {
            companyId: $('#companyId').val(),
            customerId: this.props.customerId,
            projectId: this.props.projectId,
            color: $('#color').val(),
            project: null,
            activityDate: "",
            activityContact: "",
            activityContactCompany: "",
            activityTask: "",
            activityDescription: "",
            activityStatus: "",
            activityNextStep: "",
            activityPrio: "",
            activityCampaign: "",
            customerContacts: [],
            options: [],
            isCustomerGroup: isCustomerGroup,
            customers: [],
            campaigns: [],
            customerGroupId: null,
            disabled: true,
            companyResponsiblesSelect: [],
            selectedCompanyResponsibles: [],

            dropdownOptions: ['Vunnet', 'Förlorat', 'Övrigt'],
            selectedDropdownOption: '',
            showDropdown: false,
            showSuccessMessage: false
        }

        
        $.when(checkIfCustomerIsInCustomerGroup(this.props.customerId).then(function successHandler(response)
        {
            if (response.belongsToCustomerGroup == true) {
                isCustomerGroup = true;
                this.state = {
                    companyId: $('#companyId').val(),
                    customerId: this.props.customerId,
                    projectId: this.props.projectId,
                    color: $('#color').val(),
                    project: null,
                    activityDate: "",
                    activityContact: "",
                    activityContactCompany: "",
                    activityTask: "",
                    activityDescription: "",
                    activityStatus: "",
                    activityNextStep: "",
                    activityPrio: "",
                    activityCampaign: "",
                    customerContacts: [],
                    options: [],
                    isCustomerGroup: isCustomerGroup,
                    customers: [],
                    campaigns: [],
                    customerGroupId: response.customerGroupId,
                    disabled: true,
                }
                $('#spinner').show();

                $.when(getCustomersInGroup(response.customerGroupId).then(function successHandler(customers) {
                    this.setState({
                        customers: customers,
                    });
                }.bind(this)));

                $.when(getProject(this.state.companyId, this.props.customerId, this.props.projectId)).then(function successHandler(data)
                {
                    $.when(getProjectResult(this.props.projectId)).then(function successHandler(projectresult)
                    {
                        $.when(getCustomerContacts(this.state.companyId, response.customerGroupId, false)).then(function successHandler(contacts)
                        {
                            $.when(getCompanyMembers()).then(function successHandler(companyMembers)
                            {
                                $.when(getOptions(this.state.companyId)).then(function successHandler(options)
                                {
                                    this.setState({
                                    activityDate: data.date,
                                    activityContact: data.customerContact,
                                    activityContactCompany: data.companyResponsible,
                                    activityTask: data.activity,
                                    activityDescription: data.description,
                                    activityStatus: data.status,
                                    activityNextStep: data.nextStep,
                                    activityPrio: data.priority,
                                    activityContactCompany2: data.companyResponsible2,
                                    activityCampaign: data.campaignId,
                                    customerContacts: contacts,
                                    companyMembers: companyMembers,
                                    options: options,
                                    activityCustomer: data.customerId,
                                    customerGroupId: response.customerGroupId,
                                    isCustomerGroup: true,
                                    selectedDropdownOption: projectresult && projectresult.result ? projectresult.result : ""
                                }, () => {
                                    this.setSelected();
                                    $('#spinner').hide();
                                });
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));

                $.when(getCampaigns(this.state.companyId)).then(function successHandler(campaigns) {
                    component.setState({
                        campaigns: campaigns
                    });
                });
            }
            else {
                this.state = {
                    companyId: $('#companyId').val(),
                    customerId: this.props.customerId,
                    projectId: this.props.projectId,
                    color: $('#color').val(),
                    project: null,
                    activityDate: "",
                    activityContact: "",
                    activityContactCompany: "",
                    activityTask: "",
                    activityDescription: "",
                    activityStatus: "",
                    activityNextStep: "",
                    activityPrio: "",
                    activityCampaign: "",
                    customerContacts: [],
                    options: [],
                    isCustomerGroup: isCustomerGroup,
                    customers: [],
                    campaigns: [],
                    customerGroupId: null,
                    disabled: true
                }

                $.when(getProject(this.state.companyId, this.props.customerId, this.props.projectId)).then(function successHandler(data)
                {
                    $.when(getProjectResult(this.props.projectId)).then(function successHandler(projectresult)
                    {
                        $.when(getCustomerContacts(this.state.companyId, this.state.customerId, false)).then(function successHandler(contacts)
                        {
                            $.when(getCompanyMembers()).then(function successHandler(companyMembers)
                            {
                                $.when(getOptions(this.state.companyId)).then(function successHandler(options)
                                {
                                    this.setState({
                                    activityDate: data.date,
                                    activityContact: data.customerContact,
                                    activityContactCompany: data.companyResponsible,
                                    activityTask: data.activity,
                                    activityDescription: data.description,
                                    activityStatus: data.status,
                                    activityNextStep: data.nextStep,
                                    activityPrio: data.priority,
                                    activityContactCompany2: data.companyResponsible2,
                                    activityCampaign: data.campaignId,
                                    customerContacts: contacts,
                                    companyMembers: companyMembers,
                                    options: options,
                                    activityCustomer: data.customerId,
                                    selectedDropdownOption: projectresult && projectresult.result ? projectresult.result : ""
                                }, () => {
                                    this.setSelected();
                                    $('#spinner').hide();
                                });
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));

                $.when(getCampaigns(this.state.companyId)).then(function successHandler(campaigns) {
                    component.setState({
                        campaigns: campaigns
                    });
                });
            }
        }.bind(this)));

        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));

        $.when(getSelectedCompanyResponsiblesForProject(this.props.projectId)).then(function successHandler(selectedResponsibles) {
            component.setState({
                selectedCompanyResponsibles: selectedResponsibles
            });
        }.bind(this));
    }

    setSelected() {
        let element = document.getElementById("activityContact");
        element.value = this.state.activityContact;

        let elementContact = document.getElementById("activityContactCompany");
        elementContact.value = this.state.activityContactCompany;

        let elementContact2 = document.getElementById("activityContactCompany2");
        elementContact2.value = this.state.activityContactCompany2;

        let elementActivity = document.getElementById("activityStatus");
        elementActivity.value = this.state.activityStatus;

        let elementPrio = document.getElementById("activityPrio");
        elementPrio.value = this.state.activityPrio;

        if (this.state.isCustomerGroup) {
            let elementCustomer = document.getElementById("activityCustomer");
            elementCustomer.value = this.state.activityCustomer;
        }      
    }

    getCustomerGroupId() {
        const windowUrl = window.location.href;
        const params = windowUrl.split("/");
        return params[7];
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</option>
        )
    }

    renderCompanyMemberSelect(contact) {
        return (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
        )
    }

    renderOption(option) {
        return (
            <option key={option.optionValue} value={option.optionValue}>{option.optionValue}</option>
        )
    }

    isNullOrEmpty(value) {
        return value === null || value === '';
    }



    editProject() {    
        if ($("#activityDate").val() == null ||
            $("#activityContact").length == 0 ||
            $("#activityContactCompany").length == 0 ||
            $("#activityTask").val() == null ||
            $("#activityStatus").val() == "Klart" && this.isNullOrEmpty($("#ProjectResult").val()))
        {
            alert("Kontrollera fält.")
        }
        else {
            if (this.state.isCustomerGroup) {
                $.when(editProject($("#activityCustomer").val(), this.state.companyId, this.props.projectId, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                    if (status) {
                        $("#valueSuccessProject").show();
                        window.scrollTo(0, 0);

                        this.props.closeEditProjectModal();
                        setTimeout(function () {
                            $("#valueSuccessProject").hide();
                        }, 5000);

                        setTimeout();
                    }
                    else {
                        alert("Kunde inte redigera aktiviteten. Kontrollera att alla fält är ifyllda.")
                    }
                }.bind(this));
            }
            else {
                $.when(editProject(this.props.customerId, this.state.companyId, this.props.projectId, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                    if (status) {
                        $("#valueSuccessProject").show();
                        window.scrollTo(0, 0);

                        setTimeout(function () {
                            $("#valueSuccessProject").hide();
                        }, 5000);

                        setTimeout();
                    }
                    else {
                        alert("Kunde inte redigera aktiviteten. Kontrollera att alla fält är ifyllda.")
                    }
                }.bind(this));
            }
        }
    }

    
    dateChange(event) {
        component.setState({
            activityDate: event.target.value
        });
    }

    taskChange(event) {
        component.setState({
            activityTask: event.target.value
        });
    }

    descriptionChange(event) {
        component.setState({
            activityDescription: event.target.value
        });
    }

    nextStepChange(event) {
        component.setState({
            activityNextStep: event.target.value
        });
    }

    renderCustomer(customer) {
        return (
            <option key={customer.customerId} value={customer.customerId}>{customer.customerName}</option>
        )
    }

    //customerSelectChange(e) {
    //    var value = e.target.value;

    //    if (component.state.isCustomerGroup) {
    //        $.when(getCustomerContacts(component.state.companyId, value)).then(function successHandler(contacts) {
    //            component.setState({
    //                customerContacts: contacts,
    //            });
    //        }.bind(this));
    //    }
    //}

    renderCampaign(campaign) {
        return (
            <option value={campaign.id} key={campaign.id}>
                {campaign.title}
            </option>
        )
    }

    handleCompanyResponsiblesChange = (newList) => {
        this.setState({
            selectedCompanyResponsibles: newList
        })
    }

    handleStatusChange = (e) => {
        this.setState({ activityStatus: e.target.value });
    };

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                    <div className="col-sm-12" style={{ display: "grid" }}>
                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Redigera projekt
                        </h2>
                    </div>
                </div>

                <hr style={{ borderTop: "2px solid black" }} />
                <div id="valueSuccessProject" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Projektet har sparats</h4>
                </div>

                {this.state.activityDate != "" ?
                    (
                        <div className="row col-sm-12" style={{ margin: "0" }}>
                            <div className="col-sm-12">
                                <div className="col-sm-12">
                                    {($("#isAdmin").val() === "True" || $("#userId").val() === this.state.activityContactCompany || $("#userId").val() === this.state.activityContactCompany2) && (
                                        <BsPencilSquare
                                            style={{ cursor: "pointer", float: "right" }}
                                            onClick={() => this.setState({ disabled: !this.state.disabled })}
                                        />
                                    )}

                                    <label> Datum </label>
                                    <input type="date" id="activityDate" name="trip-start" className="form-control"
                                        min="2022-01-01" max="2030-12-31" value={this.state.activityDate.split('T')[0]} onChange={this.dateChange} disabled={this.state.disabled}/>
                                </div>

                                {this.state.isCustomerGroup ?
                                    (
                                        <div className="col-sm-12">
                                            <label> Kund </label>
                                            <select id="activityCustomer" className="form-control" disabled={this.state.disabled}>
                                                <option key={this.state.customerGroupId} value={this.state.customerGroupId}>Kundgrupp</option>
                                                {this.state.customers.map(d => {
                                                    return this.renderCustomer(d);
                                                })}
                                            </select>
                                        </div>
                                    ) : (<div> </div>)
                                }

                                <div className="col-sm-12" >
                                    <label> Prioritet </label>
                                    <select id="activityPrio" className="form-control" disabled={this.state.disabled}>
                                        <option value="Låg">Låg</option>
                                        <option value="Mellan">Mellan</option>
                                        <option value="Hög">Hög</option>
                                    </select>
                                </div>

                                <div className="col-sm-12">
                                    <label> Ansvarig hos kund </label>
                                    <select id="activityContact" className="form-control" disabled={this.state.disabled}>
                                        {this.state.customerContacts.map(d => {
                                            return this.renderCustomerContactSelect(d);
                                        })}
                                    </select>
                                </div>

                                <div className="col-sm-12">
                                    <label> Ansvarig säljare </label>
                                    {this.state.companyMembers != undefined ?
                                        (
                                            <select id="activityContactCompany" className="form-control" disabled={this.state.disabled}>
                                                {this.state.companyMembers.map(d => {
                                                    return this.renderCompanyMemberSelect(d);
                                                })}
                                            </select>
                                        ) :
                                        (
                                            <select id="activityContactCompany" className="form-control" disabled={this.state.disabled}>
                                            </select>
                                        )
                                    }
                                </div>

                                <div className="col-sm-12">
                                    <label> Medansvarig säljare(frivilligt) </label>
                                    {this.state.companyMembers != undefined ?
                                        (
                                            <select id="activityContactCompany2" className="form-control" disabled={this.state.disabled}>
                                                <option key="Ingen vald" value="Ingen vald">Ingen vald</option>
                                                {this.state.companyMembers.map(d => {
                                                    return this.renderCompanyMemberSelect(d);
                                                })}
                                            </select>
                                        ) :
                                        (
                                            <select id="activityContactCompany2" className="form-control" disabled={this.state.disabled}>
                                            </select>
                                        )
                                    }
                                </div>

                                <div className="col-sm-12">
                                    <label>Extra deltagande säljare(frivilligt)</label>
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
                            </div>

                            <div className="col-sm-12">
                                <div className="col-sm-12">
                                    <label> Projektnamn </label>
                                    <input id="activityTask" className="form-control" value={this.state.activityTask} onChange={this.taskChange} disabled={this.state.disabled}/>
                                </div>

                                <div className="col-sm-12">
                                    <label> Kort beskrivning </label>
                                    <textarea
                                        id="activityDescription"
                                        className="form-control"
                                        value={this.state.activityDescription}
                                        onChange={this.descriptionChange}
                                        disabled={this.state.disabled}
                                    />
                                </div>

                                <div className="col-sm-12">
                                    <label>Status</label>
                                    <select
                                        id="activityStatus"
                                        className="form-control"
                                        disabled={this.state.disabled}
                                        onChange={(e) => this.handleStatusChange(e)}>
                                       {/* value={this.stateselectedStatus}>*/}
                                            <option value="Ej påbörjat">Ej påbörjat</option>
                                            <option value="Pågående">Pågående</option>
                                            <option value="Klart">Klart</option>
                                    </select>
                                </div>

                                {this.state.activityStatus == 'Klart' && (
                                    <div className="col-sm-12">
                                        <label>Resultat av projekt</label>
                                        <select
                                            id="ProjectResult"
                                            value={this.state.selectedDropdownOption}
                                            onChange={(e) => this.setState({ selectedDropdownOption: e.target.value })}
                                            className="col-sm-12 form-control"
                                            disabled={this.state.disabled}>
                                            <option value="">Välj ett värde</option>
                                            {this.state.dropdownOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="col-sm-12">
                                    <label> Nästa steg </label>
                                    <input id="activityNextStep" className="form-control" value={this.state.activityNextStep} onChange={this.nextStepChange} disabled={this.state.disabled}/>
                                </div>
                            </div>

                            {this.state.activityStatus !== 'Klart' && (
                                <button
                                    onClick={() => {
                                        this.editProject();
                                        this.setState({ showDropdown: true });
                                    }}
                                    className="btn btn-primary"
                                    style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }}
                                    disabled={this.state.disabled}>
                                    Spara projekt
                                </button>
                            )}

                        </div>
                    ) : (
                        <div id="spinner" style={{ marginTop: "7px" }} className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    )
                } {/*end this.state.activityDate*/}

                {this.state.activityStatus === 'Klart' && (
                    <div className="col-sm-12" style={{ marginTop: "15px" }}>
                        <button
                            onClick={() => {
                                this.editProject();
                               
                                this.setState({ showDropdown: false });
                            }}
                            className="btn btn-success"
                            style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }}>
                            Spara projekt
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default EditProjectModal;