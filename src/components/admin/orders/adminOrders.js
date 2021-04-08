import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {itemsAreLoaded, itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";
import {hideManageForm, showManageForm} from "../../../actions/manageFormAction";
import {putItemToEditForm} from "../../../actions/itemToEditAction";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import ErrorForm from "../errorForm";
import Spinner from "react-bootstrap/Spinner";
import orderBy from "lodash/orderBy";
import {buildLastPageButton, buildPageButtons} from "../paginationButtonsBuilder";
import OrdersTable from "./ordersTable";
import AdminManageOrder from "./adminManageOrder";
import InfoForm from "../adminInfoForm";
import AdminDeleteForm from "../adminDeleteForm";

class AdminOrders extends Component {
    constructor(props) {
        super(props);
        const defaultSortBy = "id";
        const defaultSortOrder = "asc";
        let URLParams = new URLSearchParams(this.props.location.search);
        let page = Number.parseInt(URLParams.get("page"));
        let size = Number.parseInt(URLParams.get("size"));
        let userId = null;
        if (this.props.match.params.userId) {
            userId = Number.isNaN(Number.parseInt(this.props.match.params.userId)) ?
                -1 : Number.parseInt(this.props.match.params.userId);
        }
        this.state = {
            items: [],
            page: (isNaN(page) || page < 1) ? 1 : page,
            size: (isNaN(size) || size < 1) ? 10 : size,
            userId: userId,
            sortBy: defaultSortBy,
            sortOrder: defaultSortOrder,
            showError: false,
            error: null,
            showInfo: false,
            typeOfInfo: '',
            typeOfAction: '',
            managedOrder: null,
            showDeleteForm: false,
            orderToDelete: null
        }
        this.onSizeChange = this.onSizeChange.bind(this);
        this.closeErrorForm = this.closeErrorForm.bind(this);
        this.closeInfoForm = this.closeInfoForm.bind(this);
        this.saveOrderToState = this.saveOrderToState.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onOrderSuccessfulEdit = this.onOrderSuccessfulEdit.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
    }

    render() {
        if (this.state.userId && this.state.userId <= 0) {
            return (
                <Redirect to="/admin/error" />
            )
        }
        const loading = this.props.itemsLoading;
        let items = this.state.items;
        let spinner = null;
        let table = null;
        let errorForm = null;
        let pagination = null;
        let manageOrderForm = null;
        let infoForm = null;
        let deleteForm = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (this.state.showInfo) {
            infoForm = <InfoForm
                key="info"
                item={this.state.managedOrder}
                type={this.state.typeOfInfo}
                action={this.state.typeOfAction}
                onClick={() => this.closeInfoForm}
            />
        }

        if (this.state.showDeleteForm) {
            deleteForm = <AdminDeleteForm
                key="delete-form"
                item= {this.state.orderToDelete}
                type="order"
                onDelete={this.deleteOrder}
                onCancel={() => this.setState({
                    showDeleteForm: false,
                    orderToDelete: null
                })}
            />
        }

        if (this.props.isShownManageForm) {
            manageOrderForm = <AdminManageOrder
                key="manage-order"
                item={this.props.itemToEdit}
                onCreate={this.saveOrderToState}
                onEdit={this.onOrderSuccessfulEdit}
            />
        }

        if (loading) {
            spinner = [<div key="spinner-container" className="spinner-container" />,
                <Spinner key="certificate-spinner" className="certificate-spinner" animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>];
        } else {
            if (items.length > 0) {
                table = (
                    <div key="admin-orders-table-container" className="admin-orders-table-container">
                        <OrdersTable
                            data={orderBy(
                                this.state.items,
                                this.state.sortBy,
                                this.state.sortOrder
                            )}
                            requestSort={this.requestSort.bind(this)}
                            sortOrder={this.state.sortOrder}
                            sortBy={this.state.sortBy}
                            classComponent={this}
                            onEdit={this.onEdit}
                            onDelete={this.onDelete}
                        />
                    </div>
                );
                pagination = (
                    <div key="pagination-container" className="pagination-container">
                        <div className="pagination-buttons-container">
                            <Link
                                className="page-button"
                                to={() => {
                                    let URLParams = new URLSearchParams(this.props.location.search);
                                    URLParams.set("page", "1");
                                    return this.props.location.pathname + "?" + URLParams.toString();
                                }}
                                onClick={() => {
                                    this.props.itemsAreLoading();
                                    this.setState({page: 1});
                                    this.closeInfoForm();
                                }}
                            >&#xab;</Link>
                            {buildPageButtons(this, this.state.page)}
                            {buildLastPageButton(this)}
                        </div>
                        <div className="size-select-container">
                            <select defaultValue={this.state.size} id="size-select" onChange={this.onSizeChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                );
            }
        }

        return (
            [
                errorForm,
                infoForm,
                spinner,
                table,
                pagination,
                manageOrderForm,
                deleteForm
            ]
        );
    }

    componentDidMount() {
        console.log("DID MOUNT");
        if (this.state.userId) {
            document.title = `Orders for user №${this.state.userId}`;
        } else {
            document.title = "Orders";
        }
        if (!this.state.userId || this.state.userId > 0) {
            this.loadItems();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("DID UPDATE");
        if (this.props.itemsLoading === true && prevProps.itemsLoading !== this.props.itemsLoading) {
            this.loadItems();
        }
        if (prevState.showError) {
            this.setState({showError: false});
        }
    }

    loadItems() {
        let ordersURI;
        if(this.state.userId) {
            ordersURI = `http://localhost:8080/esm/orders/${this.state.userId}/order?page=${this.state.page}&size=${this.state.size}`;
        } else {
            ordersURI = `http://localhost:8080/esm/orders?page=${this.state.page}&size=${this.state.size}`;
        }
        console.log(ordersURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(ordersURI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => {
                    this.props.itemsAreLoaded();
                    console.log(result);
                    this.setState({items: result._embedded.orders});
                    const arr = result._links.last.href.match(new RegExp('(?<=page=)(\\d+)')) || [1];
                    const last = arr[0];
                    this.setState({lastPage: Number.parseInt(last)});
                });
            } else {
                response.json().then((result) => {
                    this.props.itemsAreLoaded();
                    this.setState({error: result, items: [], showError: true});
                });
            }
        });
    }

    onSizeChange(event) {
        let URLParams = new URLSearchParams(this.props.location.search);
        URLParams.set("size", event.target.value);
        URLParams.delete("page");
        this.props.history.push('?' + URLParams.toString());
        this.setState({size: Number.parseInt(event.target.value), page: 1});
        this.props.itemsAreLoading();
    }

    closeErrorForm() {
        this.setState({showError: false});
    }

    requestSort(pSortBy) {
        let sortBy = this.state.sortBy;
        let sortOrder = this.state.sortOrder;
        if (pSortBy === this.state.sortBy) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortBy = pSortBy;
            sortOrder = "asc";
        }
        this.setState({
            sortOrder: sortOrder,
            sortBy: sortBy
        })
    }

    saveOrderToState(order) {
        this.setState({
            managedOrder: order,
            typeOfInfo: "order",
            typeOfAction: "create",
            showInfo: true});
    }

    onOrderSuccessfulEdit(order) {
        this.setState({
            managedOrder: order,
            typeOfInfo: "order",
            typeOfAction: "edit",
            showInfo: true});
    }

    onEdit(order) {
        this.props.showManageForm();
        this.props.putItemToEditForm(order);
    }

    onDelete(order) {
        this.setState({
            showDeleteForm: true,
            orderToDelete: order.id
        })
    }

    closeInfoForm() {
        this.setState({
            showInfo: false,
            typeOfInfo: '',
            typeOfAction: '',
            managedOrder: null
        });
    }

    async deleteOrder() {
        let ordersURI = `http://localhost:8080/esm/orders/${this.state.orderToDelete}`;
        console.log(ordersURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        await fetch(ordersURI, {
            method: 'DELETE',
            headers: {
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            }
        }).then(response => {
            if (response.ok) {
                this.setState({
                    managedOrder: {id: this.state.orderToDelete},
                    typeOfInfo: "order",
                    typeOfAction: "delete",
                    showInfo: true
                });
                this.props.itemsAreLoading();
            } else {
                response.json().then((result) => this.setState({error: result, showError: true}));
            }
        });
        await this.setState({
            showDeleteForm: false,
            orderToDelete: null
        });
    }
}

function mapStateToProps(state) {
    return {
        itemsLoading: state.itemsLoading,
        isShownManageForm: state.isShownManageForm,
        itemToEdit: state.itemToEdit
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded,
        showManageForm: showManageForm,
        hideManageForm: hideManageForm,
        putItemToEditForm: putItemToEditForm
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminOrders);