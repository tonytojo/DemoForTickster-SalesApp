import React, { useState, useEffect } from "react";
import { getCompanyMembers, removeAdMember, getActivitiesWithTimeSpan, changeSystemRole } from './requestHandler';
import { BsInfoCircleFill } from 'react-icons/bs';
import ReactTooltip from "react-tooltip";
import Table from 'react-bootstrap/Table';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function Members() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const [members, setMembers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [color, setColor] = useState($('#color').val());
    const [fromDate, setFromDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(lastDayOfMonth.toISOString().split('T')[0]);

    useEffect(() => {
        $.when(getCompanyMembers()).then(function successHandler(data) {
            $.when(getActivitiesWithTimeSpan($("#companyId").val(), firstDayOfMonth.toISOString().split('T')[0], lastDayOfMonth.toISOString().split('T')[0] )).then(function successHandler(loginsResponse) {
                setMembers(data);
                setActivities(loginsResponse);
            }.bind(this));
        }.bind(this));
    }, [members.value]);

    function renderMember(member){
        return (
            <option value={member.id}> {member.name} </option>  
        );
    }

    useEffect(() => {
        setActivities([]);
        $.when(getActivitiesWithTimeSpan($("#companyId").val(), fromDate, toDate)).then(function successHandler(loginsResponse) {
            setActivities(loginsResponse);
        }.bind(this));
    }, [fromDate, toDate]);

    function removeMember() {
        var memberId = $('#members').val();

        $.when(removeAdMember(memberId)).then(function successHandler(status) {
            if (status) {
                $("#removeBoxRemove").hide();
                $("#valueSuccessRemove").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $("#valueSuccessRemove").hide();
                }, 5000);

                setTimeout();
            }
            else {
                alert("Kunde inte ta bort användaren.")
            }
        }.bind(this));
    }

    function cancelRemove() {
        $("#removeBoxRemove").hide();
        this.setState({
            removeCustomerId: null
        })
    }

    function showRemove() {
        $("#removeBoxRemove").show();
    }

    function changeRole(userId, newStatus, role) {
        $.when(changeSystemRole($("#companyId").val(), userId, newStatus, role)).then(function successHandler(status) {
            if (status) {
                $.when(getActivitiesWithTimeSpan($("#companyId").val(), fromDate, toDate)).then(function successHandler(loginsResponse) {
                    setActivities(loginsResponse);
                }.bind(this));
            }
            else {
                alert("Kunde inte ändra rollen.")
            }
        }.bind(this));
    }

    function renderActivity(activity) {
        return (
            <tr key={activity.salesmanName} className="tableRow">
                <td style={{ paddingTop: "18px"}}>{activity.salesmanName}</td>
                <td style={{ paddingTop: "18px" }}>{activity.noOfLogins}</td>
                <td style={{ paddingTop: "18px" }}>{activity.noOfProjects}</td>
                <td style={{ paddingTop: "18px" }}>{activity.noOfActivities}</td>
                <td style={{ paddingTop: "18px" }}>{activity.noOfKilometers}</td>
                <td style={{ paddingTop: "18px", display: "flex" }}>
                    {activity.isAdmin &&
                        <div onClick={() => {changeRole(activity.userId, false, "Admin")}} style={{ height: "100%", backgroundColor: "gold", borderRadius: "4px", width: "20px", textAlign: "center", cursor: "pointer", marginLeft: "5px" }} title="Admin">
                            A
                        </div>
                    }
                    {!activity.isAdmin &&
                        <div onClick={() => { changeRole(activity.userId,true, "Admin") }} style={{ height: "100%", borderRadius: "4px", width: "20px", textAlign: "center", cursor: "pointer", border: "1px solid black", marginLeft: "5px" }} title="Admin">
                            A
                        </div>
                    }
                    {activity.isSuperUser &&
                        <div onClick={() => { changeRole(activity.userId,false, "SuperUser") }} style={{ height: "100%", backgroundColor: "blue", color: "white", borderRadius: "4px", width: "20px", textAlign: "center", cursor: "pointer", marginLeft: "5px" }} title="Superanvändare">
                            S
                        </div>
                    }
                    {!activity.isSuperUser &&
                        <div onClick={() => { changeRole(activity.userId,true, "SuperUser") }} style={{ height: "100%", borderRadius: "4px", width: "20px", textAlign: "center", cursor: "pointer", border: "1px solid black", marginLeft: "5px" }} title="Superanvändare">
                            S
                        </div>
                    }
                    {activity.isStoreUser &&
                        <div onClick={() => { changeRole(activity.userId, false, "StoreUser") }} style={{ height: "100%", backgroundColor: "purple", color: "white", borderRadius: "4px", width: "20px", textAlign: "center", cursor: "pointer", marginLeft: "5px"}} title="Butiksanvändare">
                            B
                        </div>
                    }
                    {!activity.isStoreUser &&
                        <div onClick={() => { changeRole(activity.userId,true, "StoreUser") }} style={{ height: "100%", borderRadius: "4px", width: "20px", textAlign: "center", cursor: "pointer", border: "1px solid black", marginLeft: "5px"}} title="Butiksanvändare">
                            B
                        </div>
                    }
                </td>
            </tr>
        )
    }

    function onDateChange(e) {
        if (e.target.id == "dateRangeFrom")
            setFromDate(e.target.value);
        if (e.target.id == "dateRangeTo")
            setToDate(e.target.value);
    }

    return (
        <div className="col-sm-12" style={{ textAlign: "left" }}>
            <div id="valueSuccessRemove" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                <h4>Medlemmen har tagits bort.</h4>
            </div>
            <div id="removeBoxRemove" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                <h4>Vill du ta bort medlemmen?</h4>
                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => removeMember()}>Ta bort</button>
                <button className="btn btn-warning" onClick={() => cancelRemove()}>Avbryt</button>
            </div>
            <div>
                <Tabs>
                    <TabList style={{ textTransform: "uppercase" }} className="tabGroup">
                        <Tab>Säljare</Tab>
                        <Tab>Ta bort säljare</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="col-sm-12" style={{ textAlign: "left", height: "", marginTop: "10px" }}>
                            <h4>
                                Säljare
                            </h4>
                            <div className="col-sm-12 col-md-6" style={{ display: "flex", padding: "5px" }}>
                                <input id="dateRangeFrom" type="date" className="form-control" value={fromDate} onChange={(e) => { onDateChange(e); }} />
                                <span style={{ padding: "5px" }}>-</span>
                                <input id="dateRangeTo" type="date" className="form-control" value={toDate} onChange={(e) => { onDateChange(e); }} />
                            </div>
                            <div style={{ display: "grid", height: "500px", overflow: "scroll" }}>
                                {activities.length > 0 &&
                                    <Table style={{ textAlign: "left", fontSize: "14px" }}>
                                        <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                            <tr>
                                                <th style={{ width: "15%", cursor: "pointer" }}>
                                                    Namn
                                                </th>
                                                <th style={{ width: "15%", cursor: "pointer" }}>
                                                    Inloggningar
                                                </th>
                                                <th style={{ width: "15%", cursor: "pointer" }}>
                                                    Projekt
                                                </th>
                                                <th style={{ width: "15%", cursor: "pointer" }}>
                                                    Kundaktiviteter
                                                </th>
                                                <th style={{ width: "15%" }} >
                                                    Antal kilometer
                                                </th>
                                                <th style={{ width: "25%" }} >
                                                    Roller
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map(d => {
                                                return renderActivity(d);
                                            })}
                                        </tbody>
                                    </Table>
                                }
                                {activities.length === 0 &&
                                    <div id="spinner" style={{ marginTop: "7px" }} className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="col-sm-12" style={{ textAlign: "left", display: "flex" }}>
                            <div className="col-sm-12 col-md-6">
                                <h4>
                                    Ta bort användare
                            <BsInfoCircleFill data-tip="Ta bort accessen till SäljAppen för användare" data-for="removeTip" style={{ marginLeft: "5px", height: "17px" }} />
                                    <ReactTooltip id="removeTip" place="top" effect="solid" />
                                </h4>
                                <select id="members" className="form-control">
                                    {members.map(m => {
                                        return renderMember(m);
                                    })}
                                </select>
                                <button className="form-control" style={{ backgroundColor: color, marginTop: "10px", color: "white" }} onClick={() => showRemove()}>
                                    Ta bort
                                </button>
                            </div>
                            <div className="col-sm-12 col-md-6">
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}

export default Members;