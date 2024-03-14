import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import ReactTooltip from "react-tooltip";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {
    getCustomersAndGroupsSearch, getCustomerContacts, getRoles,
    getMeetings, saveCustomerContact, saveMeeting,
    getFollowUps, getCompanyMembers,
    getOptions, getCampaigns,
    getCustomersInGroup, getMeetingsOfEntireCustomerGroup, removeMeeting,
    getResponsiblesCustomersAndGroups, getCustomerContactsSelect, getProjects, getProjectsOfEntireCustomerGroup, saveFollowUpOnCreateMeeting,
    getCompanyResponsiblesSelect, saveProject
} from "./requestHandler";
import Select from 'react-select'
import { BsInfoCircleFill, BsFillTrashFill, BsXLg } from 'react-icons/bs';

var component;
export class QuickRegister extends React.Component {
    constructor(props) {
        super(props);
        const d = new Date();
        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            customer: null,
            customers: [],
            selectedCustomer: null,
            customerContacts: [],
            customerContactsSelect: [],
            selectedContacts: [],
            companyResponsiblesSelect: [],
            selectedCompanyResponsibles: [],
            color: $('#color').val(),
            meetings: [],
            roles: [],
            followUps: [],
            today: d.getDate(),
            companyMembers: [],
            options: [],
            groupCustomers: [],
            cookie1: $.cookie("search_1"),
            cookie2: $.cookie("search_2"),
            cookie3: $.cookie("search_3"),
            removeMeeting: null,
            isCustomerGroup: false,
            customerProjects: [],
            projects: [],
            removeProject: null,
            isAddContactOpen: false,
            campaigns: [],
            projektArbeteActive: false,
            typeOfRegistration: "",

            dropdownOptions: ['Vunnet', 'Förlorat', 'Övrigt'],
            selectedDropdownOption: '',
            showDropdown: false
        }
        $("#spinner").hide();

        $.when(getRoles($('#companyId').val())).then(function successHandler(roles) {
            if (roles != undefined) {
                this.setState({
                    roles: roles
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
        $.when(getCompanyMembers()).then(function successHandler(data) {
            if (data != undefined) {
                this.setState({
                    companyMembers: data.sort((a, b) => (a.name > b.name) ? 1 : -1)
                })
                this.setSelected();
            }
            else {
            }
        }.bind(this));
        $.when(getResponsiblesCustomersAndGroups(this.state.companyId, $('#loggedInName').val())).then(function successHandler(data) { // Do initial default search and get the customers belonging to the salesman
            if (data != undefined) {
                this.setState({
                    customers: data,
                    selectedCustomer: null
                })
                this.setSelected();
                $("#spinner").hide();
            }
            else {
                $("#spinner").hide();
            }
        }.bind(this));
        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));
    }

    setSelected() {
        let element = document.getElementById("meetingResponsible");
        var name = $('#userId').val();
        element.value = name;
        $("#spinner").hide();
    }

    onChange() {
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        this.setState({
            customer: customer
        });
    }

    searchCustomers() {
        $("#spinner").show();
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        var c1 = $.cookie("search_1");
        var c2 = $.cookie("search_2");
        var c3 = $.cookie("search_3");


        $.cookie("search_1", e.value);
        $.cookie("search_2", c1);
        $.cookie("search_3", c2);

        this.setState({
            cookie1: e.value,
            cookie2: c1,
            cookie3: c2
        });

        $.when(getCustomersAndGroupsSearch(this.state.companyId, customer)).then(function successHandler(data) {
            if (data != undefined) {
                $("#spinner").hide();
                this.setState({
                    customers: data,
                    selectedCustomer: null
                })
            }
            else {
                $("#spinner").hide();
                alert("Ditt sökord fick inga matchningar.")
            }
        }.bind(this));
    }

    clearAllCookies() {
        $.cookie("search_1", "", { path: '/' });
        $.cookie("search_2", "", { path: '/' });
        $.cookie("search_3", "", { path: '/' });

        this.setState({
            cookie1: "",
            cookie2: "",
            cookie3: ""
        });
    }

    selectCustomer(customerId, customerName, isCustomerGroup, type) {
        var selectedCustomer = {
            name: customerName,
            id: customerId
        }
        $.when(getCustomerContacts(this.state.companyId, customerId)).then(function successHandler(data) {
            if (isCustomerGroup) {
                $.when(getMeetingsOfEntireCustomerGroup(customerId)).then(function successHandler(meetings) {
                    $.when(getProjectsOfEntireCustomerGroup(customerId)).then(function successHandler(projects) {
                        if (data != undefined) {
                            $("#spinner").hide();
                            this.setState({
                                customerContacts: data,
                                selectedCustomer: selectedCustomer,
                                meetings: meetings,
                                isCustomerGroup: isCustomerGroup,
                                customerProjects: projects,
                                typeOfRegistration: type
                            })
                            this.setSelected();
                        }
                        else {
                            $("#spinner").hide();
                        }
                    }.bind(this));
                }.bind(this));
            }
            else {
                $.when(getMeetings(this.state.companyId, customerId)).then(function successHandler(meetings) {
                    $.when(getProjects(this.state.companyId, customerId)).then(function successHandler(projects) {
                        if (data != undefined) {
                            $("#spinner").hide();
                            this.setState({
                                customerContacts: data,
                                selectedCustomer: selectedCustomer,
                                meetings: meetings,
                                isCustomerGroup: isCustomerGroup,
                                customerProjects: projects,
                                typeOfRegistration: type

                            })
                            this.setSelected();
                        }
                        else {
                            $("#spinner").hide();
                        }
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));

        $.when(getCustomerContactsSelect(this.state.companyId, customerId)).then(function successHandler(data) {
            if (data != undefined) {
                this.setState({
                    customerContactsSelect: data
                })
            }
            else {
            }
        }.bind(this));

        $.when(getFollowUps($('#companyId').val(), customerId)).then(function successHandler(followUps) {
            if (followUps != undefined) {
                $("#spinner").hide();
                this.setState({
                    followUps: followUps
                })
            }
            else {
                $("#spinner").hide();
            }
        }.bind(this));

        if (isCustomerGroup) {
            $.when(getCustomersInGroup(customerId).then(function successHandler(customers) {
                if (customers != undefined) {
                    $("#spinner").hide();
                    this.setState({
                        groupCustomers: customers
                    })
                }
                else {
                    $("#spinner").hide();
                }
            }.bind(this)));
        }
        else {
            this.setState({
                groupCustomers: []
            })
        }

    }

    renderCustomer(customer) {
        return (
            <tr key={customer.id} className="tableRow" style={{ borderBottom: "1px solid black", borderLeft: "7px solid " + color }}>
                <td style={{ padding: "0" }}>{customer.name}</td>
                <td style={{ padding: "0" }}>
                    {customer.type == "Customer" ?
                        (
                            <span>{customer.id} </span>
                        ) : (
                            <span>Kundgrupp</span>
                        )
                    }
                </td>
                <td style={{ width: "20%", padding: "5px 0 0 0"  }}>
                    {customer.type == "Customer" ?
                        (
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white", fontSize: "9px" }} onClick={() => this.selectCustomer(customer.id, customer.name, false, "customerMeeting")}>Kundaktiviteter</button>
                        ) : (
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white", fontSize: "9px"  }} onClick={() => this.selectCustomer(customer.id, customer.name, true, "customerMeeting")}>Kundaktiviteter</button>
                        )
                    }
                </td>
                <td style={{ width: "20%", padding: "5px 0 0 0" }}>
                    {customer.type == "Customer" ?
                        (
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white", fontSize: "9px"  }} onClick={() => this.selectCustomer(customer.id, customer.name, false, "project")}>Projekt</button>
                        ) : (
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white", fontSize: "9px"  }} onClick={() => this.selectCustomer(customer.id, customer.name, true, "project")}>Projekt</button>
                        )
                    }
                </td>
            </tr>
        )
    }

    renderCustomerContact(contact) {
        return (
            <li style={{ borderBottom: "1px solid #dee2e6" }} key={contact.name}>
                {contact.name}({contact.role}) {contact.telephone} {contact.email}
            </li>
        )
    }

    renderRole(role) {
        return (
            <option key={role.role}>
                {role.role}
            </option>
        )
    }

    renderProject(project) {
        return (
            <option value={project.projectId} key={project.projectId}>
                {project.activity}
            </option>
        )
    }

    renderOption(option) {
        return (
            <option key={option.optionValue} value={option.optionValue}>
                {option.optionValue}
            </option>
        )
    }

    toggleMeeting(date) {
        $("#meeting_" + date).toggle();
    }

    renderMeeting(meeting) {
        return (
            <tr key={meeting.date} className="tableRow" style={{ borderLeft: "7px solid " + color }} onClick={() => this.toggleMeeting(meeting.date)}>
                <td style={{ paddingTop: "18px" }}>{meeting.date.split('T')[0]}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.typeOfMeeting}</td>
                {this.state.isCustomerGroup ?
                    (
                        <td style={{ paddingTop: "18px" }}>{meeting.customerName}</td>

                    ) :
                    (
                        <td style={{ paddingTop: "18px" }}>{meeting.resultOfMeeting}</td>
                    )
                }
                <td style={{ paddingTop: "18px" }}>
                    <BsInfoCircleFill data-tip={meeting.comments} data-for="commentTip" />
                    <ReactTooltip id="commentTip" place="top" effect="solid" />
                </td>
                <td style={{ width: "20%" }}>
                    <Link to={"/EditMeeting/" + this.state.selectedCustomer.id + "/" + meeting.meetingId}><button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button></Link>
                </td>
                <td>
                    <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemove(meeting)} />
                </td>
            </tr>
        )
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.name + "-" + contact.role} value={contact.name}>{contact.name + "-" + contact.role}</option>
        )
    }

    renderCustomerContactSelectProject(contact) {
        return (
            <option key={contact.firstName + " " + contact.lastName + "-" + contact.role} value={contact.id}>{contact.firstName + " " + contact.lastName + "-" + contact.role}</option>
        )
    }


    renderCompanyMemberSelect(member) {
        return (
            <option key={member.id} value={member.id}>{member.name}</option>
        )
    }

    saveContact() {
        $.when(saveCustomerContact(this.state.selectedCustomer.id, this.state.companyId)).then(function successHandler(status) {
            if (status) {
                $("#contactFirstName").val(""),
                $("#contactLastName").val(""),
                $("#contactTelephone").val(""),
                $("#contactEmail").val(""),
                $("#valueSuccessContact").show();
                $.when(getCustomerContactsSelect(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(data) {
                    if (data != undefined) {
                        this.setState({
                            customerContactsSelect: data,
                            isAddContactOpen: false
                        })
                    }
                    else {
                    }
                }.bind(this));

                window.scrollTo(0, 0);

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

    saveMeeting() {
        var date = document.getElementById('meetingDate').value;
        if ($("#meetingResponsible").val() == null ||
            $("#meetingContact").length == 0 ||
            $("#meetingType").val() == null ||
            $("#meetingResult").val() == null ||
            !date) {
            alert("Kontrollera fält.")
        } 
        else {
            if (this.state.isCustomerGroup) {
                $.when(saveMeeting($("#meetingCustomer").val(), this.state.companyId, this.state.selectedCustomer.name, this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                    if (status) {
                        $.when(getMeetingsOfEntireCustomerGroup(this.state.selectedCustomer.id)).then(function successHandler(meetings) {
                                if (meetings != undefined) {
                                    $("#spinner").hide();
                                    $("#meetingComment").val();
                                    //$("#miscExplanation").val();
                                    this.setState({
                                        meetings: meetings,
                                        selectedContacts: []
                                    })
                                }
                                else {
                                    $("#spinner").hide();
                                }
                            }.bind(this));

                        $("#valueSuccessMeeting").show();
                        window.scrollTo(0, 0);

                        setTimeout(function () {
                            $("#valueSuccessMeeting").hide();
                        }, 5000);

                        setTimeout();
                    }
                    else {
                        alert("Kunde inte registrera aktiviteten. Kontrollera att alla fält är ifyllda.")
                    }
                }.bind(this));

                var dateFollowUp = document.getElementById('dateFollowUp').value;
                if (dateFollowUp != "") {
                    $.when(saveFollowUpOnCreateMeeting(this.state.companyId, $("#meetingCustomer").val())).then(function successHandler(status) {
                        if (status) {
                            $.when(getFollowUps(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(followUps) {
                                if (followUps != undefined) {
                                    $("#spinner").hide();
                                    this.setState({
                                        followUps: followUps
                                    })
                                }
                                else {
                                    $("#spinner").hide();
                                }
                            }.bind(this));
                            window.scrollTo(0, 0);

                            setTimeout();
                        }
                        else {
                            alert("Kunde inte registrera uppföljningen. Kontrollera att alla fält är ifyllda.")
                        }
                    }.bind(this));
                }
            }
            else {
                $.when(saveMeeting(this.state.selectedCustomer.id, this.state.companyId, this.state.selectedCustomer.name, this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                    if (status) {
                            $.when(getMeetings(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(meetings) {
                                if (meetings != undefined) {
                                    $("#spinner").hide();
                                    $("#meetingComment").val();
                                    //$("#miscExplanation").val();
                                    this.setState({
                                        meetings: meetings,
                                        selectedContacts: []
                                    })
                                }
                                else {
                                    $("#spinner").hide();
                                }
                            }.bind(this));

                        $("#valueSuccessMeeting").show();
                        window.scrollTo(0, 0);

                        setTimeout(function () {
                            $("#valueSuccessMeeting").hide();
                        }, 5000);

                        setTimeout();
                    }
                    else {
                        alert("Kunde inte registrera aktiviteten. Kontrollera att alla fält är ifyllda.")
                    }
                }.bind(this));

                var dateFollowUp = document.getElementById('dateFollowUp').value;
                if (dateFollowUp != "") {
                    $.when(saveFollowUpOnCreateMeeting(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(status) {
                        if (status) {
                            $.when(getFollowUps(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(followUps) {
                                if (followUps != undefined) {
                                    $("#spinner").hide();
                                    this.setState({
                                        followUps: followUps
                                    })
                                }
                                else {
                                    $("#spinner").hide();
                                }
                            }.bind(this));
                            window.scrollTo(0, 0);

                            setTimeout();
                        }
                        else {
                            alert("Kunde inte registrera uppföljningen. Kontrollera att alla fält är ifyllda.")
                        }
                    }.bind(this));
                }
            }
        }
    }

    saveProject()
    {
        if ($("#activityDate").val() == "" || $("#activityTask").val() == "" ||
           ($("#activityStatus").val() == "Klart" && this.isNullOrEmpty($("#ProjectResult").val())))
        {
            alert("Kontrollera fält.")
        }
        else {

            $.when(saveProject(this.state.selectedCustomer.id, this.state.companyId, this.state.selectedCompanyResponsibles)).then(function successHandler(status)
            {
                if (status)
                {
                    if (this.state.isCustomerGroup)
                    {
                        $.when(getProjectsOfEntireCustomerGroup(this.state.customerId).then(function successHandler(projects)
                        {
                            this.setState({
                                projects: projects,
                                originalProjects: projects,
                                selectedCompanyResponsibles: []
                            });
                        }.bind(this)));
                    }
                    else {
                        $.when(getProjects($('#companyId').val(), this.state.customerId)).then(function successHandler(projects) {
                            this.setState({
                                projects: projects,
                                originalProjects: projects,
                                selectedCompanyResponsibles: []
                            });
                        }.bind(this));
                    }
                    $("#valueSuccessProject").show();
                    window.scrollTo(0, 0);

                    document.getElementsByClassName("react-tabs__tab-list")[0]
                        .getElementsByTagName("li")[0].click();

                    setTimeout(function () {
                        $("#valueSuccessProject").hide();
                    }, 5000);

                    setTimeout();
                }
                else {
                    alert("Kunde inte spara projektet. Kontrollera att alla fält är ifyllda.")
                }
            }.bind(this));
        }
    }


    toggleAddContact() {
        $("#addContact").toggle();
        $("#showBtn").toggle();
        $("#hideBtn").toggle();
    }

    toggleAddMeeting() {
        $("#addMeeting").toggle();
        $("#showMeetingBtn").toggle();
        $("#hideMeetingBtn").toggle();
    }

    meetingResultChange() {
        var value = $("#meetingResult").val();
        if (value == "Övrigt") {
            //$("#miscExplanationBox").show();
        }
        else {
        //    $("#miscExplanationBox").hide();
        }
    }

    clearSelectedCustomer() {
        this.setState({
            selectedCustomer: null
        });
    }

    renderCustomerSelect(customer) {
        return (
            <option key={customer.customerId} value={customer.customerId}>{customer.customerName}</option>
        )
    }

    clickSearch(searchWord) {
        $.when(getCustomersAndGroupsSearch(this.state.companyId, searchWord)).then(function successHandler(data) {
            if (data != undefined) {
                $("#spinner").hide();
                this.setState({
                    customers: data,
                    customer: searchWord,
                    selectedCustomer: null
                })
            }
            else {
                $("#spinner").hide();
                alert("Ditt sökord fick inga matchningar.")
            }
        }.bind(this));
    }

    cancelRemove() {
        $("#removeBoxValued").hide();
        this.setState({
            removeMeeting: null
        })
    }

    showRemove(meeting) {
        $("#removeBoxValued").show();
        this.setState({
            removeMeeting: meeting
        })
    }

    async removeMeeting() {
        var meeting = this.state.removeMeeting;
        $.when(removeMeeting(meeting)).then(function successHandler(data) {
            if (data) {
                $.when(getMeetings(this.state.companyId, meeting.customerId)).then(function successHandler(meetings) {
                    if (data != undefined) {
                        $("#spinner").hide();
                        this.setState({
                            meetings: meetings,
                        })
                    }
                    else {
                        $("#spinner").hide();
                    }
                }.bind(this));
                $("#removeBoxValued").hide();
            }
            else {
                $("#removeBoxValued").hide();
                alert("Kunde inte radera kunden. Kontakta administratör om problemet kvarstår.")
            }
        }.bind(this));
    }

    renderRoleSelect(role) {
        return (
            <option value={role.role}>{role.role}</option>
        )
    }

    handleContactsChange = (e) => {
        this.setState({
            selectedContacts: Array.isArray(e) ? e.map(x => x.value) : []
        })
    }

    handleAddContactOpen() {
        this.setState({
            isAddContactOpen: true
        })
    }

    renderCampaign(campaign) {
        return (
            <option value={campaign.id} key={campaign.id}>
                {campaign.title}
            </option>
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
        component.setState({ isAddContactOpen: false })
    }

    handleCompanyResponsiblesChange = (e) => {
        this.setState({
            selectedCompanyResponsibles: Array.isArray(e) ? e.map(x => x.value) : []
        })
    }

    typeOfActivityChange(e) {
        this.setState({
            projektArbeteActive: e.target.value == "Projektarbete"
        });

        if(e.target.value == "Projektarbete") {
            $("#meetingResult").val("Övrigt");
            $("#meetingLocationType").val("Säljkontoret");   
            this.setState({
                selectedContacts: []
            });
        }
    }

    renderCompanyMemberSelect2(contact) {
        return (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
        )
    }

    handleStatusChange = (e) => {
        this.setState({ activityStatus: e.target.value });
    };

    isNullOrEmpty(value) {
        return value === null || value === '';
    }

    render() {
        return (
            <div>
                <div>
                    <nav className="navbar navbar-light light-blue lighten-4" style={{ backgroundColor: $('#color').val(), height: "70px" }}>
                        <a href="/" style={{ height: "100%" }}><img src={$('#logo').val()} style={{ height: "100%" }}/></a>
                        <div style={{ float: "right", display: "flex" }}>
                            <div className="username" style={{ color: "white", margin: "10px" }}> {$('#username').val()} </div>
                            <a id="prevLink" href="/"><i className="fas fa-arrow-circle-left" style={{ color: "white", fontSize: "44px" }}></i></a>
                        </div>
                    </nav>
                </div>
                <div className="container" style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                    {this.state.selectedCustomer == null ?
                        (
                            <div>
                                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                                    <div className="col-sm-12" style={{ display: "grid" }}>
                                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Sök kund (ej prospekt)</h2>
                                    </div>
                                </div>
                                <hr style={{ borderTop: "2px solid black" }} />
                                <div className="col-sm-12" style={{ display: "block", marginBottom: "6px" }}>
                                    <div className="col-sm-12" style={{ display: "flex" }}>
                                        <input id="selectedCustomer" className="form-control" onChange={() => this.onChange()} />
                                        <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.searchCustomers()}>Sök</button>
                                    </div>
                                </div>
                                <div className="col-sm-12" style={{ fontSize: "14px", textAlign: "center", display: "inline-grid" }}>
                                    <span style={{ fontWeight: "bold", paddingTop: "4px" }}>Sökhistorik: <BsFillTrashFill style={{ color: "red", cursor: "pointer" }} onClick={() => this.clearAllCookies()} /></span>
                                    <span onClick={() => this.clickSearch(this.state.cookie1)} className="clickableSearch" style={{ fontWeight: "400", cursor: "pointer" }}>{this.state.cookie1} </span>
                                    <span onClick={() => this.clickSearch(this.state.cookie2)} className="clickableSearch" style={{ fontWeight: "400", cursor: "pointer" }}>{this.state.cookie2} </span>
                                    <span onClick={() => this.clickSearch(this.state.cookie3)} className="clickableSearch" style={{ fontWeight: "400", cursor: "pointer" }}>{this.state.cookie3}</span>
                                </div>
                            </div>
                        ) : (<div></div>)}
                    <div id="valueSuccess" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                        <h4>Kontakten har sparats</h4>
                    </div>
                    <div id="valueSuccessFollowUp" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                        <h4>Uppföljningen har sparats</h4>
                    </div>
                    <div id="removeBoxValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                        <h4>Vill du ta bort aktiviteten?</h4>
                        <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeMeeting()}>Ta bort</button>
                        <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                    </div>
                    <div id="removeBoxValuedProject" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                        <h4>Vill du ta bort projektet?</h4>
                        <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeProject()}>Ta bort</button>
                        <button className="btn btn-warning" onClick={() => this.cancelRemoveProject()}>Avbryt</button>
                    </div>
                    {this.state.selectedCustomer != null && this.state.typeOfRegistration == "customerMeeting" &&
                        <div>
                            <div className="col-sm-12" style={{ textAlign: "center" }}>
                                <h4> {this.state.selectedCustomer.name}
                                    {!this.state.isCustomerGroup &&
                                        <Fragment>
                                            ({this.state.selectedCustomer.id})
                                            </Fragment>
                                    }
                                    <span onClick={() => this.clearSelectedCustomer()}>
                                        <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                                    </span>
                                </h4>
                            </div>
                            <div id="addMeeting" className="col-sm-12" style={{ marginTop: "15px", textAlign: "center" }}>
                                <div className="col-sm-12">
                                    <h4>Registrera kundaktivitet</h4>
                                </div>
                                <div id="valueSuccessMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                                    <h4>Aktiviteten har sparats</h4>
                                </div>
                                <div className="col-sm-12 col-md-6" style={{ padding: 0 }}>
                                    <div>
                                        <label> Datum </label>
                                        <input type="date" id="meetingDate" name="trip-start" className="form-control"
                                            min="2022-01-01" max="2030-12-31" required />
                                    </div>
                                    {this.state.groupCustomers.length > 0 ?
                                        (
                                            <div>
                                                <label> Kund </label>
                                                <select id="meetingCustomer" className="form-control">
                                                    {this.state.groupCustomers.map(d => {
                                                        return this.renderCustomerSelect(d);
                                                    })}
                                                </select>
                                            </div>
                                        ) : (<div> </div>)
                                    }
                                    <div>
                                        <label> Projekt(frivilligt) </label>
                                        <select id="meetingProject" className="form-control" disabled={this.state.companyId == "23c5b39f-6ea9-4e9b-b20a-27606982c79e"}>
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
                                        <select id="meetingType" className="form-control" onChange={(e) => { this.typeOfActivityChange(e) }}>
                                            {this.state.options.map(d => {
                                                return this.renderOption(d);
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label> Resultat av aktivitet </label>
                                        <select id="meetingResult" className="form-control" onChange={() => this.meetingResultChange()} disabled={this.state.projektArbeteActive}>
                                            <option value="Beställning/affär">Beställning/affär</option>
                                            <option value="Offert">Offert</option>
                                            <option value="Nytt möte">Nytt möte</option>
                                            <option value="Smarthyra">Smarthyra</option>
                                            <option value="Övrigt">Övrigt</option>
                                            <option value="Inget">Inget</option>
                                        </select>
                                        {/*<div className="col-sm-12" id="miscExplanationBox" style={{ display: "none", padding: "0" }}>*/}
                                        {/*    <label> Extra beskrivning(valfritt) </label>*/}
                                        {/*    <textarea id="miscExplanation" className="form-control" />*/}
                                        {/*</div>*/}
                                    </div>
                                    <div>
                                        <label> Typ av plats </label>
                                        <select id="meetingLocationType" className="form-control" disabled={this.state.projektArbeteActive}>
                                            <option value="Hos kund">Hos kund</option>
                                            <option value="Teams">Teams</option>
                                            <option value="På telefon">På telefon</option>
                                            <option value="Epost/mail">Epost/mail</option>
                                            <option value="Säljkontoret">Säljkontoret</option>
                                            <option value="Butik">Butik</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6" style={{ padding: 0 }}>
                                    <div>
                                        <label>Deltagare motpart</label>
                                        <Popup trigger={
                                            <span style={{ cursor: "pointer" }} onClick={this.handleAddContactOpen}><i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px" }}></i></span>
                                        } open={this.state.isAddContactOpen} position="left center">
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
                                            isMulti
                                            isDisabled={this.state.projektArbeteActive}
                                        />

                                    </div>
                                    <div>
                                        <label>Vår deltagare</label>
                                        <select id="meetingResponsible" className="form-control">
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
                                        <textarea id="meetingComment" className="form-control" maxlength="1500" />
                                    </div>
                                    <div>
                                        <label> Datum uppföljning(valfritt, notis till din mail) </label>
                                        <input type="date" id="dateFollowUp" name="trip-start" className="form-control"
                                            min="2022-01-01" max="2030-12-31" required />
                                    </div>
                                </div>
                                <button className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveMeeting()}>Registrera</button>
                            </div>
                        </div>
                    }
                    {this.state.selectedCustomer != null && this.state.typeOfRegistration == "project" &&
                        <div>
                            <div className="col-sm-12" style={{ textAlign: "center" }}>
                                <h4> {this.state.selectedCustomer.name}
                                    {!this.state.isCustomerGroup &&
                                        <Fragment>
                                        ({this.state.selectedCustomer.id})
                                            </Fragment>
                                    }
                                    <span onClick={() => this.clearSelectedCustomer()}>
                                        <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                                    </span>
                                </h4>
                            </div>
                        <div id="addProject" className="row col-sm-12" style={{ textAlign: "center" }}>
                            <div className="col-sm-12">
                                <h4> Lägg till nytt projekt </h4>
                            </div>
                            <div id="valueSuccessProject" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                                <h4>Aktiviteten har sparats</h4>
                            </div>
                            <div className="col-sm-12" >
                                <div className="col-sm-12" >
                                    <label> Datum </label>
                                    <input type="date" id="activityDate" className="form-control" />
                                </div>
                                {this.state.isCustomerGroup ?
                                    (
                                        <div className="col-sm-12" >
                                            <label> Kund </label>
                                            <select id="activityCustomer" className="form-control">
                                                {this.state.groupCustomers.map(d => {
                                                    return this.renderCustomerSelect(d);
                                                })}
                                            </select>
                                        </div>
                                    ) : (<div> </div>)
                                }
                                <div className="col-sm-12" >
                                    <label> Prioritet </label>
                                    <select id="activityPrio" className="form-control">
                                        <option value="Låg">Låg</option>
                                        <option value="Mellan">Mellan</option>
                                        <option value="Hög">Hög</option>
                                    </select>
                                </div>
                                <div className="col-sm-12" >
                                    <label> Ansvarig hos kund </label>
                                    <Popup trigger={
                                        <span style={{ cursor: "pointer" }} onClick={this.handleAddContactOpen}><i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i></span>
                                    } open={this.state.isAddContactOpen} position="left center">
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
                                    <select id="activityContact" className="form-control">
                                        {this.state.customerContacts.map(d => {
                                            return this.renderCustomerContactSelectProject(d);
                                        })}
                                    </select>
                                </div>
                                <div className="col-sm-12" >
                                    <label> Ansvarig säljare </label>
                                    <select id="activityContactCompany" className="form-control">
                                        {this.state.companyMembers.map(d => {
                                            return this.renderCompanyMemberSelect(d);
                                        })}
                                    </select>
                                </div>
                                <div className="col-sm-12" >
                                    <label> Medansvarig säljare(frivilligt) </label>
                                    <select id="activityContactCompany2" className="form-control">
                                        <option key={null} value={null}>Ingen vald</option>
                                        {this.state.companyMembers.map(d => {
                                            return this.renderCompanyMemberSelect2(d);
                                        })}
                                    </select>
                                </div>

                                <div className="col-sm-12">
                                    <label>Extra deltagande säljare(frivilligt)</label>
                                    <Select
                                        id="activityContact"
                                        options={this.state.companyResponsiblesSelect}
                                        closeMenuOnSelect={false}
                                        onChange={this.handleCompanyResponsiblesChange}
                                        isMulti />
                                </div>

                                <div className="col-sm-12" >
                                    <label> Projektnamn </label>
                                    <input id="activityTask" className="form-control" maxlength="30" />
                                </div>

                                <div className="col-sm-12" >
                                    <label> Kort beskrivning </label>
                                    <textarea id="activityDescription" className="form-control" />
                                </div>

                                <div className="col-sm-12" >
                                    <label> Status </label>
                                    <select id="activityStatus" className="form-control" onChange={(e) => this.handleStatusChange(e)}>
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

                                <div className="col-sm-12" >
                                    <label> Nästa steg </label>
                                    <input id="activityNextStep" className="form-control" />
                                </div>
                            </div>
                            <button id="saveContact" className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveProject()}>Spara</button>
                        </div>
                        </div>
                    }
                    {this.state.selectedCustomer == null &&
                            <div className="col-sm-12" style={{ overflow: "scroll" }}>
                                <Table style={{ textAlign: "left", fontSize: "9px" }}>
                                    <thead>
                                        <tr>
                                            <th>Namn</th>
                                            <th>Kundnummer</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.customers.map(d => {
                                            return this.renderCustomer(d);
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                    }
                </div>
                <footer class="text-center text-lg-start" style={{ backgroundColor: $('#color').val(), color: "white" }}>
                    <div class="container p-4">
                        <div class="row">
                            <div class="col-lg-6 col-md-12">
                                <div style={{ height: "50%" }}>
                                    <img src={$('#logo').val()} style={{ height: "100%", maxHeight: "100px" }}/>
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
        );
    }
}
