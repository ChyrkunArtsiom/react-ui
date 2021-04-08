import React, {Component} from "react";
import ErrorForm from "../errorForm";
import Spinner from "react-bootstrap/Spinner";
import {Link} from "react-router-dom";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import {buildLastPageButton, buildPageButtons} from "../paginationButtonsBuilder";
import {bindActionCreators} from "redux";
import {itemsAreLoaded, itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";
import {connect} from "react-redux";
import UsersTable from "./usersTable";
import orderBy from "lodash/orderBy";
import "../../../css/admin/admin-users.css";

class AdminUsers extends Component {
    constructor(props) {
        super(props);
        const defaultSortBy = "id";
        const defaultSortOrder = "asc";
        let URLParams = new URLSearchParams(this.props.location.search);
        let size = Number.parseInt(URLParams.get("size"));
        let page = Number.parseInt(URLParams.get("page"));
        this.state = {
            items: [],
            page: (isNaN(page) || page < 1) ? 1 : page,
            size: (isNaN(size) || size < 1) ? 10 : size,
            showError: false,
            error: null,
            sortBy: defaultSortBy,
            sortOrder: defaultSortOrder,
        }
        this.onSizeChange = this.onSizeChange.bind(this);
        this.closeErrorForm = this.closeErrorForm.bind(this);
    }


    render() {
        const loading = this.props.itemsLoading;
        let items = this.state.items;
        let spinner = null;
        let table = null;
        let errorForm = null;
        let pagination = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (loading) {
            spinner = [<div key="spinner-container" className="spinner-container" />,
                <Spinner key="certificate-spinner" className="certificate-spinner" animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>];
        } else {
            if (items.length > 0) {
                console.log(items);
                table = (
                    <div key="admin-users-table-container" className="admin-users-table-container">
                        <UsersTable
                            data={orderBy(
                                this.state.items,
                                this.state.sortBy,
                                this.state.sortOrder
                            )}
                            requestSort={this.requestSort.bind(this)}
                            sortOrder={this.state.sortOrder}
                            sortBy={this.state.sortBy}
                            classComponent={this}
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
                                }}
                            >&#xab;</Link>
                            {buildPageButtons(this, this.state.page)}
                            {buildLastPageButton(this)}
                        </div>
                        <div className="size-select-container size-select-for-users">
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
                spinner,
                table,
                pagination
            ]
        );
    }

    componentDidMount() {
        console.log("DID MOUNT");
        document.title = "Users";
        this.loadItems();
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
        let tagsURI = `http://localhost:8080/esm/users?page=${this.state.page}&size=${this.state.size}`;
        console.log(tagsURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(tagsURI, {
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
                    this.setState({items: result._embedded.users});
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
}

function mapStateToProps(state) {
    return {
        itemsLoading: state.itemsLoading
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminUsers);