import React, {Component} from "react";
import ErrorForm from "../errorForm";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import "../../../css/admin/admin-order.css";
import {Link} from "react-router-dom";

class AdminOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
            error: null,
            showError: false
        }
        this.closeErrorForm = this.closeErrorForm.bind(this);
    }

    render() {
        let order = this.state.order;
        let errorForm = null;
        let orderForm = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (order) {
            orderForm = (
                <div key="admin-order-container" className="admin-order-container">
                    <div className="admin-order-header">
                        <h1>Order №{order.id}</h1>
                    </div>
                    <div className="admin-order-data">
                        <p>Purchase date: {new Date(order.purchaseDate).toLocaleDateString()}</p>
                        <p>
                            {"User: "}
                            <Link to={`/admin/users/${order.user.id}`} className="admin-order-user-link">
                                {order.user.name}
                            </Link>
                        </p>
                        <p>Cost: ${order.cost}</p>
                    </div>
                    <div className="admin-order-certificates-table">
                        <p>Certificates</p>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="items-table-body">
                                {
                                    order.certificates.map((item) => {
                                        return (
                                            <TableRow key={item.id} onClick={() => this.props.history.push(`/admin/certificates/${item.id}`)}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>${item.price}</TableCell>
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
                orderForm
            ]
        );
    }

    componentDidMount() {
        document.title = `Order №${this.props.match.params.id}`;
        let tagsUri = `http://localhost:8080/esm/orders/${this.props.match.params.id}`;
        console.log(tagsUri);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(tagsUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => this.setState({order: result}));
            } else {
                response.json().then((result) => this.setState({error: result, showError: true}));
            }
        });
    }

    closeErrorForm() {
        this.setState({showError: false});
    }
}

export default AdminOrder;