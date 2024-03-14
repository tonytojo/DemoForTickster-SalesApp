import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsFillTrashFill } from 'react-icons/bs';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsInfoCircleFill, BsChevronExpand   } from 'react-icons/bs';
import ReactTooltip from "react-tooltip";
import {
    getRoles, removeRole, saveRole,
    getCompanyMembers, downloadOverviewPDF, downloadOverviewExcel,
    getCustomersAndGroupsSearch, saveCustomerContact, getCustomerContacts, getOptions,
    saveOption, removeOption, getCustomers, getCustomersWithoutFilter,
    getCustomerGroups, getProjectsOfEntireCustomerGroup,
    getMeetingsOfEntireCustomerGroup, getCompanyMembersWithoutLightUsers, getAllProjectsFiltered, getAllMeetingsFiltered, getAllProspectMeetingsForCompanyFiltered,
    getAllProjectsForSalesmanFiltered, getAllMeetingsForSalesmanFiltered, getAllProspectMeetingsForSalesmanFiltered, getMeetingsFiltered, getProjectsFiltered 
} from './requestHandler'
import CustomerList from './customerList'
import Members from './members'
import Value from './value'
import Select from 'react-select';
import { CustomerGroups } from './customerGroups';
import { FixedSizeList as List } from "react-window";
import Modal from 'react-bootstrap/Modal';
import EditProjectModal from './editProjectModal';
import EditMeetingModal from './editMeetingModal';
import Budget from './budget';

var component;
export class Admin extends React.Component {
    constructor(props) {
        super(props);
        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            color: $('#color').val(),
            isAdmin: $("#isAdmin").val(),
            roles: [],
            removeRole: null,
            salesmen: [],
            salesmenWithoutLightUsers: [],
            selectedCustomer: null,
            customers: [],
            customerGroups: [],
            customer: null,
            customerContacts: [],
            options: [],
            removeOption: null,
            projects: [],
            initialProjects: [],
            meetings: [],
            prospectMeetings: [],
            initialMeetings: [],
            initialProspectMeetings: [],
            customersSelect: [],
            chosenOversightType: "salespersons",
            customersWithoutFilter: [],
            showEditProjectModal: false,
            projectIdEditModal: null,
            showEditMeetingModal: false,
            meetingIdEditModal: null,
            customerIdEditModal: null,
            sortBy: 'date',         // Column to sort by (null for no sorting)
            sortDirection: -1,    // Sort direction: 1 for ascending, -1 for descending
            sortByMeetings: 'date',         // Column to sort by (null for no sorting)
            sortDirectionMeetings: -1,    // Sort direction: 1 for ascending, -1 for descending
            sortByProspectMeetings: 'date',         // Column to sort by (null for no sorting)
            sortDirectionProspectMeetings: -1,    // Sort direction: 1 for ascending, -1 for descending
        }
        $.when(getCustomers(this.state.companyId)).then(function successHandler(data) {
            data.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            this.setState({
                customersSelect: data
            })
        }.bind(this));
        $.when(getCustomersWithoutFilter(this.state.companyId)).then(function successHandler(data) {
            data.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            this.setState({
                customersWithoutFilter: data
            })
        }.bind(this));
        $.when(getRoles(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                roles: data
            })
        }.bind(this));
        $.when(getCompanyMembers()).then(function successHandler(data) {
            this.setState({
                salesmen: data
            })
        }.bind(this));
        $.when(getCompanyMembersWithoutLightUsers()).then(function successHandler(data) {
            this.setState({
                salesmenWithoutLightUsers: data
            })
        }.bind(this));
        $.when(getOptions(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                options: data
            })
        }.bind(this));
        $.when(getAllProjectsFiltered($('#companyId').val(), this.getFirstDateOfCurrentMonth(), 'yyyy-mm-dd', 'Alla')).then(function successHandler(projects) {
            this.setState({
                projects: projects,
                initialProjects: projects
            });
            $("#spinner").hide();
        }.bind(this));
        $.when(getAllMeetingsFiltered($('#companyId').val(), this.getFirstDateOfCurrentMonth(), 'yyyy-mm-dd', 'Alla')).then(function successHandler(meetings) {
            this.setState({
                meetings: meetings,
                initialMeetings: meetings
            });
            $("#spinner").hide();
        }.bind(this));
        $.when(getAllProspectMeetingsForCompanyFiltered($('#companyId').val(), this.getFirstDateOfCurrentMonth(), 'yyyy-mm-dd', 'Alla')).then(function successHandler(meetings) {
            this.setState({
                prospectMeetings: meetings,
                initialProspectMeetings: meetings
            });
            $("#spinner").hide();
        }.bind(this));
        $.when(getCustomerGroups(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                customerGroups: data
            })
        }.bind(this));
    }
    
    getFirstDateOfCurrentMonth() {
        const today = new Date();
        const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

        // Formatting the date to "yyyy-mm-dd"
        const year = firstDate.getFullYear();
        const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
        const day = firstDate.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    componentDidUpdate() {

    }

    removeRole() {
        $.when(removeRole(this.state.companyId, this.state.removeRole)).then(function successHandler(status) {
            if (status) {
                $("#removeBox").hide();
                $.when(getRoles(this.state.companyId)).then(function successHandler(data) {
                    this.setState({
                        roles: data
                    })
                }.bind(this));
            }
            else {
                alert("Borttagningen misslyckades");
                $("#removeBox").hide();
            }
        }.bind(this));
    }

    removeOption() {
        $.when(removeOption(this.state.companyId, this.state.removeOption)).then(function successHandler(status) {
            if (status) {
                $("#removeBoxOption").hide();
                $.when(getOptions(this.state.companyId)).then(function successHandler(data) {
                    this.setState({
                        options: data
                    })
                }.bind(this));
            }
            else {
                alert("Borttagningen misslyckades");
                $("#removeBoxOption").hide();
            }
        }.bind(this));
    }

    cancelRemove() {
        $("#removeBox").hide();
        this.setState({
            removeRole: null
        })
    }

    cancelRemoveOption() {
        $("#removeBoxOption").hide();
        this.setState({
            removeOption: null
        })
    }

    showRemove(role) {
        $("#removeBox").show();
        this.setState({
            removeRole: role
        })
    }

    showRemoveOption(option) {
        $("#removeBoxOption").show();
        this.setState({
            removeOption: option
        })
    }

    saveRole() {
        $.when(saveRole(this.state.companyId, $("#newRole").val())).then(function successHandler(response) {
            if (response) {
                $("#valueSuccess").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $("#valueSuccess").hide();
                }, 5000);
                $("#newRole").val("");

                $.when(getRoles(this.state.companyId)).then(function successHandler(data) {
                    this.setState({
                        roles: data,
                    })
                }.bind(this));

            } else {
                alert('Rollen kunde inte sparas.');
            }
        }.bind(this));
    }

    renderRole(role) {
        return (
            <tr key={role.role} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{role.role}</td>
                <td style={{ width: "20%" }}>
                    <BsFillTrashFill style={{ color: "red", marginLeft: "10px" }} onClick={() => this.showRemove(role.role)} />
                </td>
            </tr>
        );
    }

    renderOption(option) {
        return (
            <tr key={option.optionValue} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{option.optionValue}</td>
                <td style={{ width: "20%" }}>
                    <BsFillTrashFill style={{ color: "red", marginLeft: "10px" }} onClick={() => this.showRemoveOption(option.optionValue)} />
                </td>
            </tr>
        );
    }

    renderRoleSelect(role) {
        return (
            <option value={ role.role}>{ role.role}</option>    
        )
    }

    renderSalesman(salesman) {
        return (
            <option key={salesman.id} value={ salesman.id }>{ salesman.name}</option>  
        );
    }

    createPdf() {
        $.when(downloadOverviewPDF(
            this.state.companyId,
            $("#salesman").val(),
            $("#dateRangeFrom").val(),
            $("#dateRangeTo").val(),
            $("#resultFilterMeetings").val(),
            $("#statusFilterProjects").val()
        )).then(function successHandler(fileName) {
            if (fileName != "") {
                $.when(this.download("/PDF/Download", fileName + ".pdf")).then(function successHandler(status) {
                    this.deleteFilePdf(fileName);
                }.bind(this));
            }
            else {
                alert("Kunde inte ladda ner översikten. Det kan bero på att säljaren saknar registrerade projekt och aktiviteter.")
            }
        }.bind(this));
    }

    createExcel() {
        $.when(downloadOverviewExcel(
            this.state.companyId,
            $("#salesman").val(),
            $("#dateRangeFrom").val(),
            $("#dateRangeTo").val(),
            $("#resultFilterMeetings").val(),
            $("#statusFilterProjects").val()
        )).then(function successHandler(fileName) {
            if (fileName != "") {
                $.when(this.download("/Excel/Download", fileName + ".xlsx")).then(function successHandler(status) {
                    this.deleteFile(fileName);
                }.bind(this));
            }
            else {
                alert("Kunde inte ladda ner översikten. Det kan bero på att säljaren saknar registrerade projekt och aktiviteter.")
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

    renderCustomerContact(contact) {
        return (
            <tr>
                <td style={{ borderBottom: "1px solid #dee2e6" }} key={contact.name}> {contact.name} </td>
                <td> ({contact.role}) </td>
                <td> {contact.telephone} </td>
                <td> {contact.email} </td>
            </tr>
        )
    }

    saveContact() {
        $.when(saveCustomerContact(this.state.selectedCustomer.id, this.state.companyId)).then(function successHandler(status) {
            if (status) {
                $("#spinner").hide();

                $("#contactName").val(""),
                $("#contactTelephone").val(""),
                $("#contactEmail").val(""),
                $("#valueSuccessContact").show();
                window.scrollTo(0, 0);

                this.setState({
                    selectedCustomer: null
                })

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

    saveOption() {
        $.when(saveOption(this.state.companyId)).then(function successHandler(status) {
            if (status) {
                $("#newOption").val("");
                $.when(getOptions(this.state.companyId)).then(function successHandler(data) {
                    this.setState({
                        options: data
                    })
                }.bind(this));
            }
            else {

            }
        }.bind(this));
    }

    renderCustomer(customer) {
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
                <td style={{ width: "20%" }}>
                    <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.selectCustomer(customer.id, customer.name)}>Välj</button>
                </td>
            </tr>
        )
    }

    searchCustomers() {
        $("#spinner").show();
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

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

    onChange() {
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        this.setState({
            customer: customer
        });
    }

    selectCustomer(customerId, customerName) {
        var selectedCustomer = {
            name: customerName,
            id: customerId
        }

        $.when(getCustomerContacts(this.state.companyId, customerId)).then(function successHandler(data) {
            this.setState({
                customerContacts: data,
                selectedCustomer: selectedCustomer
            })
        }.bind(this));
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

        return (
            <tr key={project.projectId} className="tableRow" style={{ borderLeft: "2px solid " + borderColor }}>
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                <td style={{ paddingTop: "18px" }}>{project.activity}</td>
                <td style={{ paddingTop: "18px", color: color }}>{project.status}</td>
                <td style={{ paddingTop: "18px" }}>{project.customerName}</td>
                <td style={{ paddingTop: "18px" }}>{project.companyResponsible}</td>
                <td style={{ paddingTop: "14px", display: "flex" }}>
                    <button onClick={() => { component.setState({ showEditProjectModal: true, projectIdEditModal: project.projectId, customerIdEditModal: project.customerId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                    <BsChevronExpand  style={{fontSize: "45px", marginLeft: "10px", cursor: "pointer"}} onClick={() => { $("#additional-" + project.projectId).toggle()}}/>
                </td>
            </tr>
        )
    }

    getFilteredData(e) {
        var from = "1970-01-01";
        var to = "2050-01-01";
        if ($("#dateRangeFrom").val() != "")
            from = $("#dateRangeFrom").val();
        if ($("#dateRangeTo").val() != "")
            to = $("#dateRangeTo").val();

        if (this.state.chosenOversightType == "salespersons") {
            var value = $("#salesman").val();
            if (value != "Alla") {
                $.when(getAllProjectsForSalesmanFiltered($('#companyId').val(), $('#salesman').val(), from, to, $("#statusFilterProjects").val())).then(function successHandler(projects) {
                    this.setState({
                        projects: projects,
                        initialProjects: projects
                    });
                    $("#spinner").hide();
                }.bind(this));

                $.when(getAllMeetingsForSalesmanFiltered($('#companyId').val(), $('#salesman').val(), from, to, $("#resultFilterMeetings").val())).then(function successHandler(meetings) {
                    this.setState({
                        meetings: meetings,
                        initialMeetings: meetings
                    });
                    $("#spinner").hide();
                }.bind(this));

                $.when(getAllProspectMeetingsForSalesmanFiltered($('#companyId').val(), $('#salesman').val(), from, to, $("#resultFilterMeetings").val())).then(function successHandler(meetings) {
                    this.setState({
                        prospectMeetings: meetings,
                        initialProspectMeetings: meetings
                    });
                    $("#spinner").hide();
                }.bind(this));
            }
            else {
                $.when(getAllProjectsFiltered($('#companyId').val(), from, to, $("#statusFilterProjects").val())).then(function successHandler(projects) {
                    this.setState({
                        projects: projects,
                        initialProjects: projects
                    });
                    $("#spinner").hide();
                }.bind(this));

                $.when(getAllMeetingsFiltered($('#companyId').val(), from, to, $("#resultFilterMeetings").val())).then(function successHandler(meetings) {
                    this.setState({
                        meetings: meetings,
                        initialMeetings: meetings
                    });
                    $("#spinner").hide();
                }.bind(this));

                $.when(getAllProspectMeetingsForCompanyFiltered($('#companyId').val(), from, to, $("#resultFilterMeetings").val())).then(function successHandler(meetings) {
                    this.setState({
                        prospectMeetings: meetings,
                        initialProspectMeetings: meetings
                    });
                    $("#spinner").hide();
                }.bind(this));
            }
        }
        else {

            if (e.value != "Alla") {
                var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (guidPattern.test(e.value)) { // If is CustomerGroup
                    $.when(getProjectsOfEntireCustomerGroup(e.value)).then(function successHandler(projects) {
                        this.setState({
                            projects: projects,
                            initialProjects: projects,
                            initialProspectMeetings: [],
                            prospectMeetings: []
                        });
                        $("#spinner").hide();
                    }.bind(this));

                    $.when(getMeetingsOfEntireCustomerGroup(e.value)).then(function successHandler(meetings) {
                        this.setState({
                            meetings: meetings,
                            initialMeetings: meetings
                        });
                        $("#spinner").hide();
                    }.bind(this));
                }
                else {
                    $.when(getProjectsFiltered($('#companyId').val(), e.value, from, to, $("#statusFilterProjects").val())).then(function successHandler(projects) {
                        this.setState({
                            projects: projects,
                            initialProjects: projects
                        });
                        $("#spinner").hide();
                    }.bind(this));

                    $.when(getMeetingsFiltered($('#companyId').val(), e.value, from, to, $("#resultFilterMeetings").val())).then(function successHandler(meetings) {
                        this.setState({
                            meetings: meetings,
                            initialMeetings: meetings
                        });
                        $("#spinner").hide();
                    }.bind(this));
                }
            }
            else {
                $.when(getAllProjectsFiltered($('#companyId').val(), from, to, $("#statusFilterProjects").val())).then(function successHandler(projects) {
                    this.setState({
                        projects: projects,
                        initialProjects: projects
                    });
                    $("#spinner").hide();
                }.bind(this));

                $.when(getAllMeetingsFiltered($('#companyId').val()), from, to, $("#resultFilterMeetings").val()).then(function successHandler(meetings) {
                    this.setState({
                        meetings: meetings,
                        initialMeetings: meetings
                    });
                    $("#spinner").hide();
                }.bind(this));
            }
        }
    }

    renderMeeting2(meeting) {
        return (
            <tr key={meeting.meetingId} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{meeting.date.split('T')[0]}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.typeOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.resultOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.customerName}</td>
                <td style={{ paddingTop: "18px" }}>
                    {this.state.salesmen.length > 0 &&
                        <Fragment>
                            {this.state.salesmen.find(x => x.id === meeting.companyResponsible)
                                ? this.state.salesmen.find(x => x.id === meeting.companyResponsible).name
                                : "Säljare borttagen"}
                        </Fragment>
                    }
                </td>
                {this.state.companyId == '5eb7b09b-105a-4160-96b5-95b0353efcee' &&
                    <td style={{ paddingTop: "18px" }} >
                        {meeting.kilometersDriven}
                    </td>
                }
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
            </tr>
        )
    }

    renderProspectMeeting2(meeting) {
        return (
            <tr key={meeting.meetingId} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{meeting.date.split('T')[0]}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.typeOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.resultOfMeeting}</td>
                <td style={{ paddingTop: "18px" }}>{meeting.prospectName}</td>
                <td style={{ paddingTop: "18px" }}>
                    {this.state.salesmen.length > 0 &&
                        <Fragment>
                            {this.state.salesmen.find(x => x.id === meeting.companyResponsible)
                                ? this.state.salesmen.find(x => x.id === meeting.companyResponsible).name
                                : "Säljare borttagen"}
                        </Fragment>
                    }
                </td>
                <td style={{ width: "20%" }}>
                    <button onClick={() => { component.setState({ showEditMeetingModal: true, meetingIdEditModal: meeting.meetingId, customerIdEditModal: meeting.customerId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} disabled={true}>Visa</button>
                </td>
            </tr>
        )
    }

    onOversightTypeClick(e) {
        if (e.target.value == "salespersons") {
            this.setState({
                chosenOversightType: "salespersons",
                meetings: [],
                projects: []
            })
        }
        if (e.target.value == "customers") {
            this.setState({
                chosenOversightType: "customers",
                meetings: [],
                projects: []
            })
        }
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

    sortProjects = (projects) => {
        const { sortBy, sortDirection } = this.state;
        if (!sortBy) {
            return projects;
        }
        return [...projects].sort((a, b) =>
            a[sortBy].localeCompare(b[sortBy]) * sortDirection
        );
    };

    renderSortIconMeetings = (column) => {
        if (this.state.sortByMeetings === column) {
            return this.state.sortDirectionMeetings === 1 ? '↑' : '↓';
        }
        return null;
    };

    renderSortIconProspectMeetings = (column) => {
        if (this.state.sortByProspectMeetings === column) {
            return this.state.sortDirectionProspectMeetings === 1 ? '↑' : '↓';
        }
        return null;
    };

    handleSortMeetings = (column) => {
        if (column === this.state.sortByMeetings) {
            this.setState((prevState) => ({
                sortDirectionMeetings: -prevState.sortDirectionMeetings,
            }));
        } else {
            this.setState({
                sortByMeetings: column,
                sortDirectionMeetings: 1,
            });
        }
    };

    handleSortProspectMeetings = (column) => {
        if (column === this.state.sortByProspectMeetings) {
            this.setState((prevState) => ({
                sortDirectionProspectMeetings: -prevState.sortDirectionProspectMeetings,
            }));
        } else {
            this.setState({
                sortByProspectMeetings: column,
                sortDirectionProspectMeetings: 1,
            });
        }
    };

    sortMeetings = (meetings) => {
        const { sortByMeetings, sortDirectionMeetings } = this.state;
        if (!sortByMeetings) {
            return meetings;
        }
        return [...meetings].sort((a, b) =>
            a[sortByMeetings].localeCompare(b[sortByMeetings]) * sortDirectionMeetings
        );
    };

    sortProspectMeetings = (meetings) => {
        const { sortByProspectMeetings, sortDirectionProspectMeetings } = this.state;
        if (!sortByProspectMeetings) {
            return meetings;
        }
        return [...meetings].sort((a, b) =>
            a[sortByProspectMeetings].localeCompare(b[sortByProspectMeetings]) * sortDirectionProspectMeetings
        );
    };

    closeEditMeetingModal() {
        component.setState({ showEditMeetingModal: false });
        component.getFilteredData();
    }

    closeEditProjectModal() {
        component.setState({ showEditProjectModal: false });
        component.getFilteredData();
    }

    render() {
        var customersSearchSelect = [];
        for (let i = 0; i < this.state.customersWithoutFilter.length; i++) {
            customersSearchSelect.push({ label: this.state.customersWithoutFilter[i].name, value: this.state.customersWithoutFilter[i].id })
        }
        for (let i = 0; i < this.state.customerGroups.length; i++) {
            customersSearchSelect.push({ label: this.state.customerGroups[i].name, value: this.state.customerGroups[i].id })
        }

        const sortedProjects = this.sortProjects(this.state.projects);
        const sortedMeetings = this.sortMeetings(this.state.meetings);
        const sortedProspectMeetings = this.sortProspectMeetings(this.state.prospectMeetings);
        return (
                <Fragment>
                    {this.state.isAdmin == "True" ? (
                    <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                        <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                            <div className="col-sm-12" style={{ display: "grid" }}>
                                <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Admin</h2>
                            </div>
                        </div>
                        <div id="removeBox" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                            <h4>Vill du ta bort rollen?</h4>
                            <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeRole()}>Ta bort</button>
                            <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                        </div>
                        <div id="removeBoxOption" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                            <h4>Vill du ta bort aktivitet-alternativet?</h4>
                            <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeOption()}>Ta bort</button>
                            <button className="btn btn-warning" onClick={() => this.cancelRemoveOption()}>Avbryt</button>
                        </div>
                        <div id="valueSuccess" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                            <h4>Rollen har skapats</h4>
                        </div>
                        <div id="valueSuccessContact" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                            <h4>Kontakten har sparats</h4>
                        </div>
                        <Tabs>
                            <TabList style={{ textTransform: "uppercase" }} className="tabGroup">
                                <Tab>Överblick</Tab>
                                <Tab>Kundgrupper </Tab>
                                <Tab>Värdera</Tab>
                                <Tab>Värderade kunder</Tab>
                                {this.state.companyId == '7f011702-09b2-4fc3-8f94-3033436a6fc5' &&
                                    <Tab> Budget </Tab>
                                }
                                <Tab>Roller</Tab>
                                <Tab>Användare</Tab>
                                <Tab>Värden</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="row col-sm-12" style={{ margin: "0", textAlign: "center" }}>
                                    <div className="col-sm-12" style={{ margin: "0", textAlign: "center" }}>
                                        <div className="row" style={{ display: "flex", margin: "0", marginBottom: "20px" }}>
                                            <div className="col-sm-12 col-md-6" style={{ margin: "0"}}>
                                                <input
                                                    type="radio"
                                                    id="salespersons"
                                                    value="salespersons"
                                                    style={{ width: "15px" }}
                                                    onClick={(e) => { this.onOversightTypeClick(e) }}
                                                    checked={this.state.chosenOversightType == "salespersons"} />
                                                <label for="salespersons">Säljare</label>
                                                <input
                                                    type="radio"
                                                    id="customers"
                                                    value="customers"
                                                    style={{ width: "15px", marginLeft: "5px" }}
                                                    onClick={(e) => { this.onOversightTypeClick(e) }}
                                                    checked={this.state.chosenOversightType == "customers"} />
                                                <label for="customers">Kunder</label>
                                                {this.state.chosenOversightType == "salespersons" &&
                                                    <select id="salesman" className="form-control" onChange={(e) => { this.getFilteredData() }} style={{ textAlign: "center", width: "100%", padding: "0", boxSizing: "border-box" }}>
                                                        <option key="Alla" value="Alla">Alla säljare</option>
                                                        {this.state.salesmenWithoutLightUsers.map(d => {
                                                            return this.renderSalesman(d);
                                                        })}
                                                    </select>
                                                }
                                                {this.state.chosenOversightType == "customers" &&
                                                    <Select 
                                                    id="customersSelect"
                                                    options={customersSearchSelect}
                                                    placeholder="Sök kund"
                                                    components={{ SelectList }}
                                                    onChange={(e) => this.getFilteredData(e)}
                                                    />
                                                }
                                                {this.state.chosenOversightType == "salespersons" &&
                                                    <div className="col-sm-12" style={{ display: "inline-flex", paddingTop: "5px", paddingLeft: "0", paddingRight: "0" }}>
                                                        <button onClick={() => this.createPdf()} className="form-control" style={{ backgroundColor: this.state.color, color: "white" }}>
                                                            PDF
                                                        </button>
                                                        <button onClick={() => this.createExcel()} className="form-control" style={{ backgroundColor: this.state.color, color: "white" }}>
                                                            Excel
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                            <div className="col-sm-12 col-md-6" style={{ margin: "0" }}>
                                                <h5>Filter
                                                    <BsInfoCircleFill data-tip="Filtren påverkar även PDF/Excel exporten." data-for="filterTip" style={{ fontSize: "14px", marginLeft: "5px", height: "17px", marginBottom: "3px" }} />
                                                    <ReactTooltip id="filterTip" place="top" effect="solid" />
                                                </h5>
                                                <div style={{ display: "flex" }}>
                                                    <input
                                                        id="dateRangeFrom"
                                                        type="date"
                                                        className="form-control"
                                                        defaultValue={this.getFirstDateOfCurrentMonth()}
                                                        onChange={() => { this.getFilteredData(); }}
                                                    />
                                                    <span style={{ padding: "5px" }}>-</span>
                                                    <input
                                                        id="dateRangeTo"
                                                        type="date"
                                                        className="form-control"
                                                        onChange={() => { this.getFilteredData() }} />
                                                </div>
                                                <div style={{ display: "flex", paddingTop: "5px" }}>
                                                    <select id="statusFilterProjects" className="form-control" style={{ padding: "5px", display: component.state.companyId == '23c5b39f-6ea9-4e9b-b20a-27606982c79e' ? 'none' : '' }} onChange={() => { this.getFilteredData() }}>
                                                        <option value="Alla">Alla projekt</option>
                                                        <option value="Ej påbörjat">Ej påbörjat</option>
                                                        <option value="Pågående">Pågående</option>
                                                        <option value="Klart">Klart</option>
                                                    </select>
                                                    <span style={{ padding: "5px", display: component.state.companyId == '23c5b39f-6ea9-4e9b-b20a-27606982c79e' ? 'none' : ''  }}> </span>
                                                    <select id="resultFilterMeetings" className="form-control" style={{ padding: "5px" }} onChange={this.onMeetingsFilter}>
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
                                        </div>
                                        <Tabs>
                                            <TabList style={{ textTransform: "uppercase" }} className="tabGroup">
                                                {component.state.companyId != '23c5b39f-6ea9-4e9b-b20a-27606982c79e' &&
                                                    <Tab>Projekt</Tab>
                                                }
                                                <Tab>Kundaktiviteter </Tab>
                                                <Tab>Prospektaktiviteter</Tab>
                                            </TabList>
                                            {component.state.companyId != '23c5b39f-6ea9-4e9b-b20a-27606982c79e' &&
                                                <TabPanel>
                                                    <div className="col-sm-12">
                                                        <div className="row" style={{ marginTop: "15px" }}>
                                                            <div className="col-sm-12" style={{ textAlign: "center" }}>
                                                                <h4>Projekt</h4>
                                                                <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "400px" }}>
                                                                    <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                                            <tr>
                                                                            <th style={{ width: "15%", cursor: "pointer"}} onClick={() => this.handleSort('date')} >
                                                                                    Datum {this.renderSortIcon('date')}
                                                                                </th>
                                                                            <th style={{ width: "20%", cursor: "pointer" }} onClick={() => this.handleSort('activity')} >
                                                                                    Projekt {this.renderSortIcon('activity')}
                                                                                </th>
                                                                            <th style={{ width: "15%", cursor: "pointer" }} onClick={() => this.handleSort('status')} >
                                                                                    Status {this.renderSortIcon('status')}
                                                                                </th>
                                                                            <th style={{ width: "20%", cursor: "pointer" }} onClick={() => this.handleSort('customerName')} >
                                                                                    Kund {this.renderSortIcon('customerName')}
                                                                            </th>
                                                                            <th style={{ width: "20%"}} >
                                                                                Säljare
                                                                            </th>
                                                                            <th style={{ width: "10%" }}> </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody style={{ backgroundColor: "white" }}>
                                                                            {sortedProjects.map(d => {
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
                                                        <h4>Kundaktiviteter</h4>
                                                        <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "600px" }}>
                                                            <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                                                <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                                    <tr>
                                                                        <th style={{ width: "15%", cursor: "pointer"}} onClick={() => this.handleSortMeetings('date')} >
                                                                            Datum {this.renderSortIconMeetings('date')}
                                                                        </th>
                                                                        <th style={{ width: "15%", cursor: "pointer" }} onClick={() => this.handleSortMeetings('typeOfMeeting')} >
                                                                            Typ av aktivitet {this.renderSortIconMeetings('typeOfMeeting')}
                                                                        </th>
                                                                        <th style={{ width: "15%", cursor: "pointer" }} onClick={() => this.handleSortMeetings('resultOfMeeting')} >
                                                                            Resultat av aktivitet {this.renderSortIconMeetings('resultOfMeeting')}
                                                                        </th>
                                                                        <th style={{ width: "20%", cursor: "pointer" }} onClick={() => this.handleSortMeetings('customerName')} >
                                                                            Kund {this.renderSortIconMeetings('customerName')}
                                                                        </th>
                                                                        <th style={{ width: "20%" }} >
                                                                            Säljare
                                                                        </th>
                                                                        {this.state.companyId == '5eb7b09b-105a-4160-96b5-95b0353efcee' &&
                                                                            <th style={{ width: "5%" }} >
                                                                                Km
                                                                            </th>
                                                                        }
                                                                        <th style={{ width: "10%" }}></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody style={{ backgroundColor: "white" }}>
                                                                    {sortedMeetings.map(d => {
                                                                        return this.renderMeeting2(d);
                                                                    })}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="col-sm-12">
                                                    <div className="row" style={{ marginTop: "15px" }}>
                                                        <div className="col-sm-12" style={{ textAlign: "center" }}>
                                                            <h4>Prospektaktiviteter</h4>
                                                            <div className="col-sm-12" style={{ overflow: "scroll", maxHeight: "600px" }}>
                                                                <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                                                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                                        <tr>
                                                                            <th style={{ width: "15%", cursor: "pointer" }} onClick={() => this.handleSortProspectMeetings('date')} >
                                                                                Datum {this.renderSortIconProspectMeetings('date')}
                                                                            </th>
                                                                            <th style={{ width: "20%", cursor: "pointer" }} onClick={() => this.handleSortProspectMeetings('typeOfMeeting')} >
                                                                                Typ av aktivitet {this.renderSortIconProspectMeetings('typeOfMeeting')}
                                                                            </th>
                                                                            <th style={{ width: "15%", cursor: "pointer" }} onClick={() => this.handleSortProspectMeetings('resultOfMeeting')} >
                                                                                Resultat av aktivitet {this.renderSortIconProspectMeetings('resultOfMeeting')}
                                                                            </th>
                                                                            <th style={{ width: "20%", cursor: "pointer" }} onClick={() => this.handleSortProspectMeetings('prospectName')} >
                                                                                Prospekt {this.renderSortIconProspectMeetings('prospectName')}
                                                                            </th>
                                                                            <th style={{ width: "20%" }} >
                                                                                Säljare
                                                                            </th>
                                                                            <th style={{ width: "10%" }}></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{ backgroundColor: "white" }}>
                                                                        {sortedProspectMeetings.map(d => {
                                                                            return this.renderProspectMeeting2(d);
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <CustomerGroups />
                            </TabPanel>
                            <TabPanel>
                                <Value />
                            </TabPanel>
                            <TabPanel>
                                <CustomerList />
                            </TabPanel>
                            {this.state.companyId == '7f011702-09b2-4fc3-8f94-3033436a6fc5' &&
                                <TabPanel>
                                    <Budget />
                                </TabPanel>
                            }
                            <TabPanel>
                                <div className="row col-sm-12" style={{ margin: "0", textAlign: "center" }}>
                                    <div className="col-sm-12 col-md-6">
                                        <h4>
                                            Skapa roll
                                            <BsInfoCircleFill data-tip="Skapa roll som sedan kan appliceras på kundkontakter" data-for="roleTip" style={{ marginLeft: "5px", height: "17px" }} />
                                            <ReactTooltip id="roleTip" place="top" effect="solid" />
                                        </h4>
                                        <div className="col-sm-12" style={{ display: "flex", padding: "0" }}>
                                            <input id="newRole" className="form-control" />
                                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveRole()}>Spara</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="col-sm-12" style={{ display: "block" }}>
                                            <h4> Sparade </h4>
                                            <Table style={{ textAlign: "left" }}>
                                                <tbody>
                                                    {this.state.roles.map(d => {
                                                        return this.renderRole(d);
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <Members />
                            </TabPanel>
                            <TabPanel>
                                <div className="row col-sm-12">
                                    <div className="col-sm-12 col-md-6" style={{ textAlign: "center" }}>
                                        <h4>
                                            Lägg till aktivitet-alternativ
                                    <BsInfoCircleFill data-tip="Lägg till alternativ som sedan kan användas i SäljAppens formulär" data-for="statusTip" style={{ marginLeft: "5px", height: "17px" }} />
                                            <ReactTooltip id="statusTip" place="top" effect="solid" />
                                        </h4>
                                        <div className="col-sm-12" style={{ display: "flex", padding: "0" }}>
                                            <input id="newOption" className="form-control" />
                                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveOption()}>Spara</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="col-sm-12" style={{ display: "block", textAlign: "center" }}>
                                            <h4> Sparade </h4>
                                            <Table style={{ textAlign: "left" }}>
                                                <tbody>
                                                    {this.state.options.map(d => {
                                                        return this.renderOption(d);
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                  ) : (
                        <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                            <div className="col-sm-12" style={{ display: "grid", textAlign: "center" }}>
                                <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Välkommen till Säljappen</h2>
                            </div>
                            <hr style={{ borderTop: "2px solid black" }} />
                            <div className="col-sm-12" style={{ textAlign: "center" }}>
                                <p>Här kan du administrera kundaktiviteter, projektaktiviteter samt ta del av analys och säljrapport.</p>
                            </div>
                            {/*<div>*/}
                            {/*    <Kanban/>*/}
                            {/*</div>*/}
                        </div>
                    )}
                {component.state.projectIdEditModal != null &&
                    <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                        show={component.state.showEditProjectModal}
                        onHide={() => {
                            component.setState({ showEditProjectModal: false });
                            this.getFilteredData();
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
                            this.getFilteredData();
                    }}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <EditMeetingModal meetingId={component.state.meetingIdEditModal} customerId={component.state.customerIdEditModal} closeEditMeetingModal={component.closeEditMeetingModal} />
                        </Modal.Body>
                    </Modal>
                }
            </Fragment>
        );
    }
}

const height = 35;

class SelectList extends React.Component {
    render() {
        const { options, children, maxHeight, getValue } = this.props;
        const [value] = getValue();
        const initialOffset = options.indexOf(value) * height;

        return (
            <List
                height={maxHeight}
                itemCount={children.length}
                itemSize={height}
                initialScrollOffset={initialOffset}
            >
                {({ index, style }) => <div style={style}>{children[index]}</div>}
            </List>
        );
    }
}

export default Admin;