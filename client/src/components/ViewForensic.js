import React, { Component } from 'react';
import ViewCaseNav from './Navbar/ViewForensic.js';
// Removed unused import
import SimpleStorageContract from "../contracts/ForensicContract.json";
import getWeb3 from "../utils/getWeb3";
import ipfs from '../ipfs';

class ViewForensic extends Component {
    state = {
        ipfsHash: '',
        buffer: null,
        web3: null,
        accounts: null,
        contract: null,
        case_id: '',
        exhibit_name: '',
        desc: '',
        timestamp: ''
    };

    constructor(props) {
        super(props);
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            console.log(deployedNetwork.address);
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.runExample);
            this.onGetDate();
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    captureFile(event) {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) });
            console.log('buffer', this.state.buffer);
        }
    }

    onSubmit(event) {
        const { accounts, contract } = this.state;
        event.preventDefault();
        ipfs.files.add(this.state.buffer, (error, result) => {
            if (error) {
                console.error(error);
                return;
            }
            contract.methods.addReport(this.state.case_id, this.state.exhibit_name, this.state.desc, this.state.timestamp, result[0].hash).send({ from: accounts[0] });
        });
    }

    getVal = async () => {
        const { contract } = this.state;
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();
        // Update state with the result.
        this.setState({ ipfsHash: response });
        console.log("ipfsHash: " + this.state.ipfsHash);
    };

    getImg = async () => {
        const { contract } = this.state;
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();
        // Update state with the result.
        this.setState({ ipfsHash: response });
        const url = "https://ipfs.io/ipfs/" + this.state.ipfsHash;
        window.location = url;
    };

    onGetDate() {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 101).toString().substring(1);
        const day = (date.getDate() + 100).toString().substring(1);
        const hour = (date.getHours() + 100).toString().substring(1);
        const mins = (date.getMinutes() + 100).toString().substring(1);
        const sec = (date.getSeconds() + 100).toString().substring(1);
        this.setState({
            timestamp: year + "-" + month + "-" + day + " " + hour + ":" + mins + ":" + sec
        });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const crimeId = this.props.routeParams.caseId;
        console.log(this.props);
        return (
            <div>
                <ViewCaseNav crimeId={crimeId} />
                <h4 className="title-styled" style={{ marginTop: "40px", marginLeft: "235px", marginBottom: "25px" }}>Upload Forensic Reports</h4>
                <div className="container">
                    <form onSubmit={this.onSubmit} id="donateForm" className="donate-form">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group required">
                                    <label htmlFor="report_type">CASE ID</label>
                                    <input className="form-control" readOnly value={crimeId} type="text" id="case_id" name="case_id" placeholder="Enter product id" onChange={this.handleInputChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-8">
                                <div className="form-group required">
                                    <label htmlFor="company">EXHIBIT NAME - CODE</label>
                                    <input className="form-control" type="text" id="exhibit_name" name="exhibit_name" placeholder="Type and code of uploaded exhibit." onChange={this.handleInputChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-8">
                                <div className="form-group required">
                                    <label htmlFor="par_rem">DESCRIPTION</label>
                                    <input className="form-control" type="text" id="desc" name="desc" placeholder="One line description" onChange={this.handleInputChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-8">
                                <div className="form-group required">
                                    <label htmlFor="payment">Documents (upload in .zip or .rar format)</label>
                                    <input className="form-control" type="file" accept="application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream" onChange={this.captureFile} />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group required">
                                    <label htmlFor="fee">TIMESTAMP</label>
                                    <input value={this.state.timestamp} className="form-control" readOnly type="text" id="timestamp" name="timestamp" onChange={this.handleInputChange} placeholder="2019-08-03 20:45" required />
                                </div>
                            </div>
                            <div className="form-submit">
                                <button type="submit" className="dropbtn1" style={{ marginTop: "10px" }}>Upload to Blockchain</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ViewForensic;