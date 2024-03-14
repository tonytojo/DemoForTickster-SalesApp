import "core-js/stable";
import "regenerator-runtime/runtime";
import { BsFillTrashFill } from 'react-icons/bs';

import React from "react";
import Table from 'react-bootstrap/Table';
import { BsInfoCircleFill } from 'react-icons/bs';
import ReactTooltip from "react-tooltip";
import {
    searchAllCustomers, saveCustomerContact, getRoles, getCustomerContacts, removeContact, getResponsiblesCustomersAndGroups, getCustomersSearchForValue
} from './requestHandler'
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export class CustomerContacts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companyId: $('#companyId').val(),
            roles: [],
            selectedCustomer: null,
            customers: [],
            customerContacts: [],
            color: $('#color').val(),
            cookie1: $.cookie("search_1"),
            cookie2: $.cookie("search_2"),
            cookie3: $.cookie("search_3"),
            customer: null,
            contactToRemove: null
        }

        $.when(getRoles(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                roles: data
            })
        }.bind(this));

        $.when(getResponsiblesCustomersAndGroups(this.state.companyId, $('#loggedInName').val())).then(function successHandler(data) { // Do initial default search and get the customers belonging to the salesman
            if (data != undefined) {
                this.setState({
                    customers: data,
                    selectedCustomer: null
                })
            }
            else {

            }
        }.bind(this));
    }

    renderRoleSelect(role) {
        return (
            <option value={role.role}>{role.role}</option>
        )
    }

    saveContact() {
        $.when(saveCustomerContact(this.state.selectedCustomer.id, this.state.companyId)).then(function successHandler(status) {
            if (status) {
                $("#spinner").hide();

                $("#contactFirstName").val("");
                $("#contactLastName").val("");
                $("#contactTelephone").val("");
                $("#contactEmail").val("");
                $("#valueSuccessContact").show();
                window.scrollTo(0, 0);

                $.when(getCustomerContacts(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(data) {
                    this.setState({
                        customerContacts: data
                    })
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

    removeContact() {
        $.when(removeContact(this.state.companyId, this.state.selectedCustomer.id, this.state.contactToRemove)).then(function successHandler(status) {
            if (status) {
                $("#removeBoxContact").hide();
                $.when(getCustomerContacts(this.state.companyId, this.state.selectedCustomer.id)).then(function successHandler(data) {
                    this.setState({
                        customerContacts: data
                    })
                }.bind(this));
            }
            else {
                alert("Borttagningen misslyckades");
                $("#removeBoxContact").hide();
            }
        }.bind(this));
    }

    openRemoveContact(id) {
        $("#removeBoxContact").show();
        this.setState({
            contactToRemove: id
        });
    }

    cancelRemoveContact() {
        $("#removeBoxContact").hide();
        this.setState({
            contactToRemove: null
        });
    }

    renderCustomerContact(contact) {
        return (
            <tr style={{ borderBottom: "1px solid #dee2e6" }} key={contact.name}>
                <td> {contact.firstName} {contact.lastName} </td>
                <td> ({contact.role}) </td>
                <td> {contact.telephone} </td>
                <td> {contact.email} </td>
                <td>
                    <Link to={"/EditCustomerContact/" + contact.customerId + "/" + contact.id }><Button style={{ fontSize: "9px", backgroundColor: this.state.color, color: "white" }} variant="secondary">Redigera</Button></Link>
                </td>
                <td>
                    <BsFillTrashFill style={{ cursor: "pointer", color: "red", marginLeft: "10px", fontSize: "33px" }} onClick={() => this.openRemoveContact(contact.id)} />
                </td>
                {contact.createdBy != null &&
                    <td>
                        <BsInfoCircleFill data-tip={"Skapad av " + contact.createdBy} data-for="contactTip" style={{ fontSize: "14px", marginLeft: "5px", height: "17px", marginBottom: "3px", marginTop: "8px" }} />
                        <ReactTooltip id="contactTip" place="top" effect="solid" />
                    </td>
                }
                {contact.createdBy == null &&
                    <td>

                    </td>
                }
            </tr>
        )
    }

    searchCustomers() {
        $("#spinner").show();
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        $.when(getCustomersSearchForValue(this.state.companyId, customer, true)).then(function successHandler(data) {
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

    clickSearch(searchWord) {
        $.when(getCustomersSearchForValue(this.state.companyId, searchWord, true)).then(function successHandler(data) {
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

    clearSelectedCustomer() {
        this.setState({
            selectedCustomer: null
        });
    }

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                {this.state.selectedCustomer != null ?
                    (
                        <div className="col-sm-12">
                            <div id="addContact" className="row col-sm-12" style={{ textAlign: "center" }}>
                                <div className="col-sm-12">
                                    <h4> KUNDKONTAKTER - {this.state.selectedCustomer.name}
                                        <span style={{cursor: "pointer"}} onClick={() => this.clearSelectedCustomer()}>
                                            <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                                        </span>
                                    </h4>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="col-sm-12">
                                        <label> Förnamn </label>
                                        <input id="contactFirstName" className="form-control" />
                                    </div>
                                    <div className="col-sm-12">
                                        <label> Efternamn </label>
                                        <input id="contactLastName" className="form-control" />
                                    </div>
                                    <div className="col-sm-12">
                                        <label> Email(valfritt) </label>
                                        <input id="contactEmail" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="col-sm-12">
                                        <label> Telefon(valfritt) </label>
                                        <input id="contactTelephone" className="form-control" />
                                    </div>
                                    <div className="col-sm-12">
                                        <label> Roll </label>
                                        <select id="contactRole" className="form-control">
                                            {this.state.roles.map(d => {
                                                return this.renderRoleSelect(d);
                                            })}
                                            <option value="Inget av alternativen passar">Inget av alternativen passar</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <button id="saveContact" className="btn btn-primary form-control" style={{ marginTop: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.saveContact()}>Spara</button>
                                </div>
                            </div>
                            <div id="removeBoxContact" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                                <h4>Vill du ta bort kontakten?</h4>
                                <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeContact()}>Ta bort</button>
                                <button className="btn btn-warning" onClick={() => this.cancelRemoveContact()}>Avbryt</button>
                            </div>
                            <div className="col-sm-12" style={{ overflowY: "scroll" }}>
                                <h4> Sparade </h4>
                                <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                    <tbody>
                                        {this.state.customerContacts.map(d => {
                                            return this.renderCustomerContact(d);
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <React.Fragment>
                            <div className="col-sm-12" style={{ display: "block", marginBottom: "15px", textAlign: "center" }}>
                                <h4>
                                    Sök kund
                                    <BsInfoCircleFill data-tip="Sök på kund för att lägga till kontakter" data-for="customerTip" style={{ marginLeft: "5px", height: "17px" }} />
                                    <ReactTooltip id="customerTip" place="top" effect="solid" />
                                </h4>
                                <div className="col-sm-12" style={{ display: "flex" }}>
                                    <input id="selectedCustomer" className="form-control" />
                                    <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.searchCustomers()}>Sök</button>
                                </div>
                                <div className="col-sm-12" style={{ fontSize: "14px", textAlign: "center", display: "inline-grid" }}>
                                    <span style={{ fontWeight: "bold", paddingTop: "4px" }}>Sökhistorik: <BsFillTrashFill style={{ color: "red", cursor: "pointer" }} onClick={() => this.clearAllCookies()} /></span>
                                    <span onClick={() => this.clickSearch(this.state.cookie1)} className="clickableSearch" style={{ fontWeight: "400", cursor: "pointer" }}>{this.state.cookie1} </span>
                                    <span onClick={() => this.clickSearch(this.state.cookie2)} className="clickableSearch" style={{ fontWeight: "400", cursor: "pointer" }}>{this.state.cookie2} </span>
                                    <span onClick={() => this.clickSearch(this.state.cookie3)} className="clickableSearch" style={{ fontWeight: "400", cursor: "pointer" }}>{this.state.cookie3}</span>
                                </div>
                            </div>
                            <div className="col-sm-12" style={{ overflow: "scroll" }}>
                                <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                        <tr>
                                            <th>Namn</th>
                                            <th>Kundnummer</th>
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
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}
