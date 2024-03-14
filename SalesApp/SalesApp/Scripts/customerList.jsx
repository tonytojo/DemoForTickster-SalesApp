import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { BsFillTrashFill } from 'react-icons/bs';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { getValuedCustomers, removeValuedCustomer} from "./requestHandler";
import { default as ReactSelect } from "react-select";

export const classOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
];
var component;
export class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        component = this;

        this.state = {
            companyId: $('#companyId').val(),
            customers: [],
            color: $('#color').val(),
            removeCustomerId: null,
            originalCustomers: [],
            classesSelected: null,
            sortBy: 'classification',         // Column to sort by (null for no sorting)
            sortDirection: 1    // Sort direction: 1 for ascending, -1 for descending
        }

        $.when(getValuedCustomers(this.state.companyId)).then(function successHandler(data) {
            this.setState({
                customers: data,
                originalCustomers: data
            })
        }.bind(this));
    }

    componentDidUpdate() {

    }

    async removeValuedCustomer() {
        var id = this.state.removeCustomerId;
        $.when(removeValuedCustomer(this.state.companyId, id)).then(function successHandler(data) {
            if (data) {
                $.when(getValuedCustomers(this.state.companyId)).then(function successHandler(data) {
                    $("#removeBoxValued").hide();
                    this.setState({
                        customers: data
                    })
                }.bind(this));
            }
            else {
                $("#removeBoxValued").hide();
                alert("Kunde inte radera kunden. Kontakta administratör om problemet kvarstår.")
            }
        }.bind(this));
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
                <td>{customer.name}</td>
                <td className="hideMobile">{customer.type}</td>
                <td style={{ fontSize: "22px", color: color }} className="hideMobile">{customer.classification}</td>
                <td style={{ width: "20%" }}>
                    <Link to={"/Customer/EditValuedCustomer/" + customer.id}><Button style={{ fontSize: "9px", backgroundColor: this.state.color, color: "white" }} variant="secondary">Redigera</Button></Link>
                </td>
                <td>
                    <BsFillTrashFill title="Ta bort" style={{ color: "red", fontSize: "33px", cursor: "pointer" }} onClick={() => this.showRemove(customer.id)} />
                </td>
            </tr>
        )
    }

    cancelRemove() {
        $("#removeBoxValued").hide();
        this.setState({
            removeCustomerId: null
        })
    }

    showRemove(id) {
        $("#removeBoxValued").show();
        this.setState({
            removeCustomerId: id
        })
    }

    filterProjects() {
        var classes = component.state.classesSelected;

        if (classes && classes.length > 0) {
            var customers = component.state.originalCustomers.filter(function (customer) {
                return classes.filter(e => e.value === customer.classification).length > 0
            });

            if ($("#types").val() != "Alla typer") {
                customers = customers.filter(function (customer) {
                    return customer.type == $("#types").val();
                });
            }

            component.setState({
                customers: customers.sort((a, b) => (a.classification > b.classification) ? 1 : -1)
            });
        }
        else {
            if ($("#types").val() != "Alla typer") {
                var customers = component.state.originalCustomers.filter(function (customer) {
                    return customer.type == $("#types").val();
                });

                component.setState({
                    customers: customers.sort((a, b) => (a.classification > b.classification) ? 1 : -1)
                });
            }
            else {
                component.setState({
                    customers: component.state.originalCustomers.sort((a, b) => (a.classification > b.classification) ? 1 : -1)
                });
            }
        }
        
    }

    handleClassesChange = (newList) => {
        this.setState({
            classesSelected: newList
        }, () => {
            this.filterProjects();
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

    sortCustomers = (customers) => {
        const { sortBy, sortDirection } = this.state;
        if (!sortBy) {
            return customers;
        }
        return [...customers].sort((a, b) =>
            a[sortBy].localeCompare(b[sortBy]) * sortDirection
        );
    };

    render() {
        const sortedCustomers = this.sortCustomers(this.state.customers);

        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div id="removeBoxValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlignment: "center", backgroundColor: "white", textAlign: "center", color: "#dc3545", padding: "5px", border: "2px solid #dc3545", borderRadius: "10px" }}>
                    <h4>Vill du ta bort kundvärderingen?</h4>
                    <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={() => this.removeValuedCustomer()}>Ta bort</button>
                    <button className="btn btn-warning" onClick={() => this.cancelRemove()}>Avbryt</button>
                </div>
                <div className="col-sm-12 row" style={{ margin: "0", display: "flex", padding: "5px" }}>
                    {/*<div className="col-sm-12 col-md-4" style={{ textAlign: "center" }}>*/}
                    {/*    <input type="checkbox" id="nameBox" onChange={this.filterProjects} />*/}
                    {/*    <label htmlFor="nameBox">*/}
                    {/*        Sortera*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                    <div className="col-sm-12 col-md-4" style={{ padding: "0"}}>
                        <ReactSelect
                            options={classOptions}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            onChange={this.handleClassesChange}
                            allowSelectAll={true}
                            value={this.state.classesSelected}
                            placeholder="Klassificering"
                            style={{marginTop:"5px"}}
                        />
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <select id="types" className="form-control" style={{ textAlign: "center"}} onChange={this.filterProjects}>
                            <option value="Alla typer">Alla typer</option>
                            <option value="Kundgrupp">Kundgrupp</option>
                            <option value="Kund">Kund</option>
                        </select>
                    </div>
                </div>
                <Table style={{ textAlign: "left", fontSize: "15px"}}>
                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                        <tr>
                            <th onClick={() => this.handleSort('name')} style={{cursor: "pointer"}}>
                                Namn {this.renderSortIcon('name')}
                            </th>
                            <th className="hideMobile">Typ</th>
                            <th className="hideMobile" onClick={() => this.handleSort('classification')} style={{ cursor: "pointer" }}>
                                Klass {this.renderSortIcon('classification')}
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "white" }}>
                        {sortedCustomers.map(d => {
                            return this.renderCustomer(d);
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default CustomerList;