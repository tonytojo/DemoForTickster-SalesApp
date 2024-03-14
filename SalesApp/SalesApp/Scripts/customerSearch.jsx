import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsInfoCircleFill, BsFillTrashFill, BsXLg } from 'react-icons/bs';
import ReactTooltip from "react-tooltip";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {
    getCustomersAndGroupsSearch, getCustomerContacts, getRoles,
    getMeetings, saveCustomerContact, saveMeeting,
    getFollowUps, saveFollowUp, getCompanyMembers,
    downloadWeeklyReport, downloadWeeklyReportPDF, getOptions,
    getCustomersInGroup, getMeetingsOfEntireCustomerGroup, removeMeeting,
    getResponsiblesCustomersAndGroups, getCustomerContactsSelect, getProjects,
    getProjectsOfEntireCustomerGroup, getAllProjectsForSalesman, removeProject, getAllMeetingsForSalesman,
    saveFollowUpOnCreateMeeting, saveMeetingQuickAdd, getCampaigns, checkIfCustomerIsInCustomerGroup, getCompanyResponsiblesSelect
} from "./requestHandler";
import Select from 'react-select'
import { Modal } from "react-bootstrap";
import EditProjectModal from './editProjectModal';
import EditMeetingModal from './editMeetingModal';
import { Prospects } from './prospects';

export const classOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
];

export const statusOptions = [
    { value: "Ej påbörjat", label: "Ej påbörjat" },
    { value: "Pågående", label: "Pågående" },
    { value: "Klart", label: "Klart" },
];

export const statusPreselectedOptions = [
    { value: "Ej påbörjat", label: "Ej påbörjat" },
    { value: "Pågående", label: "Pågående" }
];

var component;
export class CustomerSearch extends React.Component {
    constructor(props) {
        super(props);
        const d = new Date();
        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            customer: null,
            customers: [],
            ownedCustomers: [],
            selectedCustomer: null,
            customerContacts: [],
            customerContactsSelect: [],
            companyResponsiblesSelect: [],
            selectedCompanyResponsibles: [],
            selectedContacts: [],
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
            initialProjects: [],
            projects: [],
            initialMeetings: [],
            removeProject: null,
            ownedMeetings: [],
            showDoneProjects: false,
            isAddContactOpen: false,
            userEmail: $("#username").val(),
            statusesSelected: null,
            projectIdToQuickAddMeeting: null,
            customerIdToQuickAddMeeting: null,
            salesmanIdToQuickAddMeeting: null,
            quickAddMeetingIsOpen: false,
            campaigns: [],
            showEditProjectModal: false,
            projectIdEditModal: null,
            showEditMeetingModal: false,
            meetingIdEditModal: null,
            customerIdEditModal: null,
            customersInQuickAdd: [],
            sortBy: 'name',         // Column to sort by (null for no sorting)
            sortDirection: 1,    // Sort direction: 1 for ascending, -1 for descending
            classesSelected: null,
            originalOwnedCustomers: [],
            sortByProject: 'date',         // Column to sort by (null for no sorting)
            sortDirectionProject: -1,    // Sort direction: 1 for ascending, -1 for descending
            sortByMeeting: 'date',         // Column to sort by (null for no sorting)
            sortDirectionMeeting: -1,    // Sort direction: 1 for ascending, -1 for descending,
            projektArbeteActive: false
        }

