import React, {Component} from "react";
import CertificatesTable from "./certificatesTable";
import orderBy from "lodash/orderBy";
import {bindActionCreators} from "redux";
import {itemsAreLoaded, itemsAreLoading} from "../../actions/itemsLoadingStatusAction";
import {connect} from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import "../../css/admin/admin-certificates.css";
import {Link} from "react-router-dom";
import ErrorForm from "./errorForm";

class AdminCertificates extends Component {
    constructor(props) {
        super(props);
        const defaultSortBy = "createDate";
        const defaultSortOrder = "asc";
        let URLParams = new URLSearchParams(this.props.location.search);
        let size = Number.parseInt(URLParams.get("size"));
        let page = Number.parseInt(URLParams.get("page"));
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
            error: null
        }
        this.onSizeChange = this.onSizeChange.bind(this);
        this.onFilterTextChange = this.onFilterTextChange.bind(this);
        this.onSubmitFilterText = this.onSubmitFilterText.bind(this);
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
                table = (
                    <div key="items-table-container" className="items-table-container">
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
                        <div className="size-select-container">
                            <select id="size-select" onChange={this.onSizeChange}>
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
                pagination
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

    async loadItems() {
        let certificatesUri = await buildItemsURI(this);
        console.log(certificatesUri);

        await fetch(certificatesUri, {
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
    }

    onFilterTextChange(event) {
        this.setState({
            filterText: event.target.value
        });
    }

    onSubmitFilterText(event) {
        event.preventDefault();
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
        console.log("name ", name);

        let description = extractDescriptionToFilterBy(this.state.filterText);
        if (description) {
            this.setState({filterDescription: description});
            URLParams.set("description", description);
        }
        console.log("desc ", description);

        let tags = extractTagsToFilterBy(this.state.filterText);
        if (tags.length > 0) {
            this.setState({filterTags: tags.join(',')});
            URLParams.set("tag", tags.join(','));
        }
        console.log("tags ", tags.join(','));

        this.props.history.push('?' + URLParams.toString());
        this.setState({page: 1});
        this.props.itemsAreLoading();
    }

    closeErrorForm() {
        this.setState({showError: false});
    }
}

async function buildItemsURI(component) {
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

function buildPageButtons(component, page) {
    let buttons = [];
    for (let iteratedPage = page - 2; iteratedPage <= page + 2; iteratedPage++) {
        if (iteratedPage >= 1 && iteratedPage <= component.state.lastPage) {
            let button = (
                <Link
                    key={`button-${iteratedPage}`}
                    className={component.state.page === iteratedPage ? "current-page-button" : "page-button"}
                    to={() => {
                        let URLParams = new URLSearchParams(component.props.location.search);
                        URLParams.set("page", iteratedPage);
                        return component.props.location.pathname + "?" + URLParams.toString();
                    }}
                    onClick={() => {
                        component.props.itemsAreLoading();
                        component.setState({page: iteratedPage});
                    }}
                >{iteratedPage}</Link>
            );
            buttons.push(button);
        }
    }
    return buttons;
}

function buildLastPageButton(component) {
    let lastPage = component.state.lastPage ? component.state.lastPage : 1;
    return (
        <Link
            className="page-button"
            to={() => {
                let URLParams = new URLSearchParams(component.props.location.search);
                URLParams.set("page", lastPage);
                return component.props.location.pathname + "?" + URLParams.toString();
            }}
            onClick={() => {
                component.props.itemsAreLoading();
                component.setState({page: lastPage});
            }}
        >&#xbb;</Link>
    );
}

function extractNameToFilterBy(text) {
    console.log(text);
    const reg = new RegExp('(?<=^|\\s)[\\p{L}\\w]+(?!\\S)', 'u');
    console.log(reg.exec(text));
    console.log(reg.unicode)
    const arr = text.match(reg) || [];
    console.log(arr);
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
        itemsLoading: state.itemsLoading
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded,
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminCertificates);