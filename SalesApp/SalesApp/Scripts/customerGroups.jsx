import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsFillTrashFill } from 'react-icons/bs';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { getCustomerGroups, saveCustomerGroup, getCustomersSearch } from "./requestHandler";

export class CustomerGroups extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companyId: $('#companyId').val(),
            customer: null,
            customers: [],
            selectedCustomers: [],
            customerGroups: [],
            color: $('#color').val(),
            disabled: true,
            removeCustomerGroupId: null,
            removeCustomerId: null
        }


        $.when(getCustomerGroups(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                customerGroups: data
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
                    disabled: false,
                    customers: data
                })
            }
            else {
                $("#spinner").hide();
                alert("Ditt sökord fick inga matchningar.")
            }
        }.bind(this));
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

        $("#selectedCustomer").val("");

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

        $("#removeBoxCustomer").hide();

        this.setState({
            selectedCustomers: selectedCustomers,
            customers: customers
        });
    }

    saveCustomerGroup() {
        var name = $('#customerGroupName').val();
        if (name == "" || name == undefined || this.state.selectedCustomers.length == 0) {
            alert('Namn måste fyllas i och minst en kund måste väljas.');
        }
        else {
            $.when(saveCustomerGroup(name, this.state.selectedCustomers, this.state.companyId)).then(function successHandler(response) {
                if (response) {
                    
                    $("#valueSuccessGroup").show();
                    window.scrollTo(0, 0);

                    setTimeout(function () {
                        $("#valueSuccessGroup").hide();
                    }, 5000);
                    $("#customerGroupName").val("");

                    $.when(getCustomerGroups(this.state.companyId)).then(function successHandler(data) {
                        this.setState({
                            customerGroups: data,
                            selectedCustomers: []
                        })
                    }.bind(this));

                } else {
                    alert('Kundgruppen kunde inte sparas.');
                }
            }.bind(this));
        }
    }

    async removeCustomerGroup() {
        var id = this.state.removeCustomerGroupId;
            await fetch(`/customerGroups/removeCustomerGroup/?customerGroupId=${id}`).then(function successHandler(status) {
                if (status) {
                    $("#removeBoxCustomerGroup").hide();
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
                    $("#removeBoxCustomerGroup").hide();
                }
            }.bind(this));
    }

    renderCustomerGroup(group) {
        return (
            <tr key={group.id} className="tableRow" style={{ borderBottom: "1px solid black" }}>
                <td>{group.name}</td>
                <td style={{ width: "50%" }}></td>
                <td style={{ width: "20%" }}>
                    <Link to={"/CustomerGroups/EditCustomerGroups/" + group.id}><Button style={{ fontSize: "9px", backgroundColor: this.state.color, color: "white" }} variant="secondary">Redigera</Button></Link>
                </td>
                <td>
                    <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px" }} onClick={() => this.showRemove(group.id)} />
                </td>
            </tr>
        )
    }

    cancelRemove() {
        $("#removeBox").hide();
        this.setState({
            removeCustomerGroupId: null
        })
    }

    showRemove(id) {
        $("#removeBoxCustomerGroup").show();
        this.setState({
            removeCustomerGroupId: id
        })
    }

    cancelRemoveCustomer() {
        $("#removeBoxCustomer").hide();
        this.setState({
            removeCustomerId: null
        })
    }

    showRemoveCustomer(id) {
        $("#removeBoxCustomer").show();
        this.setState({
            removeCustomerId: id
        })
    }

    renderSelectedCustomer(customer) {
        return (
            <tr key={customer.name} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{customer.name}</td>
                <td style={{ paddingTop: "18px" }}>{customer.id}</td>
                <td style={{ width: "20%", paddingTop: "17px" }}>
                    <BsFillTrashFill style={{ color: "red" }} onClick={() => this.showRemoveCustomer(customer.id)} />
                </td>
            </tr>
        );
    }

    render() {
        const customerList = this.state.customers.map((customer, i) => {
            return <option key={i} value={customer.name + "---" + customer.id}></option>
        });

        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px", paddingTop: "0" }}>
                <hr style={{ borderTop: "2px solid black" }} />
                <div id="removeBoxCustomerGroup" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                    <h4>Vill du ta bort kundgruppen?</h4>
                    <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeCustomerGroup()}>Ta bort</button>
                    <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                </div>
                <div id="valueSuccessGroup" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                    <h4>Kundgruppen har skapats</h4>
                </div>
                <div id="removeBoxCustomer" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                    <h4>Vill du ta bort kunden från listan?</h4>
                    <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeCustomer()}>Ta bort</button>
                    <button className="btn btn-warning" onClick={() => this.cancelRemoveCustomer()}>Avbryt</button>
                </div>
                <Tabs>
                    <TabList style={{ textTransform: "uppercase" }}>
                        <Tab>Hantera</Tab>
                        <Tab>Skapa ny</Tab>
                    </TabList>
                    <TabPanel>
                        <Table style={{fontSize: "15px"}}>
                            <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                                <tr>
                                    <th>Namn</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: "white" }}>
                                {this.state.customerGroups.map(d => {
                                    return this.renderCustomerGroup(d);
                                })}
                            </tbody>
                        </Table>
                    </TabPanel>
                    <TabPanel>
                        <div className="row col-sm-12" style={{margin: "0"}}>
                            <div className="col-sm-12 col-md-6">
                                <label>Välj namn</label>
                                <input id="customerGroupName" className="form-control" style={{textTransform: "uppercase"}} /> 
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
                                    <button id="addCustomerButton" className="btn btn-primary" style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }} onClick={() => this.addCustomer()} disabled={this.state.disabled}>Välj</button>
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
                            <button id="saveCustomerGroupButton" className="btn btn-primary" onClick={() => this.saveCustomerGroup()} style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }}>Spara kundgrupp</button>
                        </div>
                    </TabPanel>
                </Tabs>

            </div>
        );
    }
}

export default CustomerGroups;