import React, {Component} from "react";
import "../../css/create-order.css";
import "../../css/react-tags-style.css";
import Select from "react-select";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {getTokenFromLocalStorage, getUserFromLocalStorage} from "../localStorageMethods";
import close from "../../images/close-24px.svg";
import cart_image from "../../images/shopping_cart-24px.svg";

class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.timeout = 0;
        this.state = {
            error: null,
            addedCertificates: [],
            certificatesForSelect: [],
            page: 1,
            size: 10,
            certificateName: '',
            showErrorForm: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
        this.changeCertificateName = this.changeCertificateName.bind(this);
    }

    render() {
        return (
            <div className="content-container add-order-container">
                <div className="add-order-header">
                    Create order
                </div>
                <div className="add-order-inner-container">
                    <div className='filter-certificate-form'>
                        <div className="container-for-name-search">
                            <label className='order-label' htmlFor='certificateName'>Show certificates by name:</label>
                            <input id='certificateName' name='certificateName' type='text' value={this.state.certificateName} onChange={this.changeCertificateName} />
                        </div>
                        <div className="container-for-select">
                            <label className='order-label' htmlFor='select-certificate'>Add certificate to the order:</label>
                            <Select id="select-certificate"
                                    value={this.state.addedCertificates}
                                    className="select-certificate"
                                    isMulti={true}
                                    options = {this.state.certificatesForSelect}
                                    placeholder="Select certificate"
                                    onChange={this.handleChange}
                                    onMenuScrollToBottom={this.handleScrollToBottom} />
                        </div>
                    </div>
                    <TableContainer className="certificates-table-container">
                        <Table>
                            <TableHead className="certificates-table-head">
                                <TableRow>
                                    <TableCell>Certificate name</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.addedCertificates.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>${row.price}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="total-row">
                                    <TableCell>Total</TableCell>
                                    <TableCell>${this.state.addedCertificates.reduce((a, b) => a + b.price, 0).toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="buttons">
                        <button className="back-button" onClick={() => this.props.history.goBack()}>Back</button>
                        <button className="save-button" onClick={() => this.createOrder()}>Save</button>
                    </div>
                </div>
                {
                    this.state.showErrorForm &&
                    <div className="error-form-create-order">
                        <div className="close-img-container">
                            <img className="close-img" src={close} alt="close" onClick={() => this.setState({showErrorForm: false})} />
                        </div>
                        <div className="error-message-container">
                            Your order is empty!
                        </div>
                    </div>
                }
            </div>
        );
    }

    componentDidMount() {
        this.loadCertificates();
        this.loadCertificatesFromLocalStorage();
    }

    handleChange(event) {
        this.setState({addedCertificates: event});
        let saveToLocalStorageCertificates = [];
        event.forEach((element) => saveToLocalStorageCertificates.push(element.id));
        localStorage.setItem("savedCertificates", saveToLocalStorageCertificates.join(','));
    }

    handleScrollToBottom() {
        this.setState({
            page : this.state.page + 1
        });
        this.loadCertificates();
    }

    changeCertificateName(event) {
        this.setState({certificateName: event.target.value});
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.setState({certificatesForSelect: [], page: 1});
            this.loadCertificates();
        }, 1000);
    }

    loadCertificates() {
        let certificatesUri = `http://localhost:8080/esm/certificates?page=${this.state.page}&size=${this.state.size}&name=${this.state.certificateName ? this.state.certificateName : ''}`;

        fetch(certificatesUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
            }
        }).then(response => {
            if (response.ok) {
                this.loadCertificatesIntoState(response.json());
            } else {
                response.json().then((result) => this.setState({error: result}));
            }
        });
    }

    loadCertificatesFromLocalStorage() {
        const savedCertificates = localStorage.getItem("savedCertificates");
        if (savedCertificates) {
            let arr = savedCertificates.split(',');
            arr.forEach((element) => this.loadCertificateById(element));
        }
    }

    loadCertificateById(id) {
        let certificatesUri = `http://localhost:8080/esm/certificates/${id}`;

        fetch(certificatesUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => {
                    let convertedArr = convertCertificatesForReactSelect(Array.of(result));
                    this.setState({addedCertificates: [...this.state.addedCertificates, ...convertedArr]});
                    this.setState({certificatesForSelect: [...this.state.certificatesForSelect, ...convertedArr]});
                });
            }
        });
    }

    createOrder() {
        if (this.state.addedCertificates.length < 1) {
            this.setState({showErrorForm: true});
            return;
        }
        let tagsUri = `http://localhost:8080/esm/orders`;
        console.log(tagsUri);

        let certificatesToAdd = [];
        this.state.addedCertificates.forEach((element) => certificatesToAdd.push({id: element.id}));

        let userId = getUserFromLocalStorage().id;
        let data = {
            user: {
                id: userId
            },
            certificates: certificatesToAdd
        }

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(tagsUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                response.json().then(this.props.history.push('/orders'));
            } else {
                response.json().then((result) => this.setState({error: result}));
                console.error('Error: ');
            }
        });
        localStorage.removeItem("savedCertificates");
    }

    loadCertificatesIntoState(result) {
        result.then(result => {
            if (result._embedded !== undefined) {
                let convertedArr = convertCertificatesForReactSelect(result._embedded.certificates);
                let arr = [...this.state.certificatesForSelect, ...convertedArr];
                arr = deleteDuplicates(arr);
                this.setState({certificatesForSelect: arr});
            }
        })
    }
}

function convertCertificatesForReactSelect(array) {
    let converted = [];
    for (let i = 0; i < array.length; i++) {
        converted.push(
            {
                value: array[i].id,
                label: array[i].name,
                id:  array[i].id,
                name: array[i].name,
                description: array[i].description,
                price: array[i].price,
                createDate: array[i].createDate,
                lastUpdateDate: array[i].lastUpdateDate,
                duration: array[i].duration,
                tags: array[i].tags,
            });
    }
    return converted;
}

function deleteDuplicates(arr) {
    arr = arr.filter((element, index, self) =>
        index === self.findIndex((t) => (t.value === element.value
        ))
    );
    return arr;
}

export default CreateOrder