        $("#spinner").show();

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
            }
            else {
            }
        }.bind(this));
        $.when(getResponsiblesCustomersAndGroups(this.state.companyId, $('#loggedInName').val())).then(function successHandler(data) { // Do initial default search and get the customers belonging to the salesman
            if (data != undefined) {
                this.setState({
                    ownedCustomers: data,
                    originalOwnedCustomers: data,
                    selectedCustomer: null
                })
            }
            else {

            }
        }.bind(this));
        $.when(getAllProjectsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(projects) {
            var filteredProjects = [];
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].status != "Klart") {
                    filteredProjects.push(projects[i])
                }
            }
            this.setState({
                statusesSelected: statusPreselectedOptions,
                initialProjects: projects,
                projects: filteredProjects,
            });
            $("#spinner").hide();
        }.bind(this));
        $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
            this.setState({
                ownedMeetings: meetings,
                initialMeetings: meetings
            });
            $("#spinner").hide();
        }.bind(this));
        $.when(getCampaigns(this.state.companyId)).then(function successHandler(campaigns) {
            component.setState({
                campaigns: campaigns
            });
        });
        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));

    }

    setSelected() {
        $('#meetingResponsible').val($('#userId').val())
    }

    componentDidUpdate() {

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

    selectCustomer(customerId, customerName, isCustomerGroup) {
        var selectedCustomer = {
            name: customerName,
            id: customerId
        }
        if (isCustomerGroup) {
            $.when(getMeetingsOfEntireCustomerGroup(customerId)).then(function successHandler(meetings) {
                $.when(getProjectsOfEntireCustomerGroup(customerId)).then(function successHandler(projects) {
                    $.when(getCustomersInGroup(customerId).then(function successHandler(customers) {
                        $.when(getCustomerContactsSelect(this.state.companyId, customerId)).then(function successHandler(data) {
                            $.when(getCampaigns(this.state.companyId)).then(function successHandler(campaigns) {
                                $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
                                    $("#spinner").hide();
                                    this.setState({
                                        selectedCustomer: selectedCustomer,
                                        meetings: meetings,
                                        originalMeetings: meetings,
                                        isCustomerGroup: isCustomerGroup,
                                        customerProjects: projects,
                                        groupCustomers: customers,
                                        customerContactsSelect: data,
                                        campaigns: campaigns,
                                        companyResponsiblesSelect: responsiblesSelect
                                    },
                                        () => {
                                            document.getElementsByClassName("react-tabs__tab-list")[0]
                                                .getElementsByTagName("li")[0].click();

                                            setTimeout(() => {
                                                this.setSelected();
                                            }, 1000);
                                        })
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this)));
                }.bind(this));
            }.bind(this));
        }
        else {
            $.when(getCustomerContacts(this.state.companyId, customerId)).then(function successHandler(data) {
                $.when(getMeetings(this.state.companyId, customerId)).then(function successHandler(meetings) {
                    $.when(getProjects(this.state.companyId, customerId)).then(function successHandler(projects) {
                        $.when(getCustomerContactsSelect(this.state.companyId, customerId)).then(function successHandler(c) {
                            $.when(getCampaigns(this.state.companyId)).then(function successHandler(campaigns) {
                                $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
                                    if (data != undefined) {
                                        $("#spinner").hide();
                                        this.setState({
                                            customerContacts: data,
                                            selectedCustomer: selectedCustomer,
                                            meetings: meetings,
                                            originalMeetings: meetings,
                                            isCustomerGroup: isCustomerGroup,
                                            customerProjects: projects,
                                            customerContactsSelect: c,
                                            campaigns: campaigns,
                                            companyResponsiblesSelect: responsiblesSelect
                                        },
                                            () => {
                                                document.getElementsByClassName("react-tabs__tab-list")[0]
                                                    .getElementsByTagName("li")[0].click();

                                                setTimeout(() => {
                                                    this.setSelected();
                                                }, 1000);
                                            })
                                    }
                                    else {
                                        $("#spinner").hide();
                                    }
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }

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
    }

    filterMeetings() {
        var meetings = component.state.originalMeetings;

        if ($("#sellers").val() != "Alla") {
            meetings = meetings.filter(function (meeting) {
                return meeting.companyResponsible == $("#sellers").val();
            });
        }

        if ($("#weeks").val() != "Alla") {
            meetings = meetings.filter(function (meeting) {
                return meeting.weekNumber == $("#weeks").val();
            });
        }

        if ($("#years").val() != "Alla") {
            meetings = meetings.filter(function (meeting) {
                return meeting.date.includes($("#years").val()) == true;
            });
        }

        if ($("#result").val() != "Alla") {
            meetings = meetings.filter(function (meeting) {
                return meeting.resultOfMeeting.includes($("#result").val()) == true;
            });
        }

        component.setState({
            meetings: meetings
        });
    }

    renderCustomer(customer) {
        var color = null;
        if (customer.classification == "A")
            color = "green";
        if (customer.classification == "B")
            color = "blue";
        if (customer.classification == "C")
            color = "orange";
        if (customer.classification == "D")
            color = "red";
        return (
            <tr key={customer.id} className="tableRow" style={{ borderBottom: "1px solid black", borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{customer.name}</td>
                <td style={{ paddingTop: "18px" }}>
                    {customer.type == "Customer" ?
                        (
                            <span>{customer.id} </span>
                        ) : (
                            <span>Kundgrupp</span>
                        )
                    }
                </td>
                <td style={{ fontSize: "22px", color: color }} className="hideMobile">{customer.classification}</td>
                <td style={{ width: "20%" }}>
                    {this.state.companyId !== "23c5b39f-6ea9-4e9b-b20a-27606982c79e" && // Filtrera bort projekt för Skene Järn
                        <Fragment>
                            {customer.type == "Customer" ?
                                (
                                    <Link to={"/Projects/" + customer.id}><button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Projekt</button></Link>
                                ) : (
                                    <Link to={"/Projects/" + customer.id + "?customerGroup"}><button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Projekt</button></Link>
                                )
                            }
                        </Fragment>
                    }
                </td>
                <td style={{ width: "20%" }}>
                    {customer.type == "Customer" ?
                        (
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.selectCustomer(customer.id, customer.name, false)}>Kundaktiviteter</button>
                        ) : (
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.selectCustomer(customer.id, customer.name, true)}>Kundaktiviteter</button>
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

    renderCampaign(campaign) {
        return (
            <option value={campaign.id} key={campaign.id}>
                {campaign.title}
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
            <tr key={meeting.meetingId} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
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
                    {this.state.companyMembers.find(x => x.id === meeting.companyResponsible)
                        ? this.state.companyMembers.find(x => x.id === meeting.companyResponsible).name
                        : "Säljare borttagen"}
                </td>
                <td style={{ paddingTop: "18px" }}>
                    <BsInfoCircleFill data-tip={meeting.comments} data-for="commentTip" />
                    <ReactTooltip id="commentTip" place="top" effect="solid" />
                </td>
                {this.state.isCustomerGroup ?
                    (
                        <td style={{ width: "20%" }}>
                            <Link to={"/EditMeeting/" + meeting.customerId + "/" + meeting.meetingId}><button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button></Link>
                        </td>

                    ) :
                    (
                        <td style={{ width: "20%" }}>
                                <button onClick={() => { component.setState({ showEditMeetingModal: true, meetingIdEditModal: meeting.meetingId, customerIdEditModal: meeting.customerId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                        </td>
                    )
                }
                <td>
                    {($("#userId").val() === meeting.companyResponsible) && (
                        <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemove(meeting)} />
                    )}
                </td>
            </tr>
        )
    }

    renderMeeting2(meeting) {
        return (
            <tr key={meeting.meetingId} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{meeting.date.split('T')[0]}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.typeOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.resultOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.customerName}</td>
                {this.state.isCustomerGroup ?
                    (
                        <td style={{ width: "20%" }}>
                            <Link to={"/EditMeeting/" + meeting.customerId + "/" + meeting.meetingId}><button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button></Link>
                        </td>

                    ) :
                    (
                        <td style={{ width: "20%" }}>
                            <button onClick={() => { component.setState({ showEditMeetingModal: true, meetingIdEditModal: meeting.meetingId, customerIdEditModal: meeting.customerId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                        </td>
                    )
                }
                <td>
                    <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemove(meeting)} />
                </td>
            </tr>
        )
    }

    renderFollowUp(followUp) {
        return (
            <tr key={followUp.date} className="tableRow">
                <td style={{ paddingTop: "18px" }}>{followUp.date.split('T')[0]}</td>
                <td style={{ paddingTop: "18px" }}>{followUp.toEmail}</td>
                <td style={{ paddingTop: "18px" }}>
                    <BsInfoCircleFill data-tip={followUp.comment} data-for="commentTip" />
                    <ReactTooltip id="commentTip" place="top" effect="solid" />
                </td>
            </tr>
        )
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.name + "-" + contact.role} value={contact.name}>{contact.name + "-" + contact.role}</option>
        )
    }

    renderCompanyMemberSelect(member) {
        return (
            <option key={member.id} value={member.id}>{member.name}</option>
        )
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
            var name = this.state.selectedCustomer.name;
            if (this.state.isCustomerGroup) {
                name = $("#meetingCustomer option:selected").text();
            }

            $.when(saveMeeting(this.state.selectedCustomer.id, this.state.companyId, name, this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                if (status) {
                    if (this.state.isCustomerGroup) {
                        $.when(getMeetingsOfEntireCustomerGroup(this.state.selectedCustomer.id)).then(function successHandler(meetings) {
                            if (meetings != undefined) {
                                $("#spinner").hide();
                                $("#meetingComment").val();
                                //$("#miscExplanation").val();
                                this.setState({
                                    meetings: meetings,
                                    selectedContacts: [],
                                    selectedCompanyResponsibles: [],
                                    projektArbeteActive: false
                                })
                            }
                            else {
                                $("#spinner").hide();
                            }
                        }.bind(this));

                    }
                    else {
                        $.when(getMeetings(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(meetings) {
                            if (meetings != undefined) {
                                $("#spinner").hide();
                                $("#meetingComment").val();
                                //$("#miscExplanation").val();
                                this.setState({
                                    meetings: meetings,
                                    selectedContacts: [],
                                    selectedCompanyResponsibles: [],
                                    projektArbeteActive: false
                                })
                            }
                            else {
                                $("#spinner").hide();
                            }
                        }.bind(this));

                    }
                    $("#valueSuccessMeeting").show();

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

                    setTimeout(function () {
                        $("#valueSuccessMeeting").hide();
                        document.getElementsByClassName("react-tabs__tab-list")[0]
                            .getElementsByTagName("li")[1].click();
                    }, 2000);

                    setTimeout();
                }
                else {
                    alert("Kunde inte registrera aktiviteten. Kontrollera att alla fält är ifyllda.")
                }
            }.bind(this));
        }
    }

    saveMeetingFromQuickAddView() {
        var date = document.getElementById('meetingDate').value;
        if ($("#meetingResponsible").val() == null ||
            $("#meetingContact").length == 0 ||
            $("#meetingType").val() == null ||
            $("#meetingResult").val() == null ||
            !date) {
            alert("Kontrollera fält.")
        }
        else {

            $.when(saveMeetingQuickAdd(this.state.customerIdToQuickAddMeeting, this.state.companyId, null, this.state.selectedContacts, this.state.selectedCompanyResponsibles)).then(function successHandler(status) {
                if (status) {
                    $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
                        this.setState({
                            ownedMeetings: meetings,
                            initialMeetings: meetings,
                            projectIdToQuickAddMeeting: null,
                            quickAddMeetingIsOpen: false,
                            selectedContacts: [],
                            customerIdToQuickAddMeeting: null,
                            selectedContacts: [],
                            selectedCompanyResponsibles: [],
                            projektArbeteActive: false
                        });
                        $("#spinner").hide();
                    }.bind(this));
                }
                else {
                    alert("Kunde inte registrera aktiviteten. Kontrollera att alla fält är ifyllda.")
                }
            }.bind(this));

            var dateFollowUp = document.getElementById('dateFollowUp').value;
            if (dateFollowUp != "") {
                $.when(saveFollowUpOnCreateMeeting(this.state.companyId, this.state.customerIdToQuickAddMeeting)).then(function successHandler(status) {
                    if (status) {
                        $.when(getFollowUps(this.state.companyId, this.state.customerIdToQuickAddMeeting)).then(function successHandler(followUps) {
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

    saveFollowUp() {
        $.when(saveFollowUp(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(status) {
            if (status) {
                $.when(getFollowUps(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(followUps) {
                    if (followUps != undefined) {
                        $("#spinner").hide();
                        $("#followUpComment").val();
                        $("#followUpEmail").val();
                        this.setState({
                            followUps: followUps
                        })
                    }
                    else {
                        $("#spinner").hide();
                    }
                }.bind(this));
                $("#valueSuccessFollowUp").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $("#valueSuccessFollowUp").hide();
                }, 5000);

                setTimeout();
            }
            else {
                alert("Kunde inte registrera uppföljningen. Kontrollera att alla fält är ifyllda.")
            }
        }.bind(this));
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
        //    $("#miscExplanationBox").show();
        }
        else {
        //    $("#miscExplanationBox").hide();
        }
    }

    downloadWeeklyReport() {
        var type = "";
        var value = "";
        if ($("#dateTypeProtocol").val() == "Vecka") {
            type = "Vecka";
            value = $("#protocolWeek").val();
        }
        if ($("#dateTypeProtocol").val() == "Månad") {
            type = "Månad";
            value = $("#protocolMonth").val();
        }
        if ($("#dateTypeProtocol").val() == "År") {
            type = "År";
            value = $("#protocolYear").val();
        }

        $("#spinner").show();
        $.when(downloadWeeklyReport(this.state.companyId, type, value)).then(function successHandler(fileName) {
            if (fileName != "") {
                $.when(this.download("/Excel/Download", fileName)).then(function successHandler(status) {
                    $("#spinner").hide();
                    setTimeout(function () {
                        component.deleteFile(fileName);
                    }, 5000);

                    setTimeout();
                }.bind(this));
            }
            else {
                $("#spinner").hide();
                alert("Kontrollera att det finns aktiviteter och/eller projekt kopplade till användaren inom det angivna datumintervallet")
            }
        }.bind(this));
    }

    downloadWeeklyReportPDF() {
        var type = "";
        var value = "";
        if ($("#dateTypeProtocol").val() == "Vecka") {
            type = "Vecka";
            value = $("#protocolWeek").val();
        }
        if ($("#dateTypeProtocol").val() == "Månad") {
            type = "Månad";
            value = $("#protocolMonth").val();
        }
        if ($("#dateTypeProtocol").val() == "År") {
            type = "År";
            value = $("#protocolYear").val();
        }
        $("#spinner").show();
        $.when(downloadWeeklyReportPDF(this.state.companyId, type, value)).then(function successHandler(fileName) {
            if (fileName != "") {
                $.when(this.download("/PDF/Download", fileName + ".pdf")).then(function successHandler(status) {
                    $("#spinner").hide();
                    setTimeout(function () {
                        component.deleteFilePdf(fileName);
                    }, 5000);

                    setTimeout();
                }.bind(this));
            }
            else {
                $("#spinner").hide();
                alert("Kontrollera att det finns aktiviteter och/eller projekt kopplade till användaren inom det angivna datumintervallet")
            }
        }.bind(this));
    }

    download(url, filename) {
        axios({
            url: url + "?filename=" + filename,
            method: 'POST',       // Worked using POST or PUT. Prefer POST
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        });
    }

    deleteFile(filename) {
        axios({
            url: "/Excel/DeleteFile?filename=" + filename,
            method: 'POST',
            responseType: 'blob', // important
        }).then((response) => {

        });
    }

    deleteFilePdf(filename) {
        axios({
            url: "/Pdf/DeleteFile?filename=" + filename,
            method: 'POST',
            responseType: 'blob', // important
        }).then((response) => {

        });
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
                $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
                    this.setState({
                        ownedMeetings: meetings,
                    });
                    $("#spinner").hide();
                }.bind(this));
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

    saveContact() {
        if (this.state.isCustomerGroup) {
            $.when(saveCustomerContact(this.state.selectedCustomer.id, this.state.companyId)).then(function successHandler(status) {
                if (status) {
                    $("#spinner").hide();

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
        else {
            $.when(saveCustomerContact(this.state.selectedCustomer.id, this.state.companyId)).then(function successHandler(status) {
                if (status) {
                    $("#spinner").hide();

                    $("#contactName").val(""),
                    $("#contactTelephone").val(""),
                    $("#contactEmail").val(""),
                    $("#valueSuccessContact").show();

                    $.when(getCustomerContactsSelect(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(data) {
                        if (data != undefined) {
                            this.setState({
                                customerContactsSelect: data
                            })
                        }
                        else {
                        }
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
    }

    handleContactsChange = (e) => {
        this.setState({
            selectedContacts: Array.isArray(e) ? e.map(x => x.value) : []
        })
    }

    renderProjectTableItem(project) {
        var dateString = project.date.split('T')[0];

        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var color = "black";
        if (Date.parse(project.date) < now && project.status == "Ej påbörjat") {
            color = "red";
        }

        var borderColor = null;
        if (project.status == "Ej påbörjat")
            borderColor = "lightgray";
        if (project.status == "Pågående")
            borderColor = "blue";
        if (project.status == "Klart")
            borderColor = "green";

        var color
        return (
            <tr key={project.projectId} className="tableRow" style={{ borderLeft: "7px solid " + borderColor }}>
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                <td style={{ paddingTop: "18px" }}>{project.activity}</td>
                <td style={{ paddingTop: "18px", color: color  }}>{project.status}</td>
                <td style={{ paddingTop: "18px" }}>{project.customerName}</td>
                <td style={{ paddingTop: "14px" }}>
                    <button className="btn btn-primary" onClick={() => this.openAddMeetingModal(project.customerId, project.projectId)} style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>+ Kundaktivitet</button>
                </td>
                <td style={{ paddingTop: "14px" }}>
                    <button onClick={() => { component.setState({ showEditProjectModal: true, projectIdEditModal: project.projectId, customerIdEditModal: project.customerId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                </td>
                <td>
                    <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemoveProject(project)} />
                </td>
            </tr>
        )
    }

    cancelRemoveProject() {
        $("#removeBoxValuedProject").hide();
        this.setState({
            removeProject: null
        })
    }

    showRemoveProject(project) {
        $("#removeBoxValuedProject").show();
        this.setState({
            removeProject: project
        })
    }

    async removeProject() {
        var project = this.state.removeProject;
        $.when(removeProject(project)).then(function successHandler(data) {
            if (data) {

                $.when(getAllProjectsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(projects) {
                    this.setState({
                        projects: projects,
                    });
                }.bind(this));
                $("#removeBoxValuedProject").hide();
            }
            else {
                $("#removeBoxValuedProject").hide();
                alert("Kunde inte radera projektet. Kontakta administratör om problemet kvarstår.")
            }
        }.bind(this));
    }

    customerSelectChange(e) {
        var value = e.target.value;

        $.when(getCustomerContactsSelect(component.state.companyId, value)).then(function successHandler(data) {
            $("#spinner").hide();
            component.setState({
                customerContactsSelect: data
            })
        }.bind(this));
    }

    changeDateTypeProtocol(e) {
        var value = e.target.value;

        if (value == "Vecka") {
            $("#protocolWeek").show();
            $("#protocolMonth").hide();
            $("#protocolYear").hide();
        }
        if (value == "Månad") {
            $("#protocolWeek").hide();
            $("#protocolMonth").show();
            $("#protocolYear").hide();
        }
        if (value == "År") {
            $("#protocolWeek").hide();
            $("#protocolMonth").hide();
            $("#protocolYear").show();
        }
    }

    renderSeller(seller) {
        return (
            <option value={seller.id}>
                {seller.name}
            </option>
        )
    }

    onProjectsFilter() {
        var initialProjects = component.state.initialProjects;
        var statuses = component.state.statusesSelected;

        var from = "1970-01-01";
        var to = "2050-01-01";
        if ($("#dateRangeProjectsFrom").val() != "")
            from = $("#dateRangeProjectsFrom").val();
        if ($("#dateRangeProjectsTo").val() != "")
            to = $("#dateRangeProjectsTo").val();
        from = from.replace('-', '');
        from = from.replace('-', '');
        from = parseInt(from);
        to = to.replace('-', '');
        to = to.replace('-', '');
        to = parseInt(to);

        var filteredProjects = [];

        if (statuses.length > 0) {
            filteredProjects = initialProjects.filter(function (project) {
                return statuses.filter(e => e.value === project.status).length > 0
            });
        }
        else {
            filteredProjects = initialProjects;
        }

        var projects = [];
        for (let i = 0; i < filteredProjects.length; i++) {
            var d = filteredProjects[i].date.split('T')[0];
            d = d.replace('-', '');
            d = d.replace('-', '');
            d = parseInt(d);
            if (d >= from && d <= to) {
                projects.push(filteredProjects[i])
            }
        }

        var uniqueArray = [...new Set(projects)]; // remove duplicates

        component.setState({
            projects: uniqueArray
        })      
    }

    onMeetingsFilter() {
        var initialMeetings = [...component.state.initialMeetings];
        var from = "1970-01-01";
        var to = "2050-01-01";
        if ($("#dateRangeMeetingsFrom").val() != "")
            from = $("#dateRangeMeetingsFrom").val();
        if ($("#dateRangeMeetingsTo").val() != "")
            to = $("#dateRangeMeetingsTo").val();
        from = from.replace('-', '');
        from = from.replace('-', '');
        from = parseInt(from);
        to = to.replace('-', '');
        to = to.replace('-', '');
        to = parseInt(to);

        var filteredMeetings = [];

        if ($("#resultFilterMeetings").val() === "Alla") {
            filteredMeetings = initialMeetings;
        }
        else {
            var res = $("#resultFilterMeetings").val();
            for (let i = 0; i < initialMeetings.length; i++) {
                if (initialMeetings[i].resultOfMeeting === res) {
                    filteredMeetings.push(initialMeetings[i])
                }
            }
        }

        var meetings = [];
        for (let i = 0; i < filteredMeetings.length; i++) {
            var d = filteredMeetings[i].date.split('T')[0];
            d = d.replace('-', '');
            d = d.replace('-', '');
            d = parseInt(d);
            if (d >= from && d <= to) {
                meetings.push(filteredMeetings[i])
            }
        }

        component.setState({
            ownedMeetings: meetings
        })
    }

    handleAddContactOpen() {
        this.setState({
            isAddContactOpen: true
        })
    }

    onEmailChange = (e) => {
        this.setState({
            userEmail: e.target.value
        })
    }

    handleStatusChange = (newList) => {
        this.setState({
            statusesSelected: newList
        }, () => {
            this.onProjectsFilter();
        })
    }

    openAddMeetingModal(customerId, projectId) {
        $.when(checkIfCustomerIsInCustomerGroup(customerId)).then(function successHandler(response) {
            if (response.belongsToCustomerGroup == true) {
                $.when(getCustomerContactsSelect($('#companyId').val(), response.customerGroupId)).then(function successHandler(customerContactsSelect) {
                    $.when(getCustomersInGroup(response.customerGroupId)).then(function successHandler(customers) {
                        this.setState({
                            customerContactsSelect: customerContactsSelect,
                            projectIdToQuickAddMeeting: projectId,
                            quickAddMeetingIsOpen: true,
                            customerIdToQuickAddMeeting: customerId,
                            salesmanIdToQuickAddMeeting: $("#userId").val(),
                            customersInQuickAdd: customers
                    });
                    }.bind(this));
                }.bind(this));
            }
            else {
                $.when(getCustomerContactsSelect($('#companyId').val(), customerId)).then(function successHandler(customerContactsSelect) {
                    this.setState({
                        customerContactsSelect: customerContactsSelect,
                        projectIdToQuickAddMeeting: projectId,
                        quickAddMeetingIsOpen: true,
                        customerIdToQuickAddMeeting: customerId,
                        salesmanIdToQuickAddMeeting: $("#userId").val(),
                        customersInQuickAdd: []
                    });
                }.bind(this));
            }
        }.bind(this));
    }

    closeAddMeetingModal() {
        this.setState({
            projectIdToQuickAddMeeting: null,
            quickAddMeetingIsOpen: false,
            customerIdToQuickAddMeeting: null,
            salesmanIdToQuickAddMeeting: null
        });
    }

    renderSortIcon = (column) => {
        if (this.state.sortBy === column) {
            return this.state.sortDirection === 1 ? '↑' : '↓';
        }
        return null;
    };

    handleSort = (column) => {
        if (column === this.state.sortBy) {
            this.setState((prevState) => ({
                sortDirection: -prevState.sortDirection,
            }));
        } else {
            this.setState({
                sortBy: column,
                sortDirection: 1,
            });
        }
    };

    sortCustomers = (customers) => {
        const { sortBy, sortDirection } = this.state;

        if (!sortBy) {
            return customers;
        }

        return [...customers].sort((a, b) => {
            const propA = a[sortBy];
            const propB = b[sortBy];

            // Handle null values
            if (propA === null && propB === null) {
                return 0;
            } else if (propA === null) {
                return sortDirection === 1 ? 1 : -1;
            } else if (propB === null) {
                return sortDirection === 1 ? -1 : 1;
            }

            // Compare non-null values
            return propA.localeCompare(propB) * sortDirection;
        });
    };

    renderSortIconProject = (column) => {
        if (this.state.sortByProject === column) {
            return this.state.sortDirectionProject === 1 ? '↑' : '↓';
        }
        return null;
    };

    handleSortProject = (column) => {
        if (column === this.state.sortByProject) {
            this.setState((prevState) => ({
                sortDirectionProject: -prevState.sortDirectionProject,
            }));
        } else {
            this.setState({
                sortByProject: column,
                sortDirectionProject: 1,
            });
        }
    };

    sortProjects = (projects) => {
        const { sortByProject, sortDirectionProject } = this.state;

        if (!sortByProject) {
            return projects;
        }

        return [...projects].sort((a, b) => {
            const propA = a[sortByProject];
            const propB = b[sortByProject];

            // Handle null values
            if (propA === null && propB === null) {
                return 0;
            } else if (propA === null) {
                return sortDirectionProject === 1 ? 1 : -1;
            } else if (propB === null) {
                return sortDirectionProject === 1 ? -1 : 1;
            }

            // Compare non-null values
            return propA.localeCompare(propB) * sortDirectionProject;
        });
    };

    renderSortIconMeeting = (column) => {
        if (this.state.sortByMeeting === column) {
            return this.state.sortDirectionMeeting === 1 ? '↑' : '↓';
        }
        return null;
    };

    handleSortMeeting = (column) => {
        if (column === this.state.sortByMeeting) {
            this.setState((prevState) => ({
                sortDirectionMeeting: -prevState.sortDirectionMeeting,
            }));
        } else {
            this.setState({
                sortByMeeting: column,
                sortDirectionMeeting: 1,
            });
        }
    };

    sortMeetings = (meetings) => {
        const { sortByMeeting, sortDirectionMeeting } = this.state;

        if (!sortByMeeting) {
            return meetings;
        }

        return [...meetings].sort((a, b) => {
            const propA = a[sortByMeeting];
            const propB = b[sortByMeeting];

            // Handle null values
            if (propA === null && propB === null) {
                return 0;
            } else if (propA === null) {
                return sortDirectionMeeting === 1 ? 1 : -1;
            } else if (propB === null) {
                return sortDirectionMeeting === 1 ? -1 : 1;
            }

            // Compare non-null values
            return propA.localeCompare(propB) * sortDirectionMeeting;
        });
    };

    filterOwnedCustomers() {
        var classes = component.state.classesSelected;

        if (classes && classes.length > 0) {
            var customers = component.state.originalOwnedCustomers.filter(function (customer) {
                return classes.filter(e => e.value === customer.classification).length > 0
            });

            if ($("#types").val() != "Alla typer") {
                customers = customers.filter(function (customer) {
                    return customer.type == $("#types").val();
                });
            }

            component.setState({
                ownedCustomers: customers.sort((a, b) => (a.classification > b.classification) ? 1 : -1)
            });
        }
        else {
            if ($("#types").val() != "Alla typer") {
                var customers = component.state.originalOwnedCustomers.filter(function (customer) {
                    return customer.type == $("#types").val();
                });

                component.setState({
                    ownedCustomers: customers.sort((a, b) => (a.classification > b.classification) ? 1 : -1)
                });
            }
            else {
                component.setState({
                    ownedCustomers: component.state.originalOwnedCustomers.sort((a, b) => (a.classification > b.classification) ? 1 : -1)
                });
            }
        }

    }

    handleClassesChange = (newList) => {
        this.setState({
            classesSelected: newList
        }, () => {
            this.filterOwnedCustomers();
        })
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

    closePopup = () => {
        component.setState({ isAddContactOpen: false });
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

        if (e.target.value == "Projektarbete") {
            $("#meetingResult").val("Övrigt");
            $("#meetingLocationType").val("Säljkontoret");
            this.setState({
                selectedContacts: []
            });
        }
    }

    closeEditMeetingModal() {
        component.setState({
            showEditMeetingModal: false,
            meetingIdEditModal: null
        });

        $.when(getAllProjectsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(projects) {
            var filteredProjects = [];
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].status != "Klart") {
                    filteredProjects.push(projects[i])
                }
            }
            component.setState({
                initialProjects: projects,
                projects: filteredProjects,
            });
            $("#spinner").hide();
        }.bind(this));

        $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
            component.setState({
                ownedMeetings: meetings,
                initialMeetings: meetings
            });
            $("#spinner").hide();
        }.bind(this));

        if (component.state.selectedCustomer != null) {
            $.when(getMeetings(component.state.companyId, component.state.selectedCustomer.id)).then(function successHandler(meetings) {
                if (meetings != undefined) {
                    $("#spinner").hide();
                    component.setState({
                        meetings: meetings,
                        originalMeetings: meetings
                    })
                    component.setSelected();
                }
                else {
                    $("#spinner").hide();
                }

            }.bind(this));
        }
    }

    closeEditProjectModal() {
        component.setState({ showEditProjectModal: false });
        $.when(getAllProjectsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(projects) {
            var filteredProjects = [];
            //for (let i = 0; i < projects.length; i++) {
            //    if (projects[i].status != "Klart") {
            //        filteredProjects.push(projects[i])
            //    }
            //}
            component.setState({
                initialProjects: projects,
                projects: filteredProjects,
            },
                () => {
                    component.onProjectsFilter();
                });
            $("#spinner").hide();
        }.bind(this));
        $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
            component.setState({
                ownedMeetings: meetings,
                initialMeetings: meetings
            });
            $("#spinner").hide();
        }.bind(this));
    }

    render() {
        const sortedMyCustomers = this.sortCustomers(this.state.ownedCustomers);
        const sortedMyProjects = this.sortProjects(this.state.projects);
        const sortedMyMeetings = this.sortMeetings(this.state.ownedMeetings);

        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div id="valueSuccess" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Kontakten har sparats</h4>
                </div>
                <div id="valueSuccessFollowUp" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Uppföljningen har sparats</h4>
                </div>
                {this.state.selectedCustomer != null ?
                    (
                        <Fragment>
                            <Tabs>
                                <div className="col-sm-12" style={{ display: "grid", textAlign: "center" }}>
                                    <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Kundaktiviteter</h2>
                                    <h4 style={{ marginTop: "15px", marginBottom: "0" }}>
                                        {this.state.selectedCustomer.name}
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
                                <hr style={{ borderTop: "2px solid black" }} />
                            <TabList>
                                <Tab>Registrera</Tab>
                                <Tab>Kundaktiviteter</Tab>
                            </TabList>
                            <TabPanel>
                                <div id="addMeeting" className="row col-sm-12" style={{ marginTop: "15px", textAlign: "center" }}>
                                    <div className="col-sm-12">
                                        <h4>Registrera kundaktivitet</h4>
                                    </div>
                                    <div id="valueSuccessMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                                        <h4>Aktiviteten har sparats</h4>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div>
                                            <label> Datum </label>
                                            <input type="date" id="meetingDate" name="trip-start" className="form-control"
                                                min="2022-01-01" max="2030-12-31" required />
                                        </div>
                                        {this.state.isCustomerGroup == true ?
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
                                    <div className="col-sm-12 col-md-6">
                                        <div>
                                            <label>Deltagare motpart</label>
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
                                                <select id="meetingResponsible" className="form-control" defaultValue={$("#userId").val()}>
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
                                            <textarea id="meetingComment" className="form-control" maxlength="1500"/>
                                        </div>
                                        <div>
                                            <label> Datum uppföljning(valfritt, notis till din mail) </label>
                                            <input type="date" id="dateFollowUp" name="trip-start" className="form-control"
                                                min="2022-01-01" max="2030-12-31" required />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveMeeting()}>Registrera</button>
                                </div>

                            </TabPanel>                           
                            <TabPanel>
                                <div className="col-sm-12">
                                    <div className="row" style={{ marginTop: "15px" }}>
                                        <div className="col-sm-12" style={{ textAlign: "center" }}>
                                            <h4>Registrerade kundaktiviteter</h4>
                                            <hr style={{ borderTop: "2px solid black" }} />
                                            <div id="removeBoxValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                                <h4>Vill du ta bort aktiviteten?</h4>
                                                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeMeeting()}>Ta bort</button>
                                                <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                                            </div>
                                            <div className="col-sm-12 row" style={{ margin: "0", display: "flex", paddingBottom: "5px" }}>
                                                <div className="col-sm-12 col-md-3">
                                                    <select id="years" className="form-control" style={{ textAlign: "center", marginTop: "5px" }} onChange={this.filterMeetings}>
                                                        <option value="Alla">Alla år</option>
                                                        <option value="2021">2021</option>
                                                        <option value="2022">2022</option>
                                                        <option value="2023">2023</option>
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                        <option value="2026">2026</option>
                                                        <option value="2027">2027</option>
                                                        <option value="2028">2028</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-12 col-md-3">
                                                    <select id="weeks" className="form-control" style={{ textAlign: "center", marginTop: "5px" }} onChange={this.filterMeetings}>
                                                        <option value="Alla">Alla veckor</option>
                                                        {(function (rows, i, len) {
                                                            while (++i <= len) {
                                                                rows.push(<option value={i}>{i}</option>)
                                                            }
                                                            return rows;
                                                        })([], 0, 53)}

                                                    </select>
                                                </div>
                                                <div className="col-sm-12 col-md-3">
                                                    <select id="sellers" className="form-control" style={{ textAlign: "center", marginTop: "5px" }} onChange={this.filterMeetings}>
                                                        <option value="Alla">Alla säljare</option>
                                                        {this.state.companyMembers.map(d => {
                                                            return this.renderSeller(d);
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-sm-12 col-md-3">
                                                    <select id="result" className="form-control" style={{ textAlign: "center", marginTop: "5px" }}  onChange={this.filterMeetings}>
                                                        <option value="Alla">Alla resultat</option>
                                                        <option value="Beställning/affär">Beställning/affär</option>
                                                        <option value="Offert">Offert</option>
                                                        <option value="Nytt möte">Nytt möte</option>
                                                        <option value="Smarthyra">Smarthyra</option>
                                                        <option value="Övrigt">Övrigt</option>
                                                        <option value="Inget">Inget</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "600px" }}>
                                                <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                        <tr>
                                                            <th>Datum</th>
                                                            <th>Typ av aktivitet</th>
                                                            {this.state.isCustomerGroup ?
                                                                (
                                                                    <th>Kund</th>
                                                                ) :
                                                                (
                                                                    <th>Resultat av aktivitet</th>
                                                                )
                                                                }
                                                            <th>Säljare</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ backgroundColor: "white" }}>
                                                        {this.state.meetings.map(d => {
                                                            return this.renderMeeting(d);
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            </Tabs>
                            {component.state.meetingIdEditModal != null &&
                                <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                                    show={component.state.showEditMeetingModal}
                                    onHide={() => {
                                        component.setState({ showEditMeetingModal: false });
                                        $.when(getMeetings(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(meetings) {
                                            if (meetings != undefined) {
                                                $("#spinner").hide();
                                                this.setState({
                                                    meetings: meetings,
                                                    originalMeetings: meetings
                                                })
                                                this.setSelected();
                                            }
                                            else {
                                                $("#spinner").hide();
                                            }

                                        }.bind(this));

                                }}>
                                    <Modal.Header closeButton>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <EditMeetingModal meetingId={component.state.meetingIdEditModal} customerId={component.state.customerIdEditModal} closeEditMeetingModal={component.closeEditMeetingModal} />
                                    </Modal.Body>
                                </Modal>
                            }
                        </Fragment>
                    ) :
                    (
                        <Fragment>
                        <Tabs>
                            <TabList>
                                <Tab>Mina kunder</Tab>
                                <Tab>Mina aktiviteter</Tab>
                                <Tab>Sök kund</Tab>
                                <Tab>Prospekt</Tab>
                            </TabList>
                            <TabPanel>
                                    <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                                        <div className="col-sm-12" style={{ display: "grid" }}>
                                            <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Mina kunder</h2>
                                        </div>
                                    </div>
                                    <hr style={{ borderTop: "2px solid black" }} />
                                    <div className="col-sm-12" style={{ margin: "0", display: "flex", padding: "5px", paddingLeft: "15px" }}>
                                        {/*<div className="col-sm-12 col-md-4" style={{ textAlign: "center" }}>*/}
                                        {/*    <input type="checkbox" id="nameBox" onChange={this.filterProjects} />*/}
                                        {/*    <label htmlFor="nameBox">*/}
                                        {/*        Sortera*/}
                                        {/*    </label>*/}
                                        {/*</div>*/}
                                        <div className="col-sm-12 col-md-4" style={{ padding: "0" }}>
                                            <Select
                                                options={classOptions}
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                onChange={this.handleClassesChange}
                                                allowSelectAll={true}
                                                value={this.state.classesSelected}
                                                placeholder="Klassificering"
                                                style={{ marginTop: "5px" }}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <select id="types" className="form-control" style={{ textAlign: "center" }} onChange={this.filterOwnedCustomers}>
                                                <option value="Alla typer">Alla typer</option>
                                                <option value="CustomerGroup">Kundgrupp</option>
                                                <option value="Customer">Kund</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "400px" }}>
                                        <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                            <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                <tr>
                                                    <th onClick={() => this.handleSort('name')} style={{ cursor: "pointer" }}>Namn {this.renderSortIcon('name')}</th>
                                                    <th>Kundnummer</th>
                                                    <th onClick={() => this.handleSort('classification')} style={{ cursor: "pointer" }}>Klass {this.renderSortIcon('classification')}</th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ backgroundColor: "white" }}>
                                                {sortedMyCustomers.map(d => {
                                                    return this.renderCustomer(d);
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </TabPanel>
                            <TabPanel>
                                <Tabs>
                                    <TabList>
                                        {this.state.companyId !== "23c5b39f-6ea9-4e9b-b20a-27606982c79e" && // Filtrera bort projekt för Skene Järn
                                            <Tab>Mina projekt</Tab>
                                        }
                                        <Tab>Mina kundaktiviteter</Tab>
                                    </TabList>
                                    {this.state.companyId !== "23c5b39f-6ea9-4e9b-b20a-27606982c79e" && // Filtrera bort projekt för Skene Järn
                                        <TabPanel>
                                        <div className="col-sm-12">
                                        <div className="row" style={{ marginTop: "15px" }}>
                                            <div className="col-sm-12" style={{ textAlign: "center" }}>
                                                <h3>Mina projekt</h3>
                                                <div id="removeBoxValuedProject" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                                    <h4>Vill du ta bort projektet?</h4>
                                                    <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeProject()}>Ta bort</button>
                                                    <button className="btn btn-warning" onClick={() => this.cancelRemoveProject()}>Avbryt</button>
                                                </div>
                                                <div className="col-sm-12" style={{ display: "flex", marginBottom: "10px" }}>
                                                    <div className="col-sm-12 col-md-6">
                                                        <Select
                                                            options={statusOptions}
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            hideSelectedOptions={false}
                                                            onChange={this.handleStatusChange}
                                                            allowSelectAll={true}
                                                            value={this.state.statusesSelected}
                                                            placeholder="Status"
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6" style={{ display: "flex" }}>
                                                        <input id="dateRangeProjectsFrom" type="date" className="form-control" onChange={() => { this.onProjectsFilter() }} /> <span style={{ padding: "5px" }}>-</span>
                                                        <input id="dateRangeProjectsTo" type="date" className="form-control" onChange={() => { this.onProjectsFilter() }} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "400px" }}>
                                                    <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                            <tr>
                                                                <th onClick={() => this.handleSortProject('date')} style={{ cursor: "pointer" }}>Datum {this.renderSortIconProject('date')}</th>
                                                                <th onClick={() => this.handleSortProject('activity')} style={{ cursor: "pointer" }}>Projekt {this.renderSortIconProject('activity')}</th>
                                                                <th>Status</th>
                                                                <th>Kund</th>
                                                                <th> </th>
                                                                <th> </th>
                                                                <th> </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ backgroundColor: "white" }}>
                                                            {sortedMyProjects.map(d => {
                                                                return this.renderProjectTableItem(d);
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </TabPanel>
                                    }
                                    <TabPanel>
                                        <div className="col-sm-12">
                                            <div className="row" style={{ marginTop: "15px" }}>
                                        <div className="col-sm-12" style={{ textAlign: "center" }}>
                                            <h3>Mina kundaktiviteter</h3>
                                            <div id="removeBoxValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                                <h4>Vill du ta bort aktiviteten?</h4>
                                                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeMeeting()}>Ta bort</button>
                                                <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                                            </div>
                                            <div className="col-sm-12" style={{ display: "flex", marginBottom: "10px" }}>
                                                <div className="col-sm-12 col-md-6">
                                                    <select id="resultFilterMeetings" className="form-control" style={{ padding: "5px"}} onChange={this.onMeetingsFilter}>
                                                        <option value="Alla">Alla resultat</option>
                                                        <option value="Beställning/affär">Beställning/affär</option>
                                                        <option value="Offert">Offert</option>
                                                                <option value="Nytt möte">Nytt möte</option>
                                                                <option value="Smarthyra">Smarthyra</option>
                                                        <option value="Övrigt">Övrigt</option>
                                                        <option value="Inget">Inget</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-12 col-md-6" style={{ display: "flex" }}>
                                                    <input id="dateRangeMeetingsFrom" type="date" className="form-control" onChange={this.onMeetingsFilter} /> <span style={{ padding: "5px" }}>-</span>
                                                    <input id="dateRangeMeetingsTo" type="date" className="form-control" onChange={this.onMeetingsFilter} />
                                                </div>
                                            </div>
                                            <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "600px" }}>
                                                <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                        <tr>
                                                            <th onClick={() => this.handleSortMeeting('date')} style={{ cursor: "pointer" }}>Datum {this.renderSortIconMeeting('date')}</th>
                                                            <th>Typ av aktivitet</th>
                                                            <th>Resultat av aktivitet</th>
                                                            <th>Kund</th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ backgroundColor: "white" }}>
                                                        {sortedMyMeetings.map(d => {
                                                            return this.renderMeeting2(d);
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </TabPanel>
                            <TabPanel>
                                <div>
                                    <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                                        <div className="col-sm-12" style={{ display: "grid" }}>
                                            <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Sök kund</h2>
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
                                <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "400px" }}>
                                <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                        <tr>
                                            <th>Namn</th>
                                            <th>Kundnummer</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ backgroundColor: "white" }}>
                                        {this.state.customers.map(d => {
                                            return this.renderCustomer(d);
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                                </TabPanel>
                            <TabPanel>
                                <Prospects/>
                            </TabPanel>
                        </Tabs>
                        <div className="col-sm-12">
                            <div className="col-sm-12" style={{ display: "flex", justifyContent: "center" }}>
                                <div style={{ marginRight: "5px", display: "flex" }}>
                                    <p style={{ display: "flex", justifyContent: "center", alignItems: "center", marginRight: "5px" }}>
                                        <BsInfoCircleFill data-tip="Skriv ut veckorapport för genomförda kundaktiviteter och projekt" data-for="weeklyTip" style={{ marginRight: "5px", height: "17px" }} />
                                        <ReactTooltip id="weeklyTip" place="top" effect="solid" />
                                        Exportera protokoll
                                    </p>
                                    <select className="form-control" id="dateTypeProtocol" style={{ width: "auto", marginBottom: "15px", marginRight: "5px" }} onChange={this.changeDateTypeProtocol}>
                                        <option value="Vecka" key="Vecka">Vecka</option>
                                        <option value="Månad" key="Månad">Månad</option>
                                        <option value="År" key="År">År</option>
                                    </select>
                                    <select className="form-control" id="protocolWeek" style={{ width: "auto", marginBottom: "15px" }}>
                                        {(function (rows, i, len) {
                                            while (++i <= len) {
                                                rows.push(<option value={i} key={i}>{i}</option>)
                                            }
                                            return rows;
                                        })([], 0, 53)}
                                    </select>
                                    <select className="form-control" id="protocolMonth" style={{ width: "auto", marginBottom: "15px", display: "none" }}>
                                        {(function (rows, i, len) {
                                            while (++i <= len) {
                                                rows.push(<option value={i} key={i}>{i}</option>)
                                            }
                                            return rows;
                                        })([], 0, 12)}
                                    </select>
                                    <select className="form-control" id="protocolYear" style={{ width: "auto", marginBottom: "15px", display: "none" }}>
                                        <option value={2023} key={2023}>2023</option>
                                        <option value={2024} key={2024}>2024</option>
                                        <option value={2025} key={2025}>2025</option>
                                        <option value={2026} key={2026}>2026</option>
                                        <option value={2027} key={2027}>2027</option>
                                    </select>
                                </div>
                                <span onClick={() => this.downloadWeeklyReport()}><i className="fas fa-file-excel" style={{ cursor: "pointer", fontSize: "25px", color: "#41bf50", marginRight: "10px", marginTop:"5px" }}></i></span>
                                <span onClick={() => this.downloadWeeklyReportPDF()}><i className="fas fa-file-pdf" style={{ cursor: "pointer", fontSize: "25px", color: "#ff0000", marginTop: "5px" }}></i></span>
                            </div>
                        </div>

                        <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }} show={this.state.quickAddMeetingIsOpen} onHide={() => { this.closeAddMeetingModal() }}>
                                <Modal.Header style={{ backgroundColor: $("#color").val(), textAlign: "center" }} >
                                    <Modal.Title style={{ color: "white", width: "100%" }}>Skapa kundaktivitet</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="col-sm-12">
                                        <div>
                                            <label> Datum </label>
                                            <input type="date" id="meetingDate" name="trip-start" className="form-control"
                                                min="2022-01-01" max="2030-12-31" required />
                                        </div>
                                        {this.state.customersInQuickAdd.length > 0 &&
                                            <div>
                                                <label> Kund </label>
                                                <select id="meetingCustomer" className="form-control">
                                                    {this.state.customersInQuickAdd.map(d => {
                                                        return this.renderCustomerSelect(d);
                                                    })}
                                                </select>
                                            </div>
                                        }
                                        <div style={{display: "none"}}>
                                            <label> Projekt(frivilligt) </label>
                                            <input id="meetingProject" className="form-control" value={this.state.projectIdToQuickAddMeeting} disabled/>
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
                                        <div>
                                            <label>Deltagare motpart</label>
                                            {/*<Popup trigger={*/}
                                            {/*    <span style={{ cursor: "pointer" }} onClick={this.handleAddContactOpen}><i className="fa-solid fa-plus" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i></span>*/}
                                            {/*} open={this.state.isAddContactOpen} position="left center">*/}
                                            {/*    <div>*/}
                                            {/*        <div className="col-sm-12">*/}
                                            {/*            <div className="col-sm-12">*/}
                                            {/*                <label> Förnamn </label>*/}
                                            {/*                <input*/}
                                            {/*                    ref={(input) => (this.contactFirstNameInput = input)}*/}
                                            {/*                    id="contactFirstName"*/}
                                            {/*                    className="form-control"*/}
                                            {/*                    onKeyDown={this.handleKeyDown}*/}
                                            {/*                />*/}
                                            {/*            </div>*/}
                                            {/*            <div className="col-sm-12">*/}
                                            {/*                <label> Efternamn </label>*/}
                                            {/*                <input*/}
                                            {/*                    ref={(input) => (this.contactLastNameInput = input)}*/}
                                            {/*                    id="contactLastName"*/}
                                            {/*                    className="form-control"*/}
                                            {/*                    onKeyDown={this.handleKeyDown}*/}
                                            {/*                />*/}
                                            {/*            </div>*/}
                                            {/*            <div className="col-sm-12">*/}
                                            {/*                <label> Email </label>*/}
                                            {/*                <input*/}
                                            {/*                    ref={(input) => (this.contactEmailInput = input)}*/}
                                            {/*                    id="contactEmail"*/}
                                            {/*                    className="form-control"*/}
                                            {/*                    onKeyDown={this.handleKeyDown}*/}
                                            {/*                />*/}
                                            {/*            </div>*/}
                                            {/*            <div className="col-sm-12">*/}
                                            {/*                <label> Telefon </label>*/}
                                            {/*                <input*/}
                                            {/*                    ref={(input) => (this.contactTelephoneInput = input)}*/}
                                            {/*                    id="contactTelephone"*/}
                                            {/*                    className="form-control"*/}
                                            {/*                    onKeyDown={this.handleKeyDown}*/}
                                            {/*                />*/}
                                            {/*            </div>*/}
                                            {/*            <div className="col-sm-12">*/}
                                            {/*                <label> Roll </label>*/}
                                            {/*                <select*/}
                                            {/*                    ref={(input) => (this.contactRoleInput = input)}*/}
                                            {/*                    id="contactRole"*/}
                                            {/*                    className="form-control"*/}
                                            {/*                    onKeyDown={this.handleKeyDown}*/}
                                            {/*                >*/}
                                            {/*                    {this.state.roles.map(d => {*/}
                                            {/*                        return this.renderRoleSelect(d);*/}
                                            {/*                    })}*/}
                                            {/*                    <option value="Inget av alternativen passar">Inget av alternativen passar</option>*/}
                                            {/*                </select>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className="col-sm-12">*/}
                                            {/*            <button*/}
                                            {/*                ref={(input) => (this.contactSaveButton = input)}*/}
                                            {/*                id="saveContact"*/}
                                            {/*                className="btn btn-primary form-control"*/}
                                            {/*                style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }}*/}
                                            {/*                onClick={() => this.saveContact()}>*/}
                                            {/*                Spara*/}
                                            {/*                </button>*/}
                                            {/*        </div>*/}
                                            {/*        <div id="valueSuccessContact" style={{ display: "none" }}>Kontakten har sparats</div>*/}
                                            {/*    </div>*/}
                                            {/*</Popup>*/}
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
                                            <select id="meetingResponsible" className="form-control" defaultValue={this.state.salesmanIdToQuickAddMeeting}>
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
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => { this.saveMeetingFromQuickAddView() }} >
                                        Spara
                                    </button>
                                    <button className="btn btn-secondary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => { this.closeAddMeetingModal() }}>
                                        Stäng
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        {component.state.projectIdEditModal != null &&
                            <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                                show={component.state.showEditProjectModal}
                                onHide={() => {
                                    component.setState({ showEditProjectModal: false });
                                    $.when(getAllProjectsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(projects) {
                                        var filteredProjects = [];
                                        //for (let i = 0; i < projects.length; i++) {
                                        //    if (projects[i].status != "Klart") {
                                        //        filteredProjects.push(projects[i])
                                        //    }
                                        //}
                                        this.setState({
                                            initialProjects: projects,
                                            projects: filteredProjects,
                                        },
                                            () => {
                                                this.onProjectsFilter();
                                            });
                                        $("#spinner").hide();
                                    }.bind(this));
                                    $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
                                        this.setState({
                                            ownedMeetings: meetings,
                                            initialMeetings: meetings
                                        });
                                        $("#spinner").hide();
                                    }.bind(this));
                                }}>
                                <Modal.Header closeButton>
                                </Modal.Header>
                                <Modal.Body>
                                    <EditProjectModal projectId={component.state.projectIdEditModal} customerId={component.state.customerIdEditModal} closeEditProjectModal={component.closeEditProjectModal}  />
                                </Modal.Body>
                            </Modal>
                        }
                        {component.state.meetingIdEditModal != null &&
                            <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                                show={component.state.showEditMeetingModal}
                                onHide={() => {
                                    component.setState({ showEditMeetingModal: false });
                                    $.when(getAllProjectsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(projects) {
                                        var filteredProjects = [];
                                        for (let i = 0; i < projects.length; i++) {
                                            if (projects[i].status != "Klart") {
                                                filteredProjects.push(projects[i])
                                            }
                                        }
                                        this.setState({
                                            initialProjects: projects,
                                            projects: filteredProjects,
                                        });
                                        $("#spinner").hide();
                                    }.bind(this));
                                    $.when(getAllMeetingsForSalesman($('#companyId').val(), $('#userId').val())).then(function successHandler(meetings) {
                                        this.setState({
                                            ownedMeetings: meetings,
                                            initialMeetings: meetings
                                        });
                                        $("#spinner").hide();
                                    }.bind(this));
                                }}>
                                <Modal.Header closeButton>
                                </Modal.Header>
                                <Modal.Body>
                                    <EditMeetingModal meetingId={component.state.meetingIdEditModal} customerId={component.state.customerIdEditModal} closeEditMeetingModal={component.closeEditMeetingModal} />
                                </Modal.Body>
                            </Modal>
                        }
                        </Fragment>
                    )
                }
            </div>
        );
    }
}

export default CustomerSearch;