import React, {Component} from "react";
import CertificatesTable from "./certificatesTable";
import orderBy from "lodash/orderBy";
import {bindActionCreators} from "redux";
import {itemsAreLoaded, itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";
import {connect} from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import "../../../css/admin/admin-certificates.css";
import {Link} from "react-router-dom";
import ErrorForm from "../errorForm";
import AdminManageCertificate from "./adminManageCertificate";
import {hideManageForm, showManageForm} from "../../../actions/manageFormAction";
import InfoForm from "../adminInfoForm";
import {putItemToEditForm} from "../../../actions/itemToEditAction";
import AdminDeleteForm from "../adminDeleteForm";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import {buildLastPageButton, buildPageButtons} from "../paginationButtonsBuilder";

class AdminCertificates extends Component {
    constructor(props) {
        super(props);
        const defaultSortBy = "createDate";
        const defaultSortOrder = "asc";
        let URLParams = new URLSearchParams(this.props.location.search);
        let page = Number.parseInt(URLParams.get("page"));
        let size = Number.parseInt(URLParams.get("size"));
        let filterName = URLParams.get("name");
        let filterDescription = URLParams.get("description");
        let tag = URLParams.get("tag");
        this.state = {
            items: [],
            page: (isNaN(page) || page < 1) ? 1 : page,
            size: (isNaN(size) || size < 1) ? 10 : size,
            sortBy: defaultSortBy,
            sortOrder: defaultSortOrder,
            filterName: filterName ? filterName : '',
            filterDescription: filterDescription ? filterDescription : '',
            filterTags: tag ? tag : '',
            filterText: buildFilterText(URLParams),
            showError: false,
            error: null,
            showInfo: false,
            typeOfInfo: '',
            typeOfAction: '',
            managedCertificate: null,
            showDeleteForm: false,
            certificateToDelete: null
        }
        this.onSizeChange = this.onSizeChange.bind(this);
        this.onFilterTextChange = this.onFilterTextChange.bind(this);
        this.onSubmitFilterText = this.onSubmitFilterText.bind(this);
        this.closeErrorForm = this.closeErrorForm.bind(this);
        this.closeInfoForm = this.closeInfoForm.bind(this);
        this.saveCertificateToState = this.saveCertificateToState.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCertificateSuccessfulEdit = this.onCertificateSuccessfulEdit.bind(this);
        this.deleteCertificate = this.deleteCertificate.bind(this);
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
        let manageCertificateForm = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (this.state.showDeleteForm) {
            deleteForm = <AdminDeleteForm
                key="delete-form"
                item= {this.state.certificateToDelete}
                type="certificate"
                onDelete={this.deleteCertificate}
                onCancel={() => this.setState({
                    showDeleteForm: false,
                    certificateToDelete: null
                })}
            />
        }

        if (this.state.showInfo) {
            infoForm = <InfoForm
                key="info"
                item={this.state.managedCertificate}
                type={this.state.typeOfInfo}
                action={this.state.typeOfAction}
                onClick={() => this.closeInfoForm}
            />
        }

        if (this.props.isShownManageForm) {
            manageCertificateForm = <AdminManageCertificate
                key="manage-certificate"
                item={this.props.itemToEdit}
                onCreate={this.saveCertificateToState}
                onEdit={this.onCertificateSuccessfulEdit}
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
                    <div key="admin-certificates-table-container" className="admin-certificates-table-container">
                        <CertificatesTable
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
                deleteForm,
                <div key="filter-form-container" className="filter-form-container">
                    <form className="filter-text-form" onSubmit={this.onSubmitFilterText}>
                        <input
                            className="filter-text-input"
                            type="text"
                            value={this.state.filterText}
                            placeholder="Search..."
                            onChange={this.onFilterTextChange}
                        />
                        <input className="filter-text-submit-button" type="submit" value="Go!"/>
                    </form>
                </div>,
                spinner,
                table,
                pagination,
                manageCertificateForm
            ]
        );
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

    componentDidMount() {
        console.log("DID MOUNT");
        document.title = "Certificates";
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
        let certificatesUri = buildItemsURI(this);
        console.log(certificatesUri);

        fetch(certificatesUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => {
                    this.props.itemsAreLoaded();
                    this.setState({items: result._embedded.certificates});
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

    onFilterTextChange(event) {
        this.setState({
            filterText: event.target.value
        });
        this.closeInfoForm();
    }

    onSubmitFilterText(event) {
        event.preventDefault();
        this.closeInfoForm();
        let URLParams = new URLSearchParams(this.props.location.search);
        URLParams.delete("page");
        URLParams.delete("name");
        URLParams.delete("description");
        URLParams.delete("tag");
        this.setState({
            filterName: '',
            filterDescription: '',
            filterTags: ''
        })

        let name = extractNameToFilterBy(this.state.filterText);
        if (name) {
            this.setState({filterName: name});
            URLParams.set("name", name);
        }

        let description = extractDescriptionToFilterBy(this.state.filterText);
        if (description) {
            this.setState({filterDescription: description});
            URLParams.set("description", description);
        }

        let tags = extractTagsToFilterBy(this.state.filterText);
        if (tags.length > 0) {
            this.setState({filterTags: tags.join(',')});
            URLParams.set("tag", tags.join(','));
        }

        this.props.history.push('?' + URLParams.toString());
        this.setState({page: 1});
        this.props.itemsAreLoading();
    }

    closeErrorForm() {
        this.setState({showError: false});
    }

    closeInfoForm() {
                this.setState({
                    showInfo: false,
                    typeOfInfo: '',
                    typeOfAction: '',
                    managedCertificate: null
                });
    }

    saveCertificateToState(certificate) {
        this.setState({
            managedCertificate: certificate,
            typeOfInfo: "certificate",
            typeOfAction: "create",
            showInfo: true});
    }

    onCertificateSuccessfulEdit(certificate) {
        this.setState({
            managedCertificate: certificate,
            typeOfInfo: "certificate",
            typeOfAction: "edit",
            showInfo: true});
    }

    onEdit(certificate) {
        this.props.showManageForm();
        this.props.putItemToEditForm(certificate);
    }

    onDelete(certificate) {
        this.setState({
            showDeleteForm: true,
            certificateToDelete: certificate.id
        })
    }

    async deleteCertificate() {
        let tagsUri = `http://localhost:8080/esm/certificates/${this.state.certificateToDelete}`;
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
                    managedCertificate: {id: this.state.certificateToDelete},
                    typeOfInfo: "certificate",
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
            certificateToDelete: null
        });
    }
}

function buildItemsURI(component) {
    let name = '';
    let desc = '';
    let tag = '';
    if (component.state.filterName) {
        name = "&name=" + component.state.filterName;
    }
    if (component.state.filterDescription) {
        desc = "&description=" + component.state.filterDescription;
    }
    if (component.state.filterTags) {
        tag = "&tag=" + component.state.filterTags;
    }
    let certificatesUri = `http://localhost:8080/esm/certificates?page=${component.state.page}&size=${component.state.size}${name}${desc}${tag}`;
    return certificatesUri;
}

function extractNameToFilterBy(text) {
    const reg = new RegExp('(?<=^|\\s)[\\p{L}\\w]+(?!\\S)', 'u');
    const arr = text.match(reg) || [];
    if (arr) {
        return arr[0];
    } else {
        return null;
    }
}

function extractDescriptionToFilterBy(text) {
    const reg = new RegExp('(?<=d\\()[\\p{L}\\w]+(?=\\))', 'u');
    const arr = text.match(reg) || [];
    if (arr) {
        return arr[0];
    } else {
        return null;
    }
}

function extractTagsToFilterBy(text) {
    const reg = new RegExp('(?<=#\\()[\\p{L}\\w]+(?=\\))', 'gu');
    const arr = text.match(reg) || [];
    if (arr) {
        return arr;
    } else {
        return null;
    }
}

function buildFilterText(URLParams) {
    let filterText = '';
    if (URLParams.get("name")) {
        filterText = filterText + URLParams.get("name") + " ";
    }
    if (URLParams.get("description")) {
        filterText = filterText + "d(" + URLParams.get("description") + ") ";
    }
    if (URLParams.get("tag")) {
        let tags = URLParams.get("tag").split(',');
        tags.forEach((tag) => {
            filterText = filterText + "#(" + tag + ") ";
        })
    }
    return filterText.trim();
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

export default connect(mapStateToProps, matchDispatchToProps)(AdminCertificates);