import React, {Component} from "react";
import ErrorForm from "./errorForm";
import "../../css/admin/admin-certificate.css";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

class AdminCertificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificate: null,
            error: null,
            showError: false
        }
        this.closeErrorForm = this.closeErrorForm.bind(this);
    }

    render() {
        let error = this.state.error;
        let certificate = this.state.certificate;
        let errorForm = null;
        let certificateForm = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (certificate) {
            certificateForm = (
                <div key="admin-certificate-container" className="admin-certificate-container">
                    <div className="admin-ceritifcate-header">
                        <h1>Certificate №{this.state.certificate.id}</h1>
                    </div>
                    <div className="admin-certificate-data">
                        <p>Name: {this.state.certificate.name}</p>
                        <p>Description: {this.state.certificate.description}</p>
                        <p>Price: {this.state.certificate.price}</p>
                        <p>Created: {this.state.certificate.createDate}</p>
                        <p>Updated: {this.state.certificate.lastUpdateDate}</p>
                        <p>Duration: {this.state.certificate.duration}</p>
                    </div>
                    <div className="admin-certificate-tags-table">
                        <p>Tags</p>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.certificate.tags.map((item) => {
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )
        }

        return (
            [
                errorForm,
                certificateForm
            ]
        );
    }

    componentDidMount() {
        let tagsUri = `http://localhost:8080/esm/certificates/${this.props.match.params.id}`;
        console.log(tagsUri);
        fetch(tagsUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US'
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => this.setState({certificate: result}));
            } else {
                response.json().then((result) => this.setState({error: result, showError: true}));
            }
        });
    }

    closeErrorForm() {
        this.setState({showError: false});
    }
}

export default AdminCertificate;