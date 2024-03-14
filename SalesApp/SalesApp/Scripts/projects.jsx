import "core-js/stable";
import "regenerator-runtime/runtime";

import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';
import {
    getNameOfCustomerOrGroup, getProjects, getCustomerContacts,
    getCompanyMembers, saveProject, getOptions,
    getFollowUps, saveFollowUp, getCustomersInGroup,
    getProjectsOfEntireCustomerGroup, removeProject, getCampaigns,
    saveCustomerContact, getRoles, getCompanyResponsiblesSelect
} from './requestHandler';
import { Link } from 'react-router-dom';
import { BsInfoCircleFill, BsFillTrashFill } from 'react-icons/bs';
import ReactTooltip from "react-tooltip";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Modal from 'react-bootstrap/Modal';
import EditProjectModal from './editProjectModal';
import Popup from 'reactjs-popup';
import Dropzone from "react-dropzone";
import Select from 'react-select'

var component;
export class Projects extends React.Component {
    constructor(props) {
        super(props);
        component = this;
        var customerId = this.getCustomerId();
        customerId = customerId.replace('?customerGroup', '');

        var isCustomerGroup = false;
        if (window.location.href.indexOf("customerGroup") > -1) {
            isCustomerGroup = true;
        }

        this.state = {
            logo: $('#logo').val(),
            color: $('#color').val(),
            company: $('#company').val(),
            companyId: $('#companyId').val(),
            name: "",
            isCustomerGroup: isCustomerGroup,
            customers: [],
            originalProjects: [],
            projects: [],
            customerContacts: [],
            companyMembers: [],
            customerId: customerId,
            options: [],
            followUps: [],
            removeProject: null,
            isCustomerGroup: isCustomerGroup,
            userEmail: $("#username").val(),
            campaigns: [],
            showEditProjectModal: false,
            projectIdEditModal: null,
            customerIdEditModal: null,
            roles: [],
            companyResponsiblesSelect: [],
            selectedCompanyResponsibles: [],

            activityStatus: "",
            dropdownOptions: ['Vunnet', 'Förlorat', 'Övrigt'],
            selectedDropdownOption: '',
            showDropdown: false,
            selectedDate :''
        //    selectedFiles: []
        }

        if (isCustomerGroup) {
            $.when(getCustomersInGroup(customerId).then(function successHandler(customers) {
                $.when(getCustomerContacts(this.state.companyId, customerId)).then(function successHandler(data) {
                this.setState({
                    customers: customers,
                    customerContacts: data
                });
                }.bind(this));
            }.bind(this)));

            $.when(getNameOfCustomerOrGroup($('#companyId').val(), customerId)).then(function successHandler(name) {
                if (isCustomerGroup) {
                    $.when(getProjectsOfEntireCustomerGroup(customerId).then(function successHandler(projects) {
                        this.setState({
                            name: name,
                            projects: projects,
                            originalProjects: projects,
                        });
                    }.bind(this)));
                }
                else {
                    $.when(getProjects($('#companyId').val(), customerId)).then(function successHandler(projects) {
                        this.setState({
                            name: name,
                            projects: projects,
                            originalProjects: projects,
                        });
                    }.bind(this));
                }
            }.bind(this));

            $.when(getCompanyMembers()).then(function successHandler(data) {
                if (data != undefined) {
                    this.setState({
                        companyMembers: data
                    })
                }
                else {
                }
            }.bind(this));

            $.when(getOptions(this.state.companyId)).then(function successHandler(data) {
                if (data != undefined) {
                    this.setState({
                        options: data
                    })
                }
                else {
                }
            }.bind(this));

            $.when(getFollowUps(this.state.companyId, customerId)).then(function successHandler(followUps) {
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
        else {
            $.when(getNameOfCustomerOrGroup($('#companyId').val(), customerId)).then(function successHandler(name) {
                if (isCustomerGroup) {
                    $.when(getProjectsOfEntireCustomerGroup(customerId).then(function successHandler(projects) {
                        this.setState({
                            name: name,
                            projects: projects,
                            originalProjects: projects,
                        });
                    }.bind(this)));
                }
                else {
                    $.when(getProjects($('#companyId').val(), customerId)).then(function successHandler(projects) {
                        this.setState({
                            name: name,
                            projects: projects,
                            originalProjects: projects,
                        });
                    }.bind(this));
                }
            }.bind(this));

            $.when(getCustomerContacts(this.state.companyId, customerId)).then(function successHandler(data) {
                if (data != undefined) {
                    this.setState({
                        customerContacts: data
                    })
                }
                else {
                }
            }.bind(this));

            $.when(getCompanyMembers()).then(function successHandler(data) {
                if (data != undefined) {
                    this.setState({
                        companyMembers: data
                    })
                }
                else {
                }
            }.bind(this));

            $.when(getOptions(this.state.companyId)).then(function successHandler(data) {
                if (data != undefined) {
                    this.setState({
                        options: data
                    })
                }
                else {
                }
            }.bind(this));

            $.when(getFollowUps(this.state.companyId, customerId)).then(function successHandler(followUps) {
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

        $.when(getCampaigns(this.state.companyId)).then(function successHandler(campaigns) {
            component.setState({
                campaigns: campaigns
            });
        });

        $.when(getRoles($('#companyId').val())).then(function successHandler(roles) {
            if (roles != undefined) {
                this.setState({
                    roles: roles
                })
            }
            else {
            }
        }.bind(this));

        $.when(getCompanyResponsiblesSelect()).then(function successHandler(responsiblesSelect) {
            component.setState({
                companyResponsiblesSelect: responsiblesSelect
            });
        }.bind(this));
    }

    getCustomerId() {
        var url = window.location.href;
        var str = url.substring(url.indexOf("Projects/"));

        return decodeURI(str.replace('Projects/', ''));
    }

    renderProject(project) {
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
            <tr key={project.date + project.activity} className="tableRow" style={{ borderLeft: "7px solid " + borderColor }}>
                <td style={{ paddingTop: "18px" }}>{project.activity}</td>
                <td style={{ paddingTop: "18px", color: color }}>{project.status}</td>
                <td style={{ paddingTop: "18px", color: color }}>{dateString}</td>
                {this.state.isCustomerGroup ?
                    (
                        <td style={{ width: "20%", paddingTop: "18px" }}>{project.customerName}</td>
                    ) :
                    (
                        <td style={{ width: "20%", paddingTop: "18px" }}>{project.companyResponsible}</td>
                    )
                }
                {this.state.isCustomerGroup &&
                    <td style={{ paddingTop: "18px" }}>
                        {project.companyResponsible}
                    </td>
                }
                <td style={{ paddingTop: "18px" }}>
                    {project.description != null &&
                    <>
                        <BsInfoCircleFill data-tip={project.description} data-for="commentTip" />
                        <ReactTooltip id="commentTip" place="top" effect="solid" multiline={true} />
                    </>
                    }
                </td>
                {this.state.isCustomerGroup ?
                    (
                        <td style={{ paddingTop: "18px" }}>
                            <Link to={"/EditProject/" + project.customerId + "/" + project.projectId + "/customerGroup/" + this.state.customerId }>
                                <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                            </Link>
                        </td>
                    ) :
                    (
                        <td style={{ paddingTop: "18px" }}>
                            <button onClick={() => { component.setState({ showEditProjectModal: true, projectIdEditModal: project.projectId, customerIdEditModal: project.customerId }) }} className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }}>Visa</button>
                        </td>
                    )
                }
                <td style={{ paddingTop: "18px" }}>
                    {this.state.isCustomerGroup ?
                        (
                            <>
                                {this.state.companyMembers.length > 0 &&
                                    <>
                                        {$("#userId").val() == project.companyResponsible &&
                                            <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemove(project)} />
                                        }
                                    </>
                                }
                            </>
                        ) :
                        (
                            <>
                                {this.state.companyMembers.length > 0 &&
                                    <>
                                        {$("#userId").val() === this.state.companyMembers.find(x => x.name === project.companyResponsible).id &&
                                            <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer", marginTop: "5px" }} onClick={() => this.showRemove(project)} />
                                        }
                                    </>
                                }
                            </>
                        )
                    }
                </td>
            </tr>
        )
    }

    renderSeller(seller) {
        return (
            <option value={ seller.name}>
                {seller.name}
            </option>
        )
    }

    renderCompanyMemberSelect(contact) {
        if ($('#userId').val() == contact.id) {
            return (
                <option key={contact.id} value={contact.id} selected>{contact.name}</option>
            )
        }
        else {
            return (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
            )
        }

    }

    renderCompanyMemberSelect2(contact) {
        return (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
        )
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</option>
        )
    }

    renderCustomer(customer) {
        return (
            <option key={customer.customerId} value={customer.customerId}>{customer.customerName}</option>
        )
    }

    renderOption(option) {
        return (
            <option key={option.optionValue} value={option.optionValue}>{option.optionValue}</option>
        )
    }

    toggleAddProject() {
        $("#addProject").toggle();
        $("#showBtn").toggle();
        $("#hideBtn").toggle();
    }

    isNullOrEmpty(value) {
        return value === null || value === '';
    }

    saveProject()
    {
        if ((!$("#activityTask").val() || !$("#activityDate").val()) || ($("#activityStatus").val() == "Klart" && this.isNullOrEmpty($("#ProjectResult").val())))
        {
            alert("Kontrollera fält som t.ex. Datum eller Projektnamn.");
            return;
        }

        $.when(saveProject(this.state.customerId, this.state.companyId, this.state.selectedCompanyResponsibles)).then(function successHandler(status)
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
                else
                {
                    $.when(getProjects($('#companyId').val(), this.state.customerId)).then(function successHandler(projects)
                    {
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


    saveFollowUp() {
        $.when(saveFollowUp(this.state.companyId, this.state.customerId)).then(function successHandler(status) {
            if (status) {
                $.when(getFollowUps(this.state.companyId, this.state.customerId)).then(function successHandler(followUps) {
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

    filterProjects() {
        if (document.getElementById('hideDone').checked) {
            var projects = component.state.originalProjects.filter(function (project) {
                return project.status != "Klart";
            });

            if($("#sellers").val() != "Alla") {
                projects = projects.filter(function (project) {
                    return project.companyResponsible == $("#sellers").val();
                });
            }

            if ($("#years").val() != "Alla") {
                projects = projects.filter(function (project) {
                    return project.date.includes($("#years").val()) == true;
                });
            }

            component.setState({
                projects: projects
            });
        } else {
            if ($("#sellers").val() != "Alla") {
                var projects = component.state.originalProjects.filter(function (project) {
                    return project.companyResponsible == $("#sellers").val();
                });

                if ($("#years").val() != "Alla") {
                    projects = projects.filter(function (project) {
                        return project.date.includes($("#years").val()) == true;
                    });
                }

                component.setState({
                    projects: projects
                });
            }
            else {
                if ($("#years").val() != "Alla") {
                    var projects = component.state.originalProjects.filter(function (project) {
                        return project.date.includes($("#years").val()) == true;
                    });

                    component.setState({
                        projects: projects
                    });
                }
                else {
                    component.setState({
                        projects: component.state.originalProjects
                    });
                }
            }
        }
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

    cancelRemove() {
        $("#removeBoxValued").hide();
        this.setState({
            removeProject: null
        })
    }

    showRemove(project) {
        $("#removeBoxValued").show();
        this.setState({
            removeProject: project
        })
    }

    async removeProject() {
        var project = this.state.removeProject;
        $.when(removeProject(project)).then(function successHandler(data) {
            if (data) {

                $.when(getNameOfCustomerOrGroup($('#companyId').val(), this.state.customerId)).then(function successHandler(name) {
                    if (this.state.isCustomerGroup) {
                        $.when(getProjectsOfEntireCustomerGroup(this.state.customerId).then(function successHandler(projects) {
                            this.setState({
                                name: name,
                                projects: projects,
                                originalProjects: projects,
                            });
                        }.bind(this)));
                        $("#removeBoxValued").hide();

                    }
                    else {
                        $.when(getProjects($('#companyId').val(), this.state.customerId)).then(function successHandler(projects) {
                            this.setState({
                                name: name,
                                projects: projects,
                                originalProjects: projects,
                            });
                        }.bind(this));
                        $("#removeBoxValued").hide();

                    }
                }.bind(this));
            }
            else {
                $("#removeBoxValued").hide();
                alert("Kunde inte radera projektet. Kontakta administratör om problemet kvarstår.")
            }
        }.bind(this));
    }

    customerSelectChange(e) {
        var value = e.target.value;

        if (component.state.isCustomerGroup) {
            $.when(getCustomerContacts(component.state.companyId, value)).then(function successHandler(data) {
                component.setState({
                    customerContacts: data
                });
            }.bind(this));        
        }
    }

    onEmailChange = (e) => {
        this.setState({
            userEmail: e.target.value
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

    saveContact() {
        if (this.state.isCustomerGroup) {
            $.when(saveCustomerContact(this.state.customerId, this.state.companyId)).then(function successHandler(status) {
                if (status) {
                    $("#spinner").hide();

                    $("#contactFirstName").val(""),
                    $("#contactLastName").val(""),
                    $("#contactTelephone").val(""),
                    $("#contactEmail").val(""),
                    $("#valueSuccessContact").show();

                    $.when(getCustomerContacts(this.state.companyId, this.state.customerId)).then(function successHandler(data) {
                        this.setState({
                            customerContacts: data
                        });
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
            $.when(saveCustomerContact(this.state.customerId, this.state.companyId)).then(function successHandler(status) {
                if (status) {
                    $("#spinner").hide();

                    $("#contactName").val(""),
                        $("#contactTelephone").val(""),
                        $("#contactEmail").val(""),
                        $("#valueSuccessContact").show();

                    $.when(getCustomerContacts(this.state.companyId, this.state.customerId)).then(function successHandler(data) {
                        this.setState({
                            customerContacts: data
                        });
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
    }

    renderRoleSelect(role) {
        return (
            <option value={role.role}>{role.role}</option>
        )
    }

    handleCompanyResponsiblesChange = (e) => {
        this.setState({
            selectedCompanyResponsibles: Array.isArray(e) ? e.map(x => x.value) : []
        })
    }

    closeEditProjectModal() {
        component.setState({ showEditProjectModal: false });
        $.when(getProjects($('#companyId').val(), component.state.customerId)).then(function successHandler(projects) {
            component.setState({
                projects: projects,
                originalProjects: projects,
            });
        }.bind(this));
    }

    handleStatusChange = (e) => {
        this.setState({ activityStatus: e.target.value });
    };

  



    //handleFileSelect = (e) => {
    //    const files = Array.from(e.target.files);
    //    this.setState({
    //        selectedFiles: [...this.state.selectedFiles, ...files]
    //    });
    //};

    //removeFile = (fileToRemove) => {
    //    const updatedFiles = this.state.selectedFiles.filter((file) => file !== fileToRemove);
    //    this.setState({
    //        selectedFiles: updatedFiles
    //    });
    //};

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12" style={{ display: "grid", textAlign: "center" }}>
                    <h2 style={{ marginTop: "15px", marginBottom: "0" }}>ProjektaktiviteterX</h2>
                    <h4 style={{ marginTop: "15px", marginBottom: "0" }}>
                        {this.state.name} 
                        {!this.state.isCustomerGroup &&
                            <Fragment>
                                ({this.state.customerId})
                            </Fragment>
                        }
                        <Link to="/CustomerSearch">
                            <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                        </Link>
                    </h4>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <Tabs>
                    <TabList>
                        <Tab>Projekt</Tab>
                        <Tab>Skapa</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="col-sm-12 head" style={{ textAlign: "center", display: "block" }}>
                            <div id="removeBoxValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                <h4>Vill du ta bort projektet?</h4>
                                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeProject()}>Ta bort</button>
                                <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                            </div>
                            <div className="col-sm-12 row" style={{ margin: "0", display: "flex" }}>
                                <div className="col-sm-12 col-md-4">
                                    <input type="checkbox" id="hideDone" onChange={this.filterProjects} />
                                    <label htmlFor="hideDone">
                                        Dölj klara
                                    </label>
                                </div>
                                <div className="col-sm-12 col-md-4">
                                    <select id="years" className="form-control" style={{ textAlign: "center", marginTop: "5px" }} onChange={this.filterProjects}>
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
                                <div className="col-sm-12 col-md-4">
                                    <select id="sellers" className="form-control" style={{ textAlign: "center", marginTop: "5px" }} onChange={this.filterProjects}>
                                        <option value="Alla">Alla säljare</option>
                                        {this.state.companyMembers.map(d => {
                                            return this.renderSeller(d);
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="row" style={{ marginTop: "15px" }}>
                                    <div className="col-sm-12" style={{textAlign:"center", overflow: "scroll", maxHeight: "600px" }}>
                                        <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                            <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                                <tr>
                                                    <th>Aktivitet</th>
                                                    <th>Status</th>
                                                    <th>Datum</th>
                                                    {this.state.isCustomerGroup ?
                                                        (
                                                            <th>Kund</th>
                                                        ):
                                                            (
                                                            <th>Ansvarig</th>
                                                        )
                                                    }
                                                    {this.state.isCustomerGroup &&
                                                        <th>Säljare</th>
                                                    }
                                                    <th> </th>
                                                    <th> </th>
                                                    <th> </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ backgroundColor: "white" }}>
                                                {this.state.projects.map(d => {
                                                    return this.renderProject(d);
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div id="addProject" className="row col-sm-12" style={{ textAlign: "center" }}>
                            <div className="col-sm-12">
                                <h4> Lägg till nytt projekt </h4>
                            </div>
                            <div id="valueSuccessProject" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                                <h4>Aktiviteten har sparats</h4>
                            </div>
                            <div className="col-sm-12 col-md-6" >
                                <div className="col-sm-12" >
                                    <label> Datum </label>
                                    <input type="date" id="activityDate" className="form-control"/>
                                </div>
                                {this.state.isCustomerGroup ?
                                    (
                                        <div className="col-sm-12" >
                                            <label> Kund </label>
                                            <select id="activityCustomer" className="form-control">
                                                <option key={this.state.customerId} value={this.state.customerId}>{this.state.name} (Kundgrupp)</option>
                                                {this.state.customers.map(d => {
                                                    return this.renderCustomer(d);
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
                                            return this.renderCustomerContactSelect(d);
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
                            </div>
                            <div className="col-sm-12 col-md-6" >
                                <div className="col-sm-12" >
                                    <label> Projektnamn </label>
                                    <input id="activityTask" className="form-control" maxlength="30"/>
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

                                <div className="col-sm-12" >
                                    <label> Nästa steg </label>
                                    <input id="activityNextStep" className="form-control" />
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


                                {/*<input*/}
                                {/*    type="file"*/}
                                {/*    multiple*/}
                                {/*    onChange={this.handleFileSelect}*/}
                                {/*    className="file-input"*/}
                                {/*/>*/}
                                {/*<div>*/}
                                {/*    {this.state.selectedFiles.map((file, index) => (*/}
                                {/*        <div key={index}>*/}
                                {/*            {file.name}*/}
                                {/*            <button onClick={() => this.removeFile(file)}>Ta bort</button>*/}
                                {/*        </div>*/}
                                {/*    ))}*/}
                                {/*</div>*/}
                            </div>
                            <button id="saveContact" className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveProject()}>Spara</button>
                        </div>
                    </TabPanel>             
                </Tabs>
                {component.state.projectIdEditModal != null &&
                    <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                        show={component.state.showEditProjectModal}
                        onHide={() => {
                            component.setState({ showEditProjectModal: false });
                            $.when(getProjects($('#companyId').val(), this.state.customerId)).then(function successHandler(projects) {
                                this.setState({
                                    projects: projects,
                                    originalProjects: projects,
                                });
                            }.bind(this));

                        }}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                        <EditProjectModal projectId={component.state.projectIdEditModal} customerId={component.state.customerIdEditModal} closeEditProjectModal={component.closeEditProjectModal} />
                        </Modal.Body>
                    </Modal>
                }
            </div>
        );
    }
}

export default Projects;