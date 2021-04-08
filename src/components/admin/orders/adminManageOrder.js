import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {hideManageForm} from "../../../actions/manageFormAction";
import {itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";
import {deleteItemFromEditForm} from "../../../actions/itemToEditAction";
import {connect} from "react-redux";
import "../../../css/admin/admin-manage-order.css";
import AsyncSelect from "react-select/async";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

class AdminManageOrder extends Component {
    constructor(props) {
        super(props);
        this.timeout = 0;
        this.state = {
            userId: props.item ? props.item.user.id : '',
            certificates: props.item ? convertCertificatesForSelect(props.item.certificates) : [],
            loadedCertificates: [],
            error: ''
        }
        this.createOrder = this.createOrder.bind(this);
        this.editOrder = this.editOrder.bind(this);
        this.loadCertificatesFromSelectInput = this.loadCertificatesFromSelectInput.bind(this);
        this.onCertificateChange = this.onCertificateChange.bind(this);
    }

    render() {
        let header;
        let table;
        if (this.props.item) {
            header = `Edit order with id = ${this.props.item.id}`;
        } else {
            header = "Add New Order";
        }
        if (this.state.certificates.length > 0) {
            table = (
                <div className="manage-order-certificate-table" key="manage-order-certificate-table">
                    <Table>
                        <TableHead className="manage-order-certificate-table-header">
                            <TableRow>
                                <TableCell>
                                    Id
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Price
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.certificates.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.id}
                                            </TableCell>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.price}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            );
        }

        return (
            <div className="manage-order-container">
                <div className="manage-order-header">
                    {header}
                </div>
                <form className="manage-order-form" onSubmit={(event) => {
                    if (this.state.certificates.length < 1) {
                        this.setState({error: {errorMessage: "You have to choose certificate"}});

                    }
                    if (this.props.item) {
                        this.editOrder(event);
                    } else {
                        this.createOrder(event);
                    }
                }}>
                    <div className="manage-order-row">
                        <label htmlFor="inputUserId"
                               className="manage-order-label">
                            User id
                        </label>
                        <input type="number"
                               id="inputUserId"
                               className="manage-order-input"
                               required
                               min="0"
                               max="9999999999"
                               value={this.state.userId}
                               onChange={event => this.setState({userId: event.target.value})}
                        />
                    </div>
                    <div className="manage-order-row">
                        <label htmlFor="inputCertificates"
                               className="manage-certificate-label">
                            Certificates
                        </label>
                        <div className="manage-order-input-select">
                            <AsyncSelect
                                id="inputCertificates"
                                isMulti
                                className="manage-order-select"
                                value={this.state.certificates}
                                placeholder="Choose certificates..."
                                defaultOptions={this.state.loadedCertificates}
                                loadOptions={this.loadCertificatesFromSelectInput}
                                onChange={this.onCertificateChange}
                                onInputChange={(newValue) => {
                                    if (!newValue) {
                                        clearTimeout(this.timeout);
                                    }
                                    return newValue;
                                }}
                                noOptionsMessage={() => "No such certificate found"}
                            />
                        </div>
                    </div>
                    {table}
                    <div className="manage-order-row error-text">
                        {this.state.error.errorMessage}
                    </div>
                    <div className="manage-order-row manage-order-buttons">
                        <input className="manage-order-save-button" type="submit" value="Save"/>
                        <input className="manage-order-cancel-button" type="button" value="Cancel" onClick={() => this.props.hideManageForm()}/>
                    </div>
                </form>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.item && !this.props.item) {
            this.setState({
                userId: '',
                certificates: []
            });
        }
    }

    componentWillUnmount() {
        this.props.deleteItemFromEditForm();
    }

    createOrder(event) {
        event.preventDefault();

        let ordersURI = `http://localhost:8080/esm/orders`;
        console.log(ordersURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        let certificates = [];
        this.state.certificates.forEach((element) => certificates.push({id: element.value}));

        let data = {
            user: {id: Number.parseInt(this.state.userId)},
            certificates: certificates
        }

        fetch(ordersURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                console.log("success");
                response.json().then(result => {
                    this.props.itemsAreLoading();
                    this.props.hideManageForm();
                    this.props.onCreate(result);
                });
            } else {
                response.json().then((result) => this.setState({error: result}));
            }
        });
    }

    editOrder(event) {
        event.preventDefault();

        let ordersURI = `http://localhost:8080/esm/orders`;
        console.log(ordersURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        let certificates = [];
        this.state.certificates.forEach((element) => certificates.push({id: element.value}));

        let data = {
            id: this.props.item.id,
            user: {id: Number.parseInt(this.state.userId)},
            certificates: certificates
        }

        console.log(JSON.stringify(data));

        fetch(ordersURI, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                response.json().then(
                    result => {
                        this.props.itemsAreLoading();
                        this.props.hideManageForm();
                        this.props.onCreate(result);
                    },
                    () => {
                        this.props.itemsAreLoading();
                        this.props.hideManageForm();
                        this.props.onEdit(this.props.item);
                    });
            } else {
                response.json().then((result) => this.setState({error: result}));
            }
        });
    }

    loadCertificatesFromSelectInput(inputValue, callBack) {
        console.log("Load certificates from select");
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (!inputValue) {
            callBack([]);
        }
        const searchedCertificate = this.state.certificates.filter(certificate => certificate.label === inputValue);
        if (searchedCertificate.length > 0) {
            clearTimeout(this.timeout);
            callBack(searchedCertificate);
        } else {
            this.timeout = setTimeout(() => {
                let certificatesURI = `http://localhost:8080/esm/certificates?name=${inputValue}`;
                console.log(certificatesURI);

                fetch(certificatesURI, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'en_US'
                    }
                }).then(response => {
                    if (response.ok) {
                        response.json().then(result => {
                            if (result._embedded !== undefined) {
                                const certificates = convertCertificatesForSelect(result._embedded.certificates);
                                console.log(certificates);
                                this.setState({loadedCertificates: certificates});
                                callBack(certificates);
                            } else {
                                callBack([]);
                            }
                        });
                    } else {
                        callBack([]);
                    }
                });
            }, 1000)
        }
    }

    onCertificateChange(event) {
        this.setState({certificates: event});
    }
}

function convertCertificatesForSelect(certificates) {
    certificates.forEach((certificate) => {
        certificate.label = certificate.name;
        certificate.value = certificate.id;
    });
    return certificates;
}

function mapStateToProps(state) {
    return {
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        hideManageForm: hideManageForm,
        itemsAreLoading: itemsAreLoading,
        deleteItemFromEditForm: deleteItemFromEditForm
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminManageOrder);