import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { BsFillTrashFill } from 'react-icons/bs';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { getCampaigns, removeCampaign, getCompanyMembers, getCustomers, saveCampaign} from "./requestHandler";
import { default as ReactSelect } from "react-select";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

var component;
export class Campaigns extends React.Component {
    constructor(props) {
        super(props);
        component = this;

        this.state = {
            companyId: $('#companyId').val(),
            campaigns: [],
            color: $('#color').val(),
            removeCampaignId: null,
            originalCampaigns: [],
            classesSelected: null,
            sortBy: 'classification',         // Column to sort by (null for no sorting)
            sortDirection: 1,    // Sort direction: 1 for ascending, -1 for descending
            companyMembers: [],
            membersSelected: [],
            chosenCustomerId: null,
            customers: [],
            customersSearchSelect: [],
            sortBy: 'startDate',         // Column to sort by (null for no sorting)
            sortDirection: 1    // Sort direction: 1 for ascending, -1 for descending
        }

        $.when(getCampaigns(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                campaigns: data,
                originalCampaigns: data
            })
        }.bind(this));

        $.when(getCompanyMembers()).then(function successHandler(data) {
            if (data != undefined) {
                const newArray = data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                this.setState({
                    companyMembers: newArray.sort((a, b) => (a.label > b.label) ? 1 : -1)
                })
            }
            else {
            }
        }.bind(this));

        $.when(getCustomers($("#companyId").val())).then(function successHandler(data) {
            if (data != undefined) {

                var customersSearchSelect = [];
                for (let i = 0; i < data.length; i++) {
                    customersSearchSelect.push({ label: data[i].name, value: data[i].id })
                }

                this.setState({
                    customers: data.sort((a, b) => (a.name > b.name) ? 1 : -1),
                    customersSearchSelect: customersSearchSelect
                })
            }
            else {
            }
        }.bind(this));

    }

    componentDidUpdate() {

    }

    async removeCampaign() {
        var id = this.state.removeCampaignId;
        $.when(removeCampaign(this.state.companyId, id)).then(function successHandler(data) {
            if (data) {
                $.when(getCampaigns(this.state.companyId)).then(function successHandler(data) {
                    $("#removeBoxValued").hide();
                    this.setState({
                        campaigns: data
                    })
                }.bind(this));
            }
            else {
                $("#removeBoxValued").hide();
                alert("Kunde inte radera kampanjen. Kontakta administratör om problemet kvarstår.")
            }
        }.bind(this));
    }

    renderCampaign(campaign) {
        return (
            <tr key={campaign.id} className="tableRow" style={{ borderBottom: "1px solid black", borderLeft: "7px solid " + color }}>
                <td>{campaign.title}</td>
                <td className="hideMobile">{campaign.startDate.split("T")[0]}</td>
                <td className="hideMobile">{campaign.endDate != null ? campaign.endDate.split("T")[0] : ""}</td>
                <td style={{ width: "20%" }}>
                    <Link to={"/Campaigns/EditCampaign/" + campaign.id}><Button style={{ fontSize: "9px", backgroundColor: this.state.color, color: "white" }} variant="secondary">Redigera</Button></Link>
                </td>
                <td>
                    <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer" }} onClick={() => this.showRemove(campaign.id)} />
                </td>
            </tr>
        )
    }

    cancelRemove() {
        $("#removeBoxValued").hide();
        this.setState({
            removeCampaignId: null
        })
    }

    showRemove(id) {
        $("#removeBoxValued").show();
        this.setState({
            removeCampaignId: id
        })
    }

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

    renderSortIcon = (column) => {
        if (this.state.sortBy === column) {
            return this.state.sortDirection === 1 ? '↑' : '↓';
        }
        return null;
    };

    sortCampaigns = (campaigns) => {
        const { sortBy, sortDirection } = this.state;
        if (!sortBy) {
            return campaigns;
        }
        return [...campaigns].sort((a, b) =>
            a[sortBy].localeCompare(b[sortBy]) * sortDirection
        );
    };

    renderCompanyMemberSelect(member) {
        return (
            <option key={member.id} value={member.id}>{member.name}</option>
        )
    }

    handleMembersChange = (newList) => {
        this.setState({
            membersSelected: newList
        })
    }

    onCustomerSelect(e) {
        component.setState({ chosenCustomerId: e.value })
    }

    saveCampaign() {
        var name = $('#title').val();
        if (name == "" || name == undefined || this.state.membersSelected.length == 0) {
            alert('Namn måste fyllas i och minst en säljare måste väljas.');
        }
        else {
            var campaign = {
                title: name,
                startDate: $("#startDate").val(),
                endDate: $("#endDate").val(),
                description: $("#description").val(),
                companyId: $("#companyId").val(),
                customerId: this.state.chosenCustomerId
            }
            $.when(saveCampaign(campaign, this.state.membersSelected)).then(function successHandler(response) {
                if (response) {

                    $("#successCampaign").show();
                    window.scrollTo(0, 0);

                    setTimeout(function () {
                        $("#successCampaign").hide();
                    }, 5000);
                    $("#title").val("");
                    $("#startDate").val("");
                    $("#endDate").val("");
                    $("#description").val("");

                    $.when(getCampaigns(this.state.companyId)).then(function successHandler(data) {
                        this.setState({
                            campaigns: data,
                            originalCampaigns: data,
                            chosenCustomerId: null,
                            membersSelected: []
                        })
                    }.bind(this));


                } else {
                    alert('Kampanjen kunde inte sparas.');
                }
            }.bind(this));
        }
    }

    render() {
        const sortedCampaigns = this.sortCampaigns(this.state.campaigns);

        return (
                <Tabs>
                    <TabList style={{ textTransform: "uppercase" }}>
                        <Tab>Hantera</Tab>
                        <Tab>Skapa ny</Tab>
                    </TabList>
                    <TabPanel>
                        <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                            <div id="removeBoxValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                <h4>Vill du ta bort kampanjen?</h4>
                                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeCampaign()}>Ta bort</button>
                                <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                            </div>
                            <div className="col-sm-12 row" style={{ margin: "0", display: "flex", padding: "5px" }}>
                                {/*<div className="col-sm-12 col-md-4" style={{ padding: "0"}}>*/}
                                {/*    <ReactSelect*/}
                                {/*        options={classOptions}*/}
                                {/*        isMulti*/}
                                {/*        closeMenuOnSelect={false}*/}
                                {/*        hideSelectedOptions={false}*/}
                                {/*        onChange={this.handleClassesChange}*/}
                                {/*        allowSelectAll={true}*/}
                                {/*        value={this.state.classesSelected}*/}
                                {/*        placeholder="Klassificering"*/}
                                {/*        style={{marginTop:"5px"}}*/}
                                {/*    />*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-12 col-md-4">*/}
                                {/*    <select id="types" className="form-control" style={{ textAlign: "center"}} onChange={this.filterProjects}>*/}
                                {/*        <option value="Alla typer">Alla typer</option>*/}
                                {/*        <option value="Kundgrupp">Kundgrupp</option>*/}
                                {/*        <option value="Kund">Kund</option>*/}
                                {/*    </select>*/}
                                {/*</div>*/}
                            </div>
                            <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                    <tr>
                                        <th onClick={() => this.handleSort('title')} style={{ cursor: "pointer" }}>
                                            Titel {this.renderSortIcon('title')}
                                        </th>
                                        <th className="hideMobile" onClick={() => this.handleSort('startDate')} style={{ cursor: "pointer" }}>
                                            Startdatum {this.renderSortIcon('startDate')}
                                        </th>
                                        <th className="hideMobile" onClick={() => this.handleSort('endDate')} style={{ cursor: "pointer" }}>
                                            Slutdatum {this.renderSortIcon('endDate')}
                                        </th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody style={{ backgroundColor: "white" }}>
                                    {sortedCampaigns.map(d => {
                                        return this.renderCampaign(d);
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </TabPanel>
                <TabPanel>
                    <div id="successCampaign" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                        <h4>Kampanjen har skapats</h4>
                    </div>
                    <div className="col-sm-12" style={{display: "flex"}}>
                        <div className="col-sm-12 col-md-6">
                            <div>
                                <label> Titel </label>
                                <input type="text" id="title" name="trip-start" className="form-control"
                                    min="2022-01-01" max="2030-12-31" required />
                            </div>
                            <div>
                                <label> Startdatum </label>
                                <input type="date" id="startDate" name="trip-start" className="form-control"
                                    min="2022-01-01" max="2030-12-31" required />
                            </div>
                            <div>
                                <label> Slutdatum </label>
                                <input type="date" id="endDate" name="trip-start" className="form-control"
                                    min="2022-01-01" max="2030-12-31" required />
                            </div>
                            <div>
                                <label> Beskrivning(valfritt, max 1500 tecken)</label>
                                <textarea id="description" className="form-control" maxlength="1500" />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div style={{ marginTop: "32px" }}>
                                <ReactSelect
                                    options={this.state.companyMembers}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    onChange={this.handleMembersChange}
                                    allowSelectAll={true}
                                    value={this.state.membersSelected}
                                    placeholder="Säljare"
                                    style={{ marginTop: "5px" }}
                                />
                            </div>
                        </div>
                    </div>
                    <button id="saveCampaign" className="btn btn-primary" onClick={() => this.saveCampaign()} style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }}>Skapa kampanj</button>
                </TabPanel>
                </Tabs>
        );
    }
}

export default Campaigns;