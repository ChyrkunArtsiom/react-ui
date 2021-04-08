import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {itemsAreLoaded, itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";
import {hideManageForm, showManageForm} from "../../../actions/manageFormAction";
import {connect} from "react-redux";
import ErrorForm from "../errorForm";
import AdminDeleteForm from "../adminDeleteForm";
import InfoForm from "../adminInfoForm";
import Spinner from "react-bootstrap/Spinner";
import {Link} from "react-router-dom";
import TagsTable from "./tagsTable";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import "../../../css/admin/admin-tags.css";
import AdminManageTag from "./adminManageTag";
import {buildLastPageButton, buildPageButtons} from "../paginationButtonsBuilder";

class AdminTags extends Component {
    constructor(props) {
        super(props);
        let URLParams = new URLSearchParams(this.props.location.search);
        let size = Number.parseInt(URLParams.get("size"));
        let page = Number.parseInt(URLParams.get("page"));
        this.state = {
            items: [],
            page: (isNaN(page) || page < 1) ? 1 : page,
            size: (isNaN(size) || size < 1) ? 10 : size,
            showError: false,
            error: null,
            showInfo: false,
            typeOfInfo: '',
            typeOfAction: '',
            managedTag: null,
            showDeleteForm: false,
            tagToDelete: null
        }
        this.onSizeChange = this.onSizeChange.bind(this);
        this.closeErrorForm = this.closeErrorForm.bind(this);
        this.closeInfoForm = this.closeInfoForm.bind(this);
        this.saveTagToState = this.saveTagToState.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
    }

    render() {
        const loading = this.props.itemsLoading;
        let items = this.state.items;
        let spinner = null;
        let table = null;
        let errorForm = null;
        let infoForm = null;
        let deleteForm = null;
        let pagination = null;
        let manageTagForm = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (this.state.showDeleteForm) {
            deleteForm = <AdminDeleteForm
                key="delete-form"
                item= {this.state.tagToDelete}
                type="tag"
                onDelete={this.deleteTag}
                onCancel={() => this.setState({
                    showDeleteForm: false,
                    tagToDelete: null
                })}
            />
        }

        if (this.state.showInfo) {
            infoForm = <InfoForm
                key="info"
                item={this.state.managedTag}
                type={this.state.typeOfInfo}
                action={this.state.typeOfAction}
                onClick={() => this.closeInfoForm}
            />
        }

        if (this.props.isShownManageForm) {
            manageTagForm = <AdminManageTag
                key="manage-tag"
                onCreate={this.saveTagToState}
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
                    <div key="admin-tags-table-container" className="admin-tags-table-container">
                        <TagsTable
                            data={this.state.items}
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
                        <div className="size-select-container size-select-for-tags">
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
                deleteForm,
                spinner,
                table,
                pagination,
                manageTagForm
            ]
        );
    }

    componentDidMount() {
        console.log("DID MOUNT");
        document.title = "Tags";
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
        let tagsURI = buildItemsURI(this);
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
                    this.setState({items: result._embedded.tags});
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
        this.closeInfoForm();
    }

    closeErrorForm() {
        this.setState({showError: false});
    }

    closeInfoForm() {
        this.setState({
            showInfo: false,
            typeOfInfo: '',
            typeOfAction: '',
            managedTag: null
        });
    }

    saveTagToState(tag) {
        this.setState({
            managedTag: tag,
            typeOfInfo: "tag",
            typeOfAction: "create",
            showInfo: true});
    }

    onDelete(tag) {
        this.setState({
            showDeleteForm: true,
            tagToDelete: tag.id
        })
    }

    async deleteTag() {
        let tagsUri = `http://localhost:8080/esm/tags/${this.state.tagToDelete}`;
        console.log(tagsUri);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        await fetch(tagsUri, {
            method: 'DELETE',
            headers: {
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            }
        }).then(response => {
            if (response.ok) {
                this.setState({
                    managedTag: {id: this.state.tagToDelete},
                    typeOfInfo: "tag",
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
            tagToDelete: null
        });
    }
}

function buildItemsURI(component) {
    let tagsURI = `http://localhost:8080/esm/tags?page=${component.state.page}&size=${component.state.size}`;
    return tagsURI;
}

function mapStateToProps(state) {
    return {
        itemsLoading: state.itemsLoading,
        isShownManageForm: state.isShownManageForm,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded,
        showManageForm: showManageForm,
        hideManageForm: hideManageForm
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminTags);