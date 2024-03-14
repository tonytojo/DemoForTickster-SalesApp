import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { getSales, getSalesCustomerGroup, getCustomersSearchForValue, saveValue} from "./requestHandler";

export class Value extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logo: $('#logo').val(),
            color: $('#color').val(),
            company: $('#company').val(),
            companyId: $('#companyId').val(),
            customers: [],
            customer: null,
            selectedCustomer: null,
            selectedId: null,
            potRevenue: "3",
            loyality: "3",
            sortiment: "3",
            brandValue: "3",
            marketLeading: "3",
            economy: "3",
            ownerShip: "3",
            revenue: null,
            classification: null
        }
    }

    componentDidUpdate() {

    }

    onChange() {
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        this.setState({
            customer: customer
        });
    }

    selectCustomer() {
        $("#spinner").show();
        var customer = $("#selectedCustomer").val();
        const array = customer.split("---");
        var name = array[0];
        var id = array[1];
        var customers = this.state.customers;
        var c;
        for (let i = 0; i < customers.length; i++) {
            if (name == customers[i].name) {
                c = customers[i];
            }
        }

        if (c != undefined) {
            if (c.type == "Customer") {
                $.when(getSales(this.state.companyId, id)).then(function successHandler(data) {
                    this.setState({
                        selectedCustomer: name,
                        selectedId: id,
                        revenue: data
                    })
                }.bind(this));
                $("#spinner").hide();
            }
            else {
                $.when(getSalesCustomerGroup(this.state.companyId, id)).then(function successHandler(data) {
                    this.setState({
                        selectedCustomer: name,
                        selectedId: id,
                        revenue: data
                    })
                }.bind(this));
                $("#spinner").hide();
            }

        }
        else {
            alert("Kunde inte hitta kunden. Kontrollera att fullständigt kundnamn är valt.")
            $("#spinner").hide();
        }
    }

    searchCustomers() {
        $("#spinner").show();
        var e = document.getElementById("selectedCustomer");
        var customer = e.value;

        $.when(getCustomersSearchForValue(this.state.companyId, customer, false)).then(function successHandler(data) {
            if (data != undefined) {
                $("#spinner").hide();
                this.setState({
                    customers: data
                })
                $("#customer").show();
            }
            else {
                $("#spinner").hide();
                alert("Ditt sökord fick inga matchningar.")
            }
        }.bind(this));
    }

    onChangePotRevenue(value) {
        if (value == "1") { $("#potRevenue1").removeClass("hidden") } else { $("#potRevenue1").addClass("hidden") };
        if (value == "2") { $("#potRevenue2").removeClass("hidden") } else { $("#potRevenue2").addClass("hidden") };
        if (value == "3") { $("#potRevenue3").removeClass("hidden") } else { $("#potRevenue3").addClass("hidden") };
        if (value == "4") { $("#potRevenue4").removeClass("hidden") } else { $("#potRevenue4").addClass("hidden") };
        if (value == "5") { $("#potRevenue5").removeClass("hidden") } else { $("#potRevenue5").addClass("hidden") };

        this.setState({
            potRevenue: value
        })
    }

    onChangeLoyality(value) {
        this.setState({
            loyality: value
        })
    }

    onChangeSortiment(value) {
        if (value == "1") { $("#sortiment1").removeClass("hidden") } else { $("#sortiment1").addClass("hidden") };
        if (value == "2") { $("#sortiment2").removeClass("hidden") } else { $("#sortiment2").addClass("hidden") };
        if (value == "3") { $("#sortiment3").removeClass("hidden") } else { $("#sortiment3").addClass("hidden") };
        if (value == "4") { $("#sortiment4").removeClass("hidden") } else { $("#sortiment4").addClass("hidden") };
        if (value == "5") { $("#sortiment5").removeClass("hidden") } else { $("#sortiment5").addClass("hidden") };

        this.setState({
            sortiment: value
        })
    }

    onChangeBrandValue(value) {
        if (value == "1") { $("#brandValue1").removeClass("hidden") } else { $("#brandValue1").addClass("hidden") };
        if (value == "2") { $("#brandValue2").removeClass("hidden") } else { $("#brandValue2").addClass("hidden") };
        if (value == "3") { $("#brandValue3").removeClass("hidden") } else { $("#brandValue3").addClass("hidden") };
        if (value == "4") { $("#brandValue4").removeClass("hidden") } else { $("#brandValue4").addClass("hidden") };
        if (value == "5") { $("#brandValue5").removeClass("hidden") } else { $("#brandValue5").addClass("hidden") };
        this.setState({
            brandValue: value
        })
    }

    onChangeMarketLeading(value) {
        if (value == "1") { $("#marketLeading1").removeClass("hidden") } else { $("#marketLeading1").addClass("hidden") };
        if (value == "2") { $("#marketLeading2").removeClass("hidden") } else { $("#marketLeading2").addClass("hidden") };
        if (value == "3") { $("#marketLeading3").removeClass("hidden") } else { $("#marketLeading3").addClass("hidden") };
        if (value == "4") { $("#marketLeading4").removeClass("hidden") } else { $("#marketLeading4").addClass("hidden") };
        if (value == "5") { $("#marketLeading5").removeClass("hidden") } else { $("#marketLeading5").addClass("hidden") };
        this.setState({
            marketLeading: value
        })
    }

    onChangeEconomy(value) {
        if (value == "1") { $("#economy1").removeClass("hidden") } else { $("#economy1").addClass("hidden") };
        if (value == "2") { $("#economy2").removeClass("hidden") } else { $("#economy2").addClass("hidden") };
        if (value == "3") { $("#economy3").removeClass("hidden") } else { $("#economy3").addClass("hidden") };
        if (value == "4") { $("#economy4").removeClass("hidden") } else { $("#economy4").addClass("hidden") };
        if (value == "5") { $("#economy5").removeClass("hidden") } else { $("#economy5").addClass("hidden") };
        this.setState({
            economy: value
        })
    }

    onChangeOwnerShip(value) {
        if (value == "1") { $("#ownerShip1").removeClass("hidden") } else { $("#ownerShip1").addClass("hidden") };
        if (value == "2") { $("#ownerShip2").removeClass("hidden") } else { $("#ownerShip2").addClass("hidden") };
        if (value == "3") { $("#ownerShip3").removeClass("hidden") } else { $("#ownerShip3").addClass("hidden") };
        if (value == "4") { $("#ownerShip4").removeClass("hidden") } else { $("#ownerShip4").addClass("hidden") };
        if (value == "5") { $("#ownerShip5").removeClass("hidden") } else { $("#ownerShip5").addClass("hidden") };
        this.setState({
            ownerShip: value
        })
    }

    saveValue() {
        
        $.when(saveValue(this.state.selectedCustomer,
            this.state.selectedId,
            this.state.potRevenue,
            this.state.loyality,
            this.state.sortiment,
            this.state.brandValue,
            this.state.marketLeading,
            this.state.economy,
            this.state.ownerShip,
            this.state.revenue,
            this.state.companyId)).then(function successHandler(returnValue) {

                var value = returnValue;
                if (value >= 0 && value < 0.25)
                    this.setState({ classification: "D", selectedCustomer: null })
                if (value >= 0.25 && value < 0.50)
                    this.setState({ classification: "C", selectedCustomer: null })
                if (value > 0.50 && value < 0.75)
                    this.setState({ classification: "B", selectedCustomer: null })
                if (value > 0.75 && value <= 1.1)
                    this.setState({ classification: "A", selectedCustomer: null })

                this.setState({
                    potRevenue: "3",
                    loyality: "3",
                    sortiment: "3",
                    brandValue: "3",
                    marketLeading: "3",
                    economy: "3",
                    ownerShip: "3",
                });

                $("#selectedCustomer").val(""); 

                $("#valueSuccessValued").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $("#valueSuccessValued").hide();
                }, 5000);

                setTimeout();
        }.bind(this));

    }

    clearSelectedCustomer() {
        this.setState({
            selectedCustomer: null
        });
    }

    render() {
        const customerList = this.state.customers.map((customer, i) => {
            return <option key={i} value={customer.name + "---" + customer.id}></option>
        });
        return (
            <div style={{ background: "#f2f2f2", borderRadius: "13px", marginTop: "10px" }}>
                <div className="noPadding col-sm-12 head" style={{ textAlign: "center", display: "block" }}>
                    <div id="valueSuccessValued" className="col-sm-12" style={{ display: "none", height: "auto", textAlign: "center", backgroundColor: "#368f4e", color: "white", padding: "5px", borderRadius: "10px" }}>
                        <h4>Kunden har värderats och fick klassificering: {this.state.classification}</h4>
                    </div>
                    {this.state.selectedCustomer == null ? (
                        <div className="noPadding col-sm-12" style={{ display: "block" }}>
                            <h4>Sök kund</h4>
                            <div className="col-sm-12" style={{ display: "flex" }}>
                                <input id="selectedCustomer" className="form-control" list="customer" onChange={() => this.onChange()} />
                                <button className="btn btn-primary" style={{ marginLeft: "10px", backgroundColor: this.state.color, color: "white" }} onClick={() => this.searchCustomers()}>Sök</button>
                            </div>
                            <div className="col-sm-12" style={{ display: "block" }}>
                                <datalist id="customer" style={{display: "none"}}>
                                    {customerList}
                                </datalist>
                                <button className="btn btn-primary" style={{ marginTop: "10px", width: "100%", backgroundColor: this.state.color, color: "white" }} onClick={() => this.selectCustomer()}>Välj</button>
                            </div>
                        </div>
                    ) : (
                        <div className="col-sm-12" style={{ display: "grid" }}>
                                <h4>
                                    {this.state.selectedCustomer}
                                    <span onClick={() => this.clearSelectedCustomer()}>
                                        <i className="fas fa-arrow-circle-left" style={{ color: this.state.color, fontSize: "30px", float: "right" }}></i>
                                    </span>
                                </h4>
                        </div>
                    )}
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                {this.state.selectedCustomer != null ? (
                    <div>
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Pot. omsättning</label>
                                <input id="potRevenue" type="range" list="potRevenueList" min="1" max="5" step="1" value={this.state.potRevenue} onChange={e => this.onChangePotRevenue(e.target.value)} />
                                <datalist id="potRevenueList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text hidden" style={{fontSize: "15px"}} id="potRevenue1">1 = 0 - 200t</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="potRevenue2">2 = 200 - 400t</small>
                                <small className="form-text" style={{ fontSize: "15px" }} id="potRevenue3">3 = 400t - 1mkr</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="potRevenue4">4 = 1 - 2mkr</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="potRevenue5">5 = 2mkr-</small>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Lojalitet</label>
                                <input id="loyality" type="range" list="loyalityList" min="1" max="5" step="1" value={this.state.loyality} onChange={e => this.onChangeLoyality(e.target.value)} />
                                <datalist id="loyalityList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text" style={{ fontSize: "15px" }}>1-5 enligt bedömning (se frågor)  </small>
                                <small className="form-text text-muted">Uppskattar kund vår servicegrad? Jämför ständigt priser? Känsla av exklusivitet? Har vi avtal? Förstår vi kunden /kunden oss?   </small>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Pot. Sortimentsbredd (produktområden)</label>
                                <input id="sortiment" type="range" list="sortimentList" min="1" max="5" step="1" value={this.state.sortiment} onChange={e => this.onChangeSortiment(e.target.value)} />
                                <datalist id="sortimentList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="sortiment1">1 = 1 produktområde</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="sortiment2">2 = 2-3 produktområden</small>
                                <small className="form-text" style={{ fontSize: "15px" }} id="sortiment3">3 = 4 produktområden</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="sortiment4">4 = 5 produktområden</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="sortiment5">5 = 6-8 produktområden</small>
                                <small className="form-text text-muted">8 områden (max) </small>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Omsättning(Hämtas externt)</label>
                                <input id="revenue" value={this.state.revenue.toLocaleString()} className="form-control" disabled />
                            </div>
                            <div className="col-sm-12 col-md-6">

                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Varumärkesvärde</label>
                                <input id="brandValue" type="range" list="brandValueList" min="1" max="5" step="1" value={this.state.brandValue} onChange={e => this.onChangeBrandValue(e.target.value)} />
                                <datalist id="brandValueList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="brandValue1"> 1 = Mindre och/eller nystartat bolag</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="brandValue2">
                                    1 = Mindre och/eller nystartat bolag <br/>
                                    3 = Verkstadsbolaget, CS Produktion (lokalt/regionalt kända)
                                    </small>
                                <small className="form-text" style={{ fontSize: "15px" }} id="brandValue3">3 = Verkstadsbolaget, CS Produktion (lokalt/regionalt kända)</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="brandValue4">
                                    3 = Verkstadsbolaget, CS Produktion (lokalt/regionalt kända)<br />
                                    5 = Stora Enso, Kongsberg, Valmet, Billerud (internationellt kända)
                                </small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="brandValue5">5 = Stora Enso, Kongsberg, Valmet, Billerud (internationellt kända)</small>
                                <small className="form-text text-muted">1-5 enligt beskrivning </small>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Marknadsledande</label>
                                <input id="marketLeading" type="range" list="marketLeadingList" min="1" max="5" step="1" value={this.state.marketLeading} onChange={e => this.onChangeMarketLeading(e.target.value)} />
                                <datalist id="marketLeadingList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="marketLeading1">1 = Stor konkurrens, få kunder</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="marketLeading2">
                                    1 = Stor konkurrens, få kunder<br />
                                    3 = Ledande på konkurrenskraftig marknad
                                </small>
                                <small className="form-text" style={{ fontSize: "15px" }} id="marketLeading3">3 = Ledande på konkurrenskraftig marknad</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="marketLeading4">
                                    3 = Ledande på konkurrenskraftig marknad<br />
                                    5 = Ensam på marknaden (dominant)
                                </small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="marketLeading5">5 = Ensam på marknaden (dominant)</small>
                                <small className="form-text text-muted">1-5 enligt beskrivning  </small>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Ekonomi (tillväxt/fin. stabilitet)</label>
                                <input id="economy" type="range" list="economyList" min="1" max="5" step="1" value={this.state.economy} onChange={e => this.onChangeEconomy(e.target.value)} />
                                <datalist id="economyList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="economy1">1 = Betalar sällan i tid, dålig kreditvärdighet</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="economy2">
                                    1 = Betalar sällan i tid, dålig kreditvärdighet<br />
                                    3 = Betalar i tid, dålig kreditvärdighet
                                </small>
                                <small className="form-text" style={{ fontSize: "15px" }} id="economy3">3 = Betalar i tid, dålig kreditvärdighet</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="economy4">
                                    3 = Betalar i tid, dålig kreditvärdighet<br />
                                    5 = Betalar alltid i tid, hög kreditvärdighet
                                </small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="economy5">5 = Betalar alltid i tid, hög kreditvärdighet</small>
                                <small className="form-text text-muted">1-5 enligt beskrivning  </small>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row" style={{ display: "flex" }}>
                            <div className="col-sm-12 col-md-6" style={{ display: "grid" }}>
                                <label>Ägarskap (kort/långsiktigt ägarskap)</label>
                                <input id="ownerShip" type="range" list="ownerShipList" min="1" max="5" step="1" value={this.state.ownerShip} onChange={e => this.onChangeOwnerShip(e.target.value)} />
                                <datalist id="ownerShipList">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </datalist>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="ownerShip1">1 = Småbolag</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="ownerShip2">
                                    1 = Småbolag<br />
                                    3 = Privatägt aktiebolag
                                    </small>
                                <small className="form-text" style={{ fontSize: "15px" }} id="ownerShip3">3 = Privatägt aktiebolag</small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="ownerShip4">
                                    3 = Privatägt aktiebolag<br />
                                    5 = Offentlig sektor, börsnoterat bolag
                                </small>
                                <small className="form-text hidden" style={{ fontSize: "15px" }} id="ownerShip5">5 = Offentlig sektor, börsnoterat bolag</small>
                                <small className="form-text text-muted">1-5 enligt beskrivning  </small>
                            </div>
                        </div>
                        <button className="btn" onClick={() => this.saveValue()} style={{ backgroundColor: this.state.color, color: "white", marginBottom: "10px", width: "100%" }}>Spara</button>
                    </div>
                ) : (
                    <div className="col-sm-12" style={{ textAlign: "center" }}>
                        <h4> Ingen kund har valts.</h4>
                    </div>
                )
                }
                
            </div>
        );
    }
}

export default Value;