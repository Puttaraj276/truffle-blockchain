import React, { Component } from 'react';
import '../CSS/newFIR.css';
import GenericNavbar from './Navbar/GenericNavbar';
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../utils/getWeb3";

class NewFIR extends Component {
    state = {
        buffer: null,
        web3: null,
        accounts: null,
        contract: null,
        crime_id: '',
        timestamp: '',
        offense_code: '',
        description: ''
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({ web3, accounts, contract: instance });
            this.onGetDate();
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    onSubmit(event) {
        const { accounts, contract } = this.state;
        event.preventDefault();
        this.onGetDate();
        contract.methods.addCrimeReport(this.state.crime_id, this.state.timestamp, this.state.offense_code, this.state.description).send({ from: accounts[0] });
    }

    onGetDate() {
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 101).toString().substring(1);
        var day = (date.getDate() + 100).toString().substring(1);
        var hour = (date.getHours() + 100).toString().substring(1);
        var mins = (date.getMinutes() + 100).toString().substring(1);
        var sec = (date.getSeconds() + 100).toString().substring(1);
        this.setState({
            timestamp: year + "-" + month + "-" + day + " " + hour + ":" + mins + ":" + sec
        });
    }

    render() {
        return (
            <div className="">
                <GenericNavbar />
                <div className="container">
                    <div className="row">
                        <div className="col s6">
                            <div className="card reportCard">
                                <div className="card-title cardTitle2">
                                    <h4 className="cardTitle">New FIR</h4>
                                </div>
                                <div className="card-content">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="input-field">
                                            <input type="text" id="caseId" onChange={(evt) => { this.setState({ crime_id: evt.target.value }); }} required />
                                            <label htmlFor="caseId">Case ID</label>
                                        </div>
                                        <div className="input-field">
                                            <input value={this.state.timestamp} type="text" id="timestamp" readOnly required />
                                        </div>
                                        <div className="input-field">
                                            <input type="text" id="offCode" onChange={(evt) => { this.setState({ offense_code: evt.target.value }); }} required />
                                            <label htmlFor="offCode">Offense Code</label>
                                        </div>
                                        <div className="form-submit center">
                                            <button type="submit" className="dropbtn1" style={{ marginTop: "10px" }}>Upload to Blockchain</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="card reportCard">
                                <div className="card-title cardTitle">
                                    <h4 className="cardTitle">Enter Description</h4>
                                </div>
                                <div className="card-content">
                                    <div className="input-field ">
                                        <textarea id="report" className="textAreaHeight" onChange={(evt) => { this.setState({ description: evt.target.value }); }} required></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default NewFIR;