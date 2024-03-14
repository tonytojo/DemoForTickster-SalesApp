import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { getProspectContact, getRoles, editProspectContact } from './requestHandler'
import { BsPencilSquare } from 'react-icons/bs';

var component;
export class EditProspectContactModal extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.meeetingId === null)
            return null;

        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            prospectId: this.props.prospectId,
            id: this.props.id,
            color: $('#color').val(),
            firstName: "",
            lastName: "",
            tele: "",
            email: "",
            role: "",
            oldFirstName: "",
            oldLastName: "",
            oldTele: "",
            oldEmail: "",
            oldRole: "",
            options: [],
            roles: [],
            disabled: true
        }
        $.when(getProspectContact(this.state.companyId, this.props.prospectId, this.props.id)).then(function successHandler(data) {
            this.setState({
                firstName: data.firstName,
                lastName: data.lastName,
                tele: data.telephone,
                email: data.email,
                role: data.role,
                oldFirstName: data.firstName,
                oldLastName: data.lastName,
                oldTele: data.telephone,
                oldEmail: data.email,
                oldRole: data.role
            });
            this.setSelected();
        }.bind(this));

        $.when(getRoles(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                roles: data
            })
            this.setSelected();
        }.bind(this));
    }

    setSelected() {
        let element = document.getElementById("contactRole");
        element.value = this.state.role;
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.name + "-" + contact.role} value={contact.name}>{contact.name + "-" + contact.role}</option>
        )
    }

    editProspectContact() {
        $.when(editProspectContact(this.state.prospectId, this.state.companyId, this.state.id)).then(function successHandler(status) {
            if (status) {
                $("#valueSuccessMeeting").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $("#valueSuccessMeeting").hide();
                }, 5000);

                setTimeout();
            }
            else {
                alert("Kunde inte redigera kontakten. Kontrollera att alla fält är ifyllda.")
            }
        }.bind(this));
    }

    firstNameChanged(event) {
        component.setState({
            firstName: event.target.value
        });
    }

    lastNameChanged(event) {
        component.setState({
            lastName: event.target.value
        });
    }

    teleChanged(event) {
        component.setState({
            tele: event.target.value
        });
    }

    emailChanged(event) {
        component.setState({
            email: event.target.value
        });
    }

    roleChanged(event) {
        component.setState({
            role: event.target.value
        });
    }

    renderRoleSelect(role) {
        return (
            <option value={role.role}>{role.role}</option>
        )
    }

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px"}}>
                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                    <div className="col-sm-12" style={{ display: "grid" }}>
                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>
                            Redigera kontakt
                        </h2>
                    </div>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <div id="valueSuccessMeeting" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Kontakten har sparats</h4>
                </div>
                <div className="row col-sm-12" style={{ margin: "0" }}>
                    <div className="col-sm-12">
                        <div id="addContact" className="col-sm-12" style={{ textAlign: "center" }}>
                            <div style={{width: "100%", height: "15px"}}>
                                <BsPencilSquare style={{ cursor: "pointer", float: "right" }} onClick={() => { this.setState({ disabled: !this.state.disabled }) }} />
                            </div>
                            <div className="col-sm-12">
                                <div className="col-sm-12">
                                    <label> Förnamn </label>
                                    <input id="contactFirstName" className="form-control" value={this.state.firstName} onChange={this.firstNameChanged} disabled={this.state.disabled} />
                                </div>
                                <div className="col-sm-12">
                                    <label> Efternamn </label>
                                    <input id="contactLastName" className="form-control" value={this.state.lastName} onChange={this.lastNameChanged} disabled={this.state.disabled} />
                                </div>
                                <div className="col-sm-12">
                                    <label> Email </label>
                                    <input id="contactEmail" className="form-control" value={this.state.email} onChange={this.emailChanged} disabled={this.state.disabled} />
                                </div>
                                <div className="col-sm-12">
                                    <label> Telefon </label>
                                    <input id="contactTelephone" className="form-control" value={this.state.tele} onChange={this.teleChanged} disabled={this.state.disabled} />
                                </div>
                                <div className="col-sm-12">
                                    <label> Roll </label>
                                    <select id="contactRole" className="form-control" onChange={this.roleChanged} disabled={this.state.disabled}>
                                        {this.state.roles.map(d => {
                                            return this.renderRoleSelect(d);
                                        })}
                                        <option value="Inget av alternativen passar">Inget av alternativen passar</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <button id="saveContact" className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.editProspectContact()} disabled={this.state.disabled}>Spara</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default EditProspectContactModal;