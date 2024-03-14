import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getCustomersSearch } from "./requestHandler";
import Table from 'react-bootstrap/Table';
import {
    getAllDealsForUser, moveDeal, getCustomerContacts, saveDeal, deleteDeal
} from './requestHandler';
import { BsFillTrashFill } from 'react-icons/bs';

const columnsFromBackend = {
    [1]: {
        name: "Leads",
        items: []
    },
    [2]: {
        name: "Skickade förslag",
        items: []
    },
    [3]: {
        name: "Under förhandling",
        items: []
    },
    [4]: {
        name: "Vunna",
        items: []
    },
    [5]: {
        name: "Förlorade",
        items: []
    },
    [6]: {
        name: "Uppskjutna",
        items: []
    }
};

var component;
export class Kanban extends React.Component {
    constructor(props) {
        super(props);
        component = this;
        this.state = {
            companyId: $('#companyId').val(),
            customer: null,
            customers: [],
            selectedCustomers: [],
            color: $('#color').val(),
            disabled: true,
            disabledSearchButton: false,
            columns: columnsFromBackend,
            show: false,
            showEdit: false,
            customerContacts: [],
            selectedCustomerId: null,
            selectedCustomerName: null,
            title: null,
            description: null,
            selectedCustomerEdit: null,
            customerContactEdit: null,
            deleteId: null
        }

        console.log(columnsFromBackend);

        $.when(getAllDealsForUser()).then(function successHandler(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].laneId == 1) {
                    columnsFromBackend[1].items.push(data[i]);
                }
                if (data[i].laneId == 2) {
                    columnsFromBackend[2].items.push(data[i]);
                }
                if (data[i].laneId == 3) {
                    columnsFromBackend[3].items.push(data[i]);
                }
                if (data[i].laneId == 4) {
                    columnsFromBackend[4].items.push(data[i]);
                }
                if (data[i].laneId == 5) {
                    columnsFromBackend[5].items.push(data[i]);
                }
                if (data[i].laneId == 6) {
                    columnsFromBackend[6].items.push(data[i]);
                }
            }
            this.setState({
                columns: columnsFromBackend
            })
        }.bind(this));
    }

    handleClose() {
        component.setState({
            show: false
        })
    }

    handleShow() {
        component.setState({
            show: true
        })
    }

    handleCloseEdit() {
        component.setState({
            title: "",
            description: "",
            selectedCustomerEdit: "",
            customerContactEdit: "",
            showEdit: false
        })
    }

    handleShowEdit(deal) {
        component.setState({
            title: deal.title,
            description: deal.description,
            selectedCustomerEdit: deal.customerName,
            customerContactEdit: deal.contactName,
            deleteId: deal.dealId,
            showEdit: true
        })

        component.selectElement('prioEdit', deal.priority);
    //    component.selectElement('contactEdit', deal.contactName);
    }

    selectElement(id, valueToSelect) {
        let element = document.getElementById(id);
        element.value = valueToSelect;
    }

    onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            $.when(moveDeal(removed.dealId, destination.droppableId)).then(function successHandler(data) {
                if (data) {
                }
                else {
                    alert("Något gick fel. Kontakta din organisations administratör.")
                }
            }.bind(this));

            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    setColumns(columns) {
        component.setState({
            columns: columns
        })
    }

    onCustomerChange() {
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        component.setState({
            customer: customer
        });
    }

    searchCustomers() {
        $("#spinner").show();
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        $.when(getCustomersSearch(component.state.companyId, customer)).then(function successHandler(data) {
            if (data.length > 0) {
                $("#spinner").hide();

                component.setState({
                    disabled: false,
                    customers: data
                })
            }
            else {
                $("#spinner").hide();
                alert("Ditt sökord fick inga matchningar.")
            }
        }.bind(component));
    }

    addCustomer() {
        var cust = $("#selectedCustomer").val();
        const array = cust.split("---");
        var name = array[0];
        var id = array[1];

        var customer = component.state.customers.filter(obj => {
            return obj.id === id
        });

        var selectedCustomers = component.state.selectedCustomers;
        selectedCustomers.push(customer[0]);

        var customers = component.state.customers;
        const i = customers.indexOf(customer[0]);
        customers.splice(i, 1);

        $("#selectedCustomer").val("");

        $.when(getCustomerContacts(this.state.companyId, id)).then(function successHandler(data) {
            this.setState({
                customerContacts: data,
                selectedCustomerId: id,
                selectedCustomerName: name,
                customers: customers,
                disabled: true,
                disabledSearchButton: true
            })
        }.bind(this));
    }

    renderSelectedCustomer(customer) {
        return (
            <tr key={customer.name} className="tableRow" style={{ borderLeft: "7px solid " + color }}>
                <td style={{ paddingTop: "18px" }}>{customer.name}</td>
                <td style={{ paddingTop: "18px" }}>{customer.id}</td>
                <td style={{ width: "20%", paddingTop: "17px" }}>
                    <BsFillTrashFill style={{ color: "red" }} onClick={() => component.removeCustomer(customer.id)} />
                </td>
            </tr>
        );
    }

    removeCustomer(id) {
        var customer = this.state.selectedCustomers.filter(obj => {
            return obj.id === id
        });

        var customers = this.state.customers;
        customers.push(customer[0]);

        var selectedCustomers = this.state.selectedCustomers;
        const i = selectedCustomers.indexOf(customer[0]);
        selectedCustomers.splice(i, 1);

        component.setState({
            selectedCustomer: selectedCustomer,
            customers: customers,
            disabled: true,
            disabledSearchButton: false,
            customerContacts: []
        });
    }

    renderCustomerContactSelect(contact) {
        return (
            <option key={contact.name + "-" + contact.role} value={contact.name}>{contact.name + "-" + contact.role}</option>
        )
    }

    saveDeal() {
        $.when(saveDeal(component.state.companyId, component.state.selectedCustomerId, component.state.selectedCustomerName)).then(function successHandler(data) {
            if (data) {
                columnsFromBackend[1].items = [];
                columnsFromBackend[2].items = [];
                columnsFromBackend[3].items = [];
                columnsFromBackend[4].items = [];
                columnsFromBackend[5].items = [];
                columnsFromBackend[6].items = [];

                $.when(getAllDealsForUser()).then(function successHandler(data) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].laneId == 1) {
                            columnsFromBackend[1].items.push(data[i]);
                        }
                        if (data[i].laneId == 2) {
                            columnsFromBackend[2].items.push(data[i]);
                        }
                        if (data[i].laneId == 3) {
                            columnsFromBackend[3].items.push(data[i]);
                        }
                        if (data[i].laneId == 4) {
                            columnsFromBackend[4].items.push(data[i]);
                        }
                        if (data[i].laneId == 5) {
                            columnsFromBackend[5].items.push(data[i]);
                        }
                        if (data[i].laneId == 6) {
                            columnsFromBackend[6].items.push(data[i]);
                        }
                    }
                    component.setState({
                        columns: columnsFromBackend,
                        disabledSearchButton: false,
                        show: false
                    })
                }.bind(this));

            }
            else {
                alert("Kunde inte spara aktiviteten.")
            }
        }.bind(this));
    }

    deleteDeal(dealId) {
        $.when(deleteDeal(dealId)).then(function successHandler(data) {
            if (data) {
                columnsFromBackend[1].items = [];
                columnsFromBackend[2].items = [];
                columnsFromBackend[3].items = [];
                columnsFromBackend[4].items = [];
                columnsFromBackend[5].items = [];
                columnsFromBackend[6].items = [];

                $.when(getAllDealsForUser()).then(function successHandler(data) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].laneId == 1) {
                            columnsFromBackend[1].items.push(data[i]);
                        }
                        if (data[i].laneId == 2) {
                            columnsFromBackend[2].items.push(data[i]);
                        }
                        if (data[i].laneId == 3) {
                            columnsFromBackend[3].items.push(data[i]);
                        }
                        if (data[i].laneId == 4) {
                            columnsFromBackend[4].items.push(data[i]);
                        }
                        if (data[i].laneId == 5) {
                            columnsFromBackend[5].items.push(data[i]);
                        }
                        if (data[i].laneId == 6) {
                            columnsFromBackend[6].items.push(data[i]);
                        }
                    }
                    component.setState({
                        columns: columnsFromBackend,
                        disabledSearchButton: false,
                        showEdit: false
                    })
                }.bind(this));

            }
            else {
                alert("Kunde inte ta bort aktiviteten.")
            }
        }.bind(this));
    }

    render() {

        const customerList = this.state.customers.map((customer, i) => {
            return <option key={i} value={customer.name + "---" + customer.id}></option>
        });

        return (
            <div>
                <div style={{ height: "30px", paddingLeft: "4%", display: "flex", width: "100%" }} >
                    <span onClick={component.handleShow}><i className="fa-solid fa-plus" style={{ color: $('#color').val(), fontSize: "30px", float: "left" }}></i></span>
                </div>
                <div className="col-sm-12">
                    <Modal style={{ width: "90vw", maxWidth: "none !important", textAlign: "center" }} show={component.state.show} onHide={component.handleClose}>
                        <Modal.Header style={{ backgroundColor: $('#color').val(), textAlign: "center" }} closeButton>
                            <Modal.Title style={{ color: "white", width: "100%" }}>Skapa aktivitet</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="col-sm-12">
                                <label>Rubrik</label>
                                <input id="title" className="form-control" />
                            </div>
                            <div className="col-sm-12">
                                <label>Beskrivning</label>
                                <textarea id="description" className="form-control" />
                            </div>
                            <div className="col-sm-12">
                                <label>Prio</label>
                                <select id="prio" className="form-control">
                                    <option value="1">Hög</option>
                                    <option value="2">Medel</option>
                                    <option value="3">Låg</option>
                                </select>
                            </div>
                            <div className="col-sm-12">
                                <label>Sök kund</label>
                                <div className="col-sm-12" style={{ display: "flex", padding: "0" }}>
                                    <input id="selectedCustomer" className="form-control" list="customer" onChange={() => component.onCustomerChange()} />
                                    <button id="searchButton" className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: $('#color').val(), color: "white" }} onClick={() => component.searchCustomers()} disabled={component.state.disabledSearchButton}>Sök</button>
                                </div>
                                <div className="col-sm-12" style={{ display: "block" }}>
                                    <datalist id="customer">
                                        {customerList}
                                    </datalist>
                                    <button id="addCustomerButton" className="btn btn-primary" style={{ marginTop: "10px", width: "100%", backgroundColor: $('#color').val(), color: "white" }} onClick={() => component.addCustomer()} disabled={component.state.disabled}>Välj</button>
                                    <Table style={{ textAlign: "left", fontSize: "15px" }}>
                                        <tbody>
                                            {component.state.selectedCustomers.map(d => {
                                                return component.renderSelectedCustomer(d);
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <label> Kontakt </label>
                                <select id="contact" className="form-control">
                                    {this.state.customerContacts.map(d => {
                                        return this.renderCustomerContactSelect(d);
                                    })}
                                </select>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={component.handleClose}>
                                Stäng
                            </Button>
                            <Button variant="primary" style={{ backgroundColor: $('#color').val() }} onClick={component.saveDeal}>
                                Spara aktivitet
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div id="kanban">
                    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                        <DragDropContext
                            onDragEnd={result => component.onDragEnd(result, component.state.columns, component.setColumns)}
                        >
                            {Object.entries(this.state.columns).map(([columnId, column], index) => {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: "15%",
                                            margin: "4px"
                                        }}
                                        key={columnId}
                                    >
                                        <h5>{column.name}</h5>
                                        <div style={{margin: 4, width: "100%" }}>
                                            <Droppable droppableId={columnId} key={columnId}>
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                                background: snapshot.isDraggingOver
                                                                    ? "lightblue"
                                                                    : "lightgrey",
                                                                padding: 4,
                                                                width: "100%",
                                                                minHeight: 500
                                                            }}
                                                        >
                                                            {column.items.map((item, index) => {
                                                                return (
                                                                    <Draggable
                                                                        key={item.dealId}
                                                                        draggableId={item.dealId}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => {
                                                                            return (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    style={{
                                                                                        userSelect: "none",
                                                                                        padding: 16,
                                                                                        margin: "0 0 8px 0",
                                                                                        minHeight: "50px",
                                                                                        backgroundColor: snapshot.isDragging
                                                                                            ? "#263B4A"
                                                                                            : $('#color').val(),
                                                                                        color: "white",
                                                                                        ...provided.draggableProps.style
                                                                                    }}
                                                                                    onClick={() => { component.handleShowEdit(item) }}
                                                                                >
                                                                                    {item.title}
                                                                                </div>
                                                                            );
                                                                        }}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </div>
                                                    );
                                                }}
                                            </Droppable>
                                        </div>
                                    </div>
                                );
                            })}
                        </DragDropContext>
                    </div>
                    <Modal style={{ width: "90vw", maxWidth: "none !important", textAlign: "center" }} show={component.state.showEdit} onHide={component.handleCloseEdit}>
                        <Modal.Header style={{ backgroundColor: $('#color').val(), textAlign: "center" }} closeButton>
                            <Modal.Title style={{ color: "white", width: "100%"  }}>Redigera aktivitet</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="col-sm-12">
                                <label>Rubrik</label>
                                <input id="titleEdit" className="form-control" value={component.state.title} disabled />
                            </div>
                            <div className="col-sm-12">
                                <label>Beskrivning</label>
                                <textarea id="descriptionEdit" className="form-control" value={component.state.description} disabled />
                            </div>
                            <div className="col-sm-12">
                                <label>Prio</label>
                                <select id="prioEdit" className="form-control" disabled>
                                    <option value="1">Hög</option>
                                    <option value="2">Medel</option>
                                    <option value="3">Låg</option>
                                </select>
                            </div>
                            <div className="col-sm-12">
                                <label>Sök kund</label>
                                <div className="col-sm-12" style={{ display: "flex", padding: "0" }}>
                                    <input id="selectedCustomerEdit" className="form-control" list="customer" onChange={() => component.onCustomerChange()} value={component.state.selectedCustomerEdit} disabled />
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <label> Kontakt </label>
                                {/*<select id="contactEdit" className="form-control">*/}
                                {/*    {this.state.customerContacts.map(d => {*/}
                                {/*        return this.renderCustomerContactSelect(d);*/}
                                {/*    })}*/}
                                {/*</select>*/}
                                <input id="contactEdit" className="form-control" value={component.state.customerContactEdit} disabled />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={component.handleClose}>
                                Stäng
                            </Button>
                            <Button variant="danger" onClick={() => { component.deleteDeal(component.state.deleteId) }}>
                                Ta bort
                            </Button>
                            <Button variant="primary" style={{ backgroundColor: $('#color').val() }} onClick={component.saveDeal}>
                                Spara aktivitet
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Kanban;
