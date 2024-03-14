import React, { useState, useEffect, Fragment } from "react";
import { getCompanyMembers, getNonBudgetCustomers, saveBudget, getSalesmenWithBudgets, getCustomersWithoutFilter, updateBudget, removeBudget } from './requestHandler';
import Table from 'react-bootstrap/Table'; 
import { BsFillPlusCircleFill, BsFillTrashFill } from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';

function Budget() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const [color, setColor] = useState($('#color').val());
    const [members, setMembers] = useState([]);
    const [chosenYear, setChosenYear] = useState(null);
    const [chosenSalesman, setChosenSalesman] = useState(null);
    const [nonBudgetCustomers, setNonBudgetCustomers] = useState([]);
    const [chosenCustomer, setChosenCustomer] = useState(null);
    const [budget, setBudget] = useState(0);
    const [salesmenWithBudgets, setSalesmenWithBudgets] = useState([]);
    const [visibleData, setVisibleData] = useState([]);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [showEditBudget, setShowEditBudget] = useState(false);
    const [editBudget, setEditBudget] = useState(null);
    const [totalBudget, setTotalBudget] = useState(0);

    useEffect(() => {
        $.when(getCompanyMembers()).then(function successHandler(data) {
            setMembers(data);
            $.when(getSalesmenWithBudgets($("#companyId").val(), '2024')).then(function successHandler(data) {
                const totalAnnualBudget = data.reduce((total, item) => {
                    const annualBudgetSum = item.budgets.reduce((sum, budget) => sum + (budget.annualBudget || 0), 0);
                    return total + annualBudgetSum;
                }, 0);
                setTotalBudget(totalAnnualBudget);

                var salesmanId = $("#filteredSalesman").val();
                const filteredArray = data.filter(item => item.id === salesmanId);
                setSalesmenWithBudgets(data);
                setVisibleData(filteredArray);
            }.bind(this));
        }.bind(this));
        $.when(getCustomersWithoutFilter($("#companyId").val())).then(function successHandler(data) {
            setCustomers(data);
        }.bind(this));
    }, []);

    function onYearChange(year){
        if (year != "Välj år") {
            setChosenYear(year);
        }
        else {
            setChosenYear(null);
        }
    }

    function onSalesmanChange(e) {
        if (e.target.value != "Välj säljare") {
            var name = $("#" + e.target.value)[0].text;
            $.when(getNonBudgetCustomers($("#companyId").val(), e.target.value, name ,chosenYear)).then(function successHandler(customers) {
                setChosenSalesman(e.target.value);
                setNonBudgetCustomers(customers);
            }.bind(this));
        }
        else {
            setChosenSalesman(null);
        }
    }

    function onCustomerChange(e) {
        if (e.target.value != "Välj kund") {
            setChosenCustomer(e.target.value)
        }
        else {
            setChosenCustomer(null);
        }
    }

    function renderMember(member) {
        return (
            <option id={member.id} value={member.id}> {member.name} </option>
        );
    }

    function renderCustomer(member) {
        return (
            <option id={member.id} value={member.id}> {member.name}-{member.id} </option>
        );
    }

    function save() {
        var name = $("#" + chosenSalesman)[0].text;

        $.when(saveBudget($("#companyId").val(), chosenSalesman, name, chosenCustomer, chosenYear, budget)).then(function successHandler(response) {
            if (response) {
                $.when(getSalesmenWithBudgets($("#companyId").val(), '2024')).then(function successHandler(data) {
                    const totalAnnualBudget = data.reduce((total, item) => {
                        const annualBudgetSum = item.budgets.reduce((sum, budget) => sum + (budget.annualBudget || 0), 0);
                        return total + annualBudgetSum;
                    }, 0);
                    setTotalBudget(totalAnnualBudget);

                    var salesmanId = $("#filteredSalesman").val();
                    const filteredArray = data.filter(item => item.id === salesmanId);
                    setSalesmenWithBudgets(data);
                    setVisibleData(filteredArray)
                    setChosenYear(null);
                    setChosenSalesman(null);
                    setChosenCustomer(null);
                    setNonBudgetCustomers([]);
                    setBudget(0);
                    setShowAddBudget(false);
                }.bind(this));
            }
            else {
                alert("Budgeten kunde inte sparas");
            }
        }.bind(this));
    }

    function openEdit(item) {
        setShowEditBudget(true);
        setEditBudget(item); 
    }

    function changeBudget() {
        var budgetValue = $("#updatedAnnualBudget").val();
        var newBudget = editBudget; 

        newBudget.annualBudget = budgetValue;

        $.when(updateBudget(newBudget)).then(function successHandler(response) {
            if (response) {
                $.when(getSalesmenWithBudgets($("#companyId").val(), '2024')).then(function successHandler(data) {
                    const totalAnnualBudget = data.reduce((total, item) => {
                        const annualBudgetSum = item.budgets.reduce((sum, budget) => sum + (budget.annualBudget || 0), 0);
                        return total + annualBudgetSum;
                    }, 0);
                    setTotalBudget(totalAnnualBudget);

                    var salesmanId = $("#filteredSalesman").val();
                    const filteredArray = data.filter(item => item.id === salesmanId);
                    setSalesmenWithBudgets(data);
                    setVisibleData(filteredArray);
                    setShowEditBudget(false);
                    setEditBudget(null); 
                }.bind(this));
            }
            else {
                alert("Budgeten kunde inte sparas");
            }
        }.bind(this));
    }

    function remove() {
        $.when(removeBudget(editBudget)).then(function successHandler(response) {
            if (response) {
                $.when(getSalesmenWithBudgets($("#companyId").val(), '2024')).then(function successHandler(data) {
                    const totalAnnualBudget = data.reduce((total, item) => {
                        const annualBudgetSum = item.budgets.reduce((sum, budget) => sum + (budget.annualBudget || 0), 0);
                        return total + annualBudgetSum;
                    }, 0);
                    setTotalBudget(totalAnnualBudget);

                    var salesmanId = $("#filteredSalesman").val();
                    const filteredArray = data.filter(item => item.id === salesmanId);
                    setSalesmenWithBudgets(data);
                    setVisibleData(filteredArray);
                    setShowEditBudget(false);
                    setEditBudget(null);
                }.bind(this));
            }
            else {
                alert("Budgeten kunde inte tas bort");
            }
        }.bind(this));
    }

    function renderSalesmenTable(salesman) {

        const calculateTotal = (budgets, key) => {
            return budgets.reduce((total, b) => total + (b[key] || 0), 0);
        };
        const totalJan = Math.round(calculateTotal(salesman.budgets, 'janBudget'));
        const totalFeb = Math.round(calculateTotal(salesman.budgets, 'febBudget'));
        const totalMars = Math.round(calculateTotal(salesman.budgets, 'marsBudget'));
        const totalApril = Math.round(calculateTotal(salesman.budgets, 'aprilBudget'));
        const totalMay = Math.round(calculateTotal(salesman.budgets, 'mayBudget'));
        const totalJune = Math.round(calculateTotal(salesman.budgets, 'juneBudget'));
        const totalJuly = Math.round(calculateTotal(salesman.budgets, 'julyBudget'));
        const totalAug = Math.round(calculateTotal(salesman.budgets, 'augBudget'));
        const totalSept = Math.round(calculateTotal(salesman.budgets, 'septBudget'));
        const totalOct = Math.round(calculateTotal(salesman.budgets, 'octBudget'));
        const totalNov = Math.round(calculateTotal(salesman.budgets, 'novBudget'));
        const totalDec = Math.round(calculateTotal(salesman.budgets, 'decBudget'));

        return (
            <div style={{ width: "100%", height: "auto" }}>
                <Table style={{ textAlign: "left"}}>
                    <thead style={{ backgroundColor: $("#color").val(), color: "white" }}>
                        <tr>
                            <th style={{ fontWeight: "bold", padding: "0.15rem" }}>År</th>
                            <th style={{ fontWeight: "bold", padding: "0.15rem" }}>Kund</th>
                            <th style={{ padding: "0.15rem"}}>Jan</th>
                            <th style={{ padding: "0.15rem" }}>Feb</th>
                            <th style={{ padding: "0.15rem" }}>Mars</th>
                            <th style={{ padding: "0.15rem" }}>April</th>
                            <th style={{ padding: "0.15rem" }}>May</th>
                            <th style={{ padding: "0.15rem" }}>June</th>
                            <th style={{ padding: "0.15rem" }}>July</th>
                            <th style={{ padding: "0.15rem" }}>Aug</th>
                            <th style={{ padding: "0.15rem" }}>Sept</th>
                            <th style={{ padding: "0.15rem" }}>Oct</th>
                            <th style={{ padding: "0.15rem" }}>Nov</th>
                            <th style={{ padding: "0.15rem" }}>Dec</th>
                            <th style={{ fontWeight: "bold", padding: "0.15rem"  }}>Annual</th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "white" }}>
                        {salesman.budgets.map(b => {
                            return (
                                <tr style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => { openEdit(b) }}>
                                    <td style={{ fontWeight: "bold", border: "1px solid black", color: color, padding: "0.15rem" }}>{b.year}</td>
                                    <td style={{ fontWeight: "bold", border: "1px solid black", color: color, padding: "0.15rem" }}>{customers.find(item => item.id === b.customerId).name}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.janBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.febBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.marsBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.aprilBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.mayBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.juneBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.julyBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.augBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.septBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.octBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.novBudget).toLocaleString()}</td>
                                    <td style={{ border: "1px solid black", padding: "0.15rem" }}>{Math.round(b.decBudget).toLocaleString()}</td>
                                    <td style={{ fontWeight: "bold", border: "1px solid black", color: color, padding: "0.15rem" }}>{Math.round(b.annualBudget).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        <tr style={{ fontSize: "12px", fontWeight: "bold", borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black"}}>
                            <td>Total</td>
                            <td></td>
                            <td>{totalJan.toLocaleString()}</td>
                            <td>{totalFeb.toLocaleString()}</td>
                            <td>{totalMars.toLocaleString()}</td>
                            <td>{totalApril.toLocaleString()}</td>
                            <td>{totalMay.toLocaleString()}</td>
                            <td>{totalJune.toLocaleString()}</td>
                            <td>{totalJuly.toLocaleString()}</td>
                            <td>{totalAug.toLocaleString()}</td>
                            <td>{totalSept.toLocaleString()}</td>
                            <td>{totalOct.toLocaleString()}</td>
                            <td>{totalNov.toLocaleString()}</td>
                            <td>{totalDec.toLocaleString()}</td>
                            <td>{calculateTotal(salesman.budgets, 'annualBudget').toLocaleString()}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    return (
        <div className="col-sm-12" style={{ textAlign: "center" }}>
            <h2> Budget <BsFillPlusCircleFill style={{ color: color, cursor: "pointer" }} onClick={() => { setShowAddBudget(!showAddBudget) }} /> </h2>
            {showAddBudget &&
                <Fragment>
                    <h4>Skapa budget</h4>
                    <div style={{ width: "100%", display: "flex" }}>
                        <div className="col-sm-12 col-md-3">
                            <h4> År </h4>
                            <select className="form-control" onChange={(e) => { onYearChange(e.target.value) }}>
                                <option value="Välj år">Välj år</option>
                                <option value="2024"> 2024 </option>
                                <option value="2025"> 2025 </option>
                                <option value="2026"> 2026 </option>
                                <option value="2027"> 2027 </option>
                            </select>
                        </div>
                        {chosenYear != null &&
                            <Fragment>
                                <div className="col-sm-12 col-md-3">
                                    <h4> Kundansvarig </h4>
                                    <select className="form-control" onChange={(e) => { onSalesmanChange(e) }}>
                                        <option value="Välj säljare">Välj säljare</option>
                                        {members.map(m => {
                                            return renderMember(m);
                                        })}
                                    </select>
                                </div>
                            {chosenSalesman != null &&
                                <Fragment>
                                    <div className="col-sm-12 col-md-3">
                                        <h4> Kund </h4>
                                        <select className="form-control" onChange={(e) => { onCustomerChange(e) }}>
                                            <option value="Välj kund">Välj kund</option>
                                            {nonBudgetCustomers.map(m => {
                                                return renderCustomer(m);
                                            })}
                                        </select>
                                    </div>
                                    {chosenCustomer != null && 
                                        <div className="col-sm-12 col-md-3">
                                            <h4> Årsbudget kr </h4>
                                    <input className="form-control" type="number" value={budget} onChange={(e) => {setBudget(e.target.value)} }/>
                                        </div>
                                    }
                                </Fragment>
                                }
                            </Fragment>
                        }
                    </div>
                    {budget > 0 &&
                        <div className="col-sm-12" style={{ textAlign: "center", display: "flex", paddingTop: "10px" }}>
                            <div className="col-sm-12 col-md-6">
                                <button className="form-control" style={{ backgroundColor: color, color: "white" }} onClick={() => { save(); }}>
                                    Spara budget
                                </button>
                            </div>
                    <div className="col-sm-12 col-md-6">
                        <button className="form-control" style={{ backgroundColor: "red", color: "white" }} onClick={() => {
                            setChosenYear(null);
                            setChosenSalesman(null);
                            setChosenCustomer(null);
                            setNonBudgetCustomers([]);
                            setBudget(0);
                            setShowAddBudget(false);
                        }}>
                                    Rensa
                                </button>
                            </div>
                        </div>
                    }
                    <hr />
                </Fragment>
            }
            <div className="col-sm-12" style={{ textAlign: "center", marginBottom: "10px", display: "flex" }}>
                <div className="col-sm-12 col-md-6">
                    <select id="filteredSalesman" className="form-control" style={{ width: "100%" }} onChange={(e) => {
                        const filteredArray = salesmenWithBudgets.filter(item => item.id === e.target.value);
                        setVisibleData(filteredArray);
                    }}>
                        {members.map(m => {
                            return renderMember(m);
                        })}
                    </select>
                </div>
                <div className="col-sm-12 col-md-6" style={{border: "1px solid black"}}>
                    <p>Total budget alla säljare: {totalBudget.toLocaleString()} </p>
                </div>
            </div>
            <div className="col-sm-12" style={{ textAlign: "center" }}>
                {visibleData.map(s => {
                    return renderSalesmenTable(s);
                })} 
            </div>
            {editBudget != null &&
                <Modal style={{ width: "100vw", maxWidth: "none !important", textAlign: "center" }}
                    show={showEditBudget}
                    onHide={() => {
                        setShowEditBudget(false);
                        setEditBudget(null);
                    }}
                >
                    <Modal.Header closeButton>
                    <h3>
                        Ändra budget
                        <BsFillTrashFill style={{ color: "red", marginLeft: "10px", cursor: "pointer" }} onClick={() => { remove() }} />
                    </h3>
                    </Modal.Header>
                    <Modal.Body>
                        <p> {editBudget.year} - {customers.find(item => item.id === editBudget.customerId).name} </p>
                        <div style={{display: "flex"}}>
                            <input id="updatedAnnualBudget" className="form-control" defaultValue={editBudget.annualBudget} />
                            <button style={{ backgroundColor: color, color: "white" }} className="form-control" onClick={() => { changeBudget() } }>Spara</button>
                        </div>
                        SEK
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
}

export default Budget;