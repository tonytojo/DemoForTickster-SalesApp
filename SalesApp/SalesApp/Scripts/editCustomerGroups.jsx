import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { BsFillTrashFill } from 'react-icons/bs';
import Table from 'react-bootstrap/Table';
import { getCustomers, getConnectedCustomers, getName, getCustomersSearch, editCustomerGroup} from "./requestHandler";
import { Link } from 'react-router-dom';

export class EditCustomerGroups extends React.Component {
    constructor(props) {
        super(props);
        var customerGroupId = this.getCustomerGroupId();

        this.state = {
            companyId: $('#companyId').val(),
            customer: null,
            customers: [],
            selectedCustomers: [],
            name: [],
            customerGroupId: customerGroupId,
            color: $('#color').val(),
            removeCustomerId: null
        }
        $.when(getConnectedCustomers(customerGroupId)).then(function successHandler(data) {
            this.setState({
                selectedCustomers: data
            })
        }.bind(this));

        $.when(getName(customerGroupId)).then(function successHandler(data) {
            this.setState({
                name: data
            })
        }.bind(this));
    }

    componentDidUpdate() {

    }

    onCustomerChange() {
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

        $.when(getCustomersSearch(this.state.companyId, customer)).then(function successHandler(data) {
            if (data.length > 0) {
                $("#spinner").hide();
                this.setState({
                    customers: data
                })
            }
            else {
                $("#spinner").hide();
                alert("Ditt sökord fick inga matchningar.")
            }
        }.bind(this));
    }

    getCustomerGroupId() {
        var url = window.location.href;
        var str = url.substring(url.indexOf("CustomerGroups/EditCustomerGroups/"));

        return decodeURI(str.replace('CustomerGroups/EditCustomerGroups/', ''));
    }

    addCustomer() {
        var cust = $("#selectedCustomer").val();
        const array = cust.split("---");
        var name = array[0];
        var id = array[1];

        var customer = this.state.customers.filter(obj => {
            return obj.id === id
        });

        var selectedCustomers = this.state.selectedCustomers;
        selectedCustomers.push(customer[0]);

        var customers = this.state.customers;
        const i = customers.indexOf(customer[0]);
        customers.splice(i, 1);

        this.setState({
            selectedCustomers: selectedCustomers,
            customers: customers
        });
    }

    removeCustomer() {
        var id = this.state.removeCustomerId;
        var customer = this.state.selectedCustomers.filter(obj => {
            return obj.id === id
        });

        var customers = this.state.customers;
        customers.push(customer[0]);

        var selectedCustomers = this.state.selectedCustomers;
        const i = selectedCustomers.indexOf(customer[0]);
        selectedCustomers.splice(i, 1);

        $("#removeBox").hide();

        this.setState({
            selectedCustomers: selectedCustomers,
            customers: customers,
            removeCustomerId: null
        });
    }

    editCustomerGroup() {
        var name = $('#customerGroupName').val();
        if (name == "" || name == undefined || this.state.selectedCustomers.length == 0) {
            alert('Namn måste fyllas i och minst en kund måste väljas.');
        }
        else {
            $.when(editCustomerGroup(name, this.state.selectedCustomers, this.state.customerGroupId)).then(function successHandler(response) {
                if (response) {
                    $("#valueSuccess").show();
                    window.scrollTo(0, 0);

                    setTimeout(function () {
                        $("#valueSuccess").hide();
                    }, 5000);

                } else {
                    alert('Kundgruppen kunde inte sparas.');
                }
            }.bind(this));
        }
    }

    async removeCustomerGroup(id) {
        await fetch(`/customerGroups/removeCustomerGroup/?customerGroupId=${id}`).then(function successHandler(status) {
            if (status) {
                alert("Kundgruppen har tagits bort.")

                $.when(getCustomerGroups(this.state.companyId)).then(function successHandler(data) {
                    this.setState({
                        customerGroups: data
                    })
                }.bind(this));

                $.when(getCustomers(this.state.companyId)).then(function successHandler(data) {
                    this.setState({
                        customers: data
                    })
                }.bind(this));
            }
            else {
                alert("Borttagningen misslyckades");
            }
        }.bind(this));
    }

    onChange(e) {
        const name = e.value;
        this.setState({ name: name })
    }

    renderSelectedCustomer(customer) {
        return (
            <tr key={customer.name} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{customer.name}</td>
                <td style={{ paddingTop: "18px" }}>{customer.id}</td>
                <td style={{ width: "20%", paddingTop: "17px" }}>
                    <BsFillTrashFill style={{ color: "red" }} onClick={() => this.showRemove(customer.id)} />
                </td>
            </tr>
        );
    }

    cancelRemove() {
        $("#removeBox").hide();
        this.setState({
            removeCustomerId: null
        })
    }

    showRemove(id) {
        $("#removeBox").show();
        this.setState({
            removeCustomerId: id
        })
    }

    render() {
        const customerList = this.state.customers.map((customer, i) => {
            return <option key={i} value={customer.name + "---" + customer.id}></option>
        });

        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12 head" style={{ textAlign: "center" }}>
                    <div className="col-sm-12" style={{ display: "grid" }}>
                        <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Redigera kundgrupp
                            <Link to="/Admin">
                                <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                            </Link>
                        </h2>
                    </div>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <div id="removeBox" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                    <h4>Vill du ta bort kunden från kundgruppen?</h4>
                    <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeCustomer()}>Ta bort</button>
                    <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                </div>
                <div id="valueSuccess" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Kundgruppen har redigera</h4>
                </div>
                <div className="row col-sm-12" style={{ margin: "0" }}>
                    <div className="col-sm-12 col-md-6">
                        <label>Välj namn</label>
                        <input id="customerGroupName" className="form-control" value={this.state.name} onChange={this.onChange.bind(this)} style={{ textTransform: "uppercase" }} />
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <label>Sök kund</label>
                        <div className="col-sm-12" style={{ display: "flex", padding: "0" }}>
                            <input id="selectedCustomer" className="form-control" list="customer" onChange={() => this.onCustomerChange()} />
                            <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.searchCustomers()}>Sök</button>
                        </div>
                        <div className="col-sm-12" style={{ display: "block" }}>
                            <datalist id="customer">
                                {customerList}
                            </datalist>
                            <button className="btn btn-primary" style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }} onClick={() => this.addCustomer()}>Välj</button>
                            <label> Valda kunder </label>
                            <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                <tbody>
                                    {this.state.selectedCustomers.map(d => {
                                        return this.renderSelectedCustomer(d);
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.editCustomerGroup()} style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white"  }}>Spara kundgrupp</button>
                </div>
            </div>
        );
    }
}

export default EditCustomerGroups;