import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import Kanban from "./kanban"

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logo: $('#logo').val(),
            color: $('#color').val(),
            company: $('#company').val(),
            companyId: $('#companyId').val()
        }
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div style={{ background: "#f2f2f2", padding: "10px", borderRadius: "13px", paddingTop: "15px", marginTop: "10px", minHeight: "750px" }}>
                <div className="col-sm-12" style={{ display: "grid", textAlign: "center" }}>
                    <h2 style={{ marginTop: "15px", marginBottom: "0" }}>Välkommen till Säljappen</h2>
                </div>
                <hr style={{ borderTop: "2px solid black" }} />
                <div className="col-sm-12" style={{ textAlign: "center" }}>
                    <p>Här kan du administrera kundaktiviteter, projektaktiviteter samt ta del av analys och säljrapport.</p>
                </div>
                {/*<div>*/}
                {/*    <Kanban/>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default Home;