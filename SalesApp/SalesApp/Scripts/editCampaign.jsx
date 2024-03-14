import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { getCompanyMembers, editCampaign, getCampaign, getSelectedMembersForCampaign } from './requestHandler'
import { default as ReactSelect } from "react-select";

var component;
export class EditCampaign extends React.Component {
    constructor(props) {
        super(props);
        component = this;

        this.state = {
            companyId: $('#companyId').val(),
            color: $('#color').val(),
            campaignId: this.getCampaignId(),
            title: "",
            startDate: "",
            endDate: "",
            description: "",
            salesmen: [],
            membersSelected: []
        }

        $('#spinner').show();

        $.when(getCampaign(this.state.campaignId)).then(function successHandler(data) {
            $.when(getCompanyMembers()).then(function successHandler(companyMembers) {
                $.when(getSelectedMembersForCampaign(this.state.companyId, this.getCampaignId())).then(function successHandler(membersSelected) {
                    const newArray = companyMembers.map(item => ({
                        value: item.id,
                        label: item.name
                    }));

                    this.setState({
                        title: data.title,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        description: data.description,
                        salesmen: newArray.sort((a, b) => (a.label > b.label) ? 1 : -1),
                        membersSelected: membersSelected
                    }, () => {
                        this.setSelected();
                        $('#spinner').hide();
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    setSelected() {
        let elementStartDate = document.getElementById("startDate");
        elementStartDate.value = this.state.startDate.split("T")[0];

        let elementEndDate = document.getElementById("endDate");
        elementEndDate.value = this.state.endDate.split("T")[0];      
    }

    getCampaignId() {
        const windowUrl = window.location.href;
        const params = windowUrl.split("/");
        return params[5];
    }

    editCampaign() {
        var name = $('#title').val();
        if (name == "" || name == undefined || this.state.membersSelected.length == 0) {
            alert('Namn måste fyllas i och minst en säljare måste väljas.');
        }
        else {
            var campaign = {
                id: this.getCampaignId(),
                title: name,
                startDate: $("#startDate").val(),
                endDate: $("#endDate").val(),
                description: $("#description").val(),
                companyId: $("#companyId").val(),
            }
            $.when(editCampaign(campaign, this.state.membersSelected)).then(function successHandler(response) {
                if (response) {

                    $("#successCampaign").show();
                    window.scrollTo(0, 0);

                    setTimeout(function () {
                        $("#successCampaign").hide();
                    }, 5000);
                } else {
                    alert('Kampanjen kunde inte sparas.');
                }
            }.bind(this));
        }
    }
    
    titleChange(event) {
        component.setState({
            title: event.target.value
        });
    }

    descriptionChange(event) {
        component.setState({
            description: event.target.value
        });
    }

    handleMembersChange = (newList) => {
        this.setState({
            membersSelected: newList
        })
    }


    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                    <div className="col-sm-12" style={{ display: "grid" }}>
                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Redigera kampanj
                        </h2>
                    </div>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <div id="successCampaign" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Kampanjen har sparats</h4>
                </div>
                <div className="row col-sm-12" style={{ margin: "0" }}>
                    <div className="col-sm-12 col-md-6">
                        <div>
                            <label> Titel </label>
                            <input type="text" id="title" name="trip-start" className="form-control" value={this.state.title} onChange={this.titleChange}
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
                            <textarea id="description" className="form-control" maxlength="1500" value={this.state.description} onChange={this.descriptionChange}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div style={{ marginTop: "32px" }}>
                            <ReactSelect
                                options={this.state.salesmen}
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
                    <button onClick={() => this.editCampaign()} className="btn btn-primary" style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }}>Spara projekt</button>
                </div>
            </div>
        );
    }
}

export default EditCampaign;