import React, {Component} from "react";
import Spinner from "react-bootstrap/Spinner";
import "../../css/orders.css";
import {AddButton, ToBottomButton, ToTopButton} from "./list-buttons";
import {bindActionCreators} from "redux";
import {clearCurrentItemsAction, currentItemsAction} from "../../actions/currentItemsAction";
import {itemsAreLoaded, itemsAreLoading} from "../../actions/itemsLoadingStatusAction";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {getTokenFromLocalStorage} from "../localStorageMethods";

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollPosition: 0,
            redirectTo: ''
        }
    }

    render() {
        console.log("Orders render");
        const loading = this.props.itemsLoading;
        const items = this.props.currentItems;

        console.log("Loading status in render: ", loading);
        if (loading) {
            return (
                [<div key="spinner-container" className="spinner-container" />,
                    <Spinner key="certificate-spinner" className="certificate-spinner" animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>]
            );
        }

        if (items !== undefined) {
            return (
                <div key="content-container"
                     className='content-container'
                     onScroll={() => {
                         /*                         this.manageButtons();
                                                  this.checkHeight();*/
                     }}
                >
                    {
                        <AddButton key="add-button" onClick={() => this.props.history.push('/orders/create')}/>
                        /*                    <ToTopButton key="to-top" onClick={this.onTopButtonClick}/>
                    <ToBottomButton key="to-bottom" onClick={this.onBottomButtonClick}/>*/}
                    <OrderTable key="order-table" items={items} classComponent={this}/>
                </div>
            );
        } else {
            return null;
        }
    }

    async componentDidMount() {
        let user = localStorage.getItem("user");
        if (user) {
            let userId = JSON.parse(user).id;
            await this.setState({userId})
            this.loadOrders();
        } else {
            console.log("NOT LOGGED!!!");
        }
    }

    componentWillUnmount() {
        this.props.clearCurrentItemsAction();
    }

    loadOrders() {
        let certificatesUri = buildOrdersUri(this);
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
                this.loadOrdersIntoProps(response.json()).then(() => {
                    scrollToPosition(this);
                })
            } else {
                this.props.itemsAreLoaded();
                console.log("ERROR");
            }
        });
    }

    loadOrdersIntoProps(result) {
        return result.then(result => {
            console.log('Orders are loaded');
            if (result._embedded !== undefined) {
                console.log("Result: ", result._embedded.orders);
                this.props.itemsAreLoaded();
                this.props.currentItemsAction(result._embedded.orders);
            }
        })
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
                        <TableRow hover key={row.id} onClick={() => props.classComponent.props.history.push(`/orders/${row.id}`)}>
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

function buildOrdersUri(component) {
    let userId = component.state.userId;
    let ordersUri = `http://localhost:8080/esm/orders/${userId}/order`;
    console.log("URI: ", ordersUri);
    return ordersUri;
}

function scrollToPosition(component) {
    const URLParams = new URLSearchParams(component.props.location.search);
    const container = document.querySelector('div.content-container');
    console.log("CLIENT HEIGHT: ", container.clientHeight);
    console.log("SCROLL TOP: ", container.scrollTop);
    console.log("SCROLL HEIGHT: ", container.scrollHeight);
    console.log("SCROLL: ", Number.parseInt(URLParams.get("scroll")));
    if (Number.parseInt(URLParams.get("scroll")) + container.clientHeight < container.scrollHeight) {
        container.scroll(0, Number.parseInt(URLParams.get("scroll")));
    }
}

function mapStateToProps(state) {
    return {
        currentItems: state.currentItems,
        itemsLoading: state.itemsLoading
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        currentItemsAction: currentItemsAction,
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded,
        clearCurrentItemsAction: clearCurrentItemsAction
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Orders);