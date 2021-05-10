import React, {Component} from "react";
import Spinner from "react-bootstrap/Spinner";
import "../../css/orders.css";
import {AddButton} from "./list-buttons";
import {bindActionCreators} from "redux";
import {clearCurrentItemsAction} from "../../actions/currentItemsAction";
import {itemsAreLoaded, itemsAreLoading} from "../../actions/itemsLoadingStatusAction";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {getTokenFromLocalStorage} from "../localStorageMethods";

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollPosition: 0,
            redirectTo: '',
            orders: []
        }
    }

    render() {
        console.log("Orders render");
        const loading = this.props.itemsLoading;
        const orders = this.state.orders;

        console.log("Loading status in orders render: ", loading);
        if (loading) {
            return (
                [<div key="spinner-container" className="spinner-container" />,
                    <Spinner key="certificate-spinner" className="certificate-spinner" animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>]
            );
        }

        if (orders.length > 0) {
            return (
                <div key="content-container" className='content-container'>
                    <AddButton key="add-button" onClick={() => this.props.history.push('/orders/create')}/>
                    <OrderTable key="order-table" items={orders} classComponent={this}/>
                </div>
            );
        } else {
            return null;
        }
    }

    async componentDidMount() {
        console.log("Orders DID MOUNT")
        let user = localStorage.getItem("user");
        if (user) {
            let userId = JSON.parse(user).id;
            await this.setState({userId})
            this.loadOrders();
        } else {
            console.log("NOT LOGGED!!!");
        }
    }

    async componentWillUnmount() {
        console.log("Orders WILL UNMOUNT");
        await this.props.clearCurrentItemsAction();
    }

    loadOrders() {
        let page = 1;
        this.loadOnePage(page);
    }

    loadOnePage(currentPage) {
        let certificatesUri = buildOrdersUri(this, currentPage);
        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(certificatesUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header
            }
        }).then(response => {
            if (response.ok) {
                let result = response.json();
                this.loadOrdersIntoProps(result, currentPage);
            } else {
                this.props.itemsAreLoaded();
                console.log("ERROR");
            }
        });
    }

    loadOrdersIntoProps(result, page) {
        return result.then(result => {
            console.log('Orders are loaded');
            console.log(result._embedded)
            if (result._embedded !== undefined) {
                console.log("Result: ", result._embedded.orders);
                this.setState({orders: this.state.orders.concat(result._embedded.orders)});
                this.loadOnePage(page + 1);
            } else {
                this.props.itemsAreLoaded();
            }
        });
    }
}

function OrderTable(props) {
    return (
        <TableContainer className="orders-table-container">
            <Table>
                <TableHead className="orders-table-head">
                    <TableRow>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.items.map((row) => (
                        <TableRow className="order-table-row" hover key={row.id} onClick={() => props.classComponent.props.history.push(`/orders/${row.id}`)}>
                            <TableCell>{new Date(row.purchaseDate).toLocaleDateString()}</TableCell>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>${row.cost}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function buildOrdersUri(component, page) {
    let userId = component.state.userId;
    let ordersUri = `http://localhost:8080/esm/orders/${userId}/order?page=${page}`;
    console.log("URI: ", ordersUri);
    return ordersUri;
}

function mapStateToProps(state) {
    return {
        itemsLoading: state.itemsLoading
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded,
        clearCurrentItemsAction: clearCurrentItemsAction
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Orders);