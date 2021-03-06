import React from "react";
import '../../css/header.css';
import '../../css/react-select-style.css';
import logo_image from '../../images/dehaze-24px.svg';
import favorite_image from '../../images/favorite-24px.svg';
import cart_image from '../../images/shopping_cart-24px.svg';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {currentUserAction, unlogCurrentUserAction} from "../../actions/currentUserAction";
import {itemsAreLoading} from "../../actions/itemsLoadingStatusAction";
import AsyncSelect from 'react-select/async';
import {tagsAreLoading, tagsAreLoaded} from "../../actions/tagsLoadingStatusAction";
import {currentTagsAction, deleteCurrentTagsAction} from "../../actions/currentTagsAction";
import {clearCurrentItemsAction} from "../../actions/currentItemsAction";
import {getTokenFromLocalStorage} from "../localStorageMethods";
import {Dropdown} from "react-bootstrap";
import {cleanItemsAction} from "../../actions/cleanItemsAction";


class Header extends React.Component {
    constructor(props) {
        super(props);
        let URLParams = new URLSearchParams(this.props.location.search);
        this.timeout = 0;
        this.logOut = this.logOut.bind(this);
        this.handleTagSearchChange = this.handleTagSearchChange.bind(this);
        this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadTagsFromSelectInput = this.loadTagsFromSelectInput.bind(this);
        this.timeout = 0;
        this.state = {
            page: 1,
            size: 10,
            name: URLParams.get("name") ? URLParams.get("name") : '',
            loadTags: true
        }
    }

    logOut() {
        localStorage.removeItem('login');
        localStorage.removeItem('jwt');
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        this.props.clearCurrentItemsAction();
    }

    handleChange = event => {
        this.setState({name: event.target.value});
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            let URLParams = new URLSearchParams(this.props.location.search);
            URLParams.delete("name");
            URLParams.delete("page");
            if (event.target.value) {
                URLParams.set("name", event.target.value);
            }
            this.props.history.push('?' + URLParams.toString());
            this.props.clearCurrentItemsAction();
            this.props.itemsAreLoading();
            this.props.cleanItemsAction();
        }, 1000);
    }

    handleTagSearchChange(event) {
        let URLParams = new URLSearchParams(this.props.location.search);
/*        URLParams.delete("name");*/
        URLParams.delete("page");
        URLParams.delete("tag");
        let tags = '';
        console.log("EVENT: ", event);
        if (event.length > 0) {
            event.forEach((t) => tags = tags.concat(t.value).concat(","));
            tags = tags.slice(0, -1);
            URLParams.set("tag", tags);
        }
        this.props.history.push('?' + URLParams.toString());
        this.props.itemsAreLoading();
        this.props.clearCurrentItemsAction();
        this.props.cleanItemsAction();
    }

    loadTags() {
        if (this.state.loadTags) {
            console.log("Loading tags");
            this.loadTagsFromURL();
            this.setState({loadTags: false});
        }

        let tagsUri = `http://localhost:8080/esm/tags?page=${this.state.page}&size=${this.state.size}`;
        console.log(tagsUri);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        this.props.tagsAreLoading();

        fetch(tagsUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header
            }
        }).then(response => {
            if (response.ok) {
                this.loadTagsIntoProps(response.json());
            } else {
                console.error('Error: ', response);
                this.logOut();
                this.props.unlogCurrentUserAction();
            }
        });
    }

    loadTagsFromURL() {
        console.log("LOAD TAGS FROM URL");
        let URLParams = new URLSearchParams(this.props.location.search);
        let listOfTags = URLParams.get("tag");
        if (listOfTags) {
            let tags = listOfTags.split(',');
            tags.forEach((tag) => {
                let tagsUri = `http://localhost:8080/esm/tags?name=${tag}`;
                console.log(tagsUri);

                let authorization_header;
                let token = getTokenFromLocalStorage();
                if (token !== null) {
                    authorization_header = "Bearer ".concat(token);
                }

                this.props.tagsAreLoading();

                fetch(tagsUri, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'en_US',
                        'Authorization': authorization_header
                    }
                }).then(response => {
                    if (response.ok) {
                        this.loadTagsIntoProps(response.json());
                    } else {
                        response.json().then(result => console.log(result));
                        this.logOut();
                        this.props.unlogCurrentUserAction();
                    }
                });
            });
        }
    }

    loadTagsFromSelectInput(inputValue, callBack) {
        console.log("LOAD TAGS FROM SELECT INPUT VALUE");
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (!inputValue) {
            callBack([]);
        }

        const searchedTag = this.props.currentTags.filter(tag => tag.value === inputValue);
        if (searchedTag.length > 0) {
            clearTimeout(this.timeout);
            callBack(searchedTag);
        } else {
            this.timeout = setTimeout(() => {
                let tagsUri = `http://localhost:8080/esm/tags?name=${inputValue}`;
                console.log(tagsUri);

                let authorization_header;
                let token = getTokenFromLocalStorage();
                if (token !== null) {
                    authorization_header = "Bearer ".concat(token);
                }

                this.props.tagsAreLoading();

                fetch(tagsUri, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'en_US',
                        'Authorization': authorization_header
                    }
                }).then(response => {
                    if (response.ok) {
                        response.json().then(result => {
                            if (result._embedded !== undefined) {
                                this.props.currentTagsAction(result._embedded.tags);
                                const searchedTag = this.props.currentTags.filter(tag => tag.value.match(new RegExp(`.*(${inputValue}).*`, 'i')));
                                console.log(searchedTag);
                                callBack(searchedTag);
                            } else {
                                callBack([]);
                            }
                        });
                    } else {
                        callBack([]);
                    }
                });
            }, 1000);
        }
    }

    loadTagsIntoProps(result) {
        result.then(result => {
            if (result._embedded !== undefined) {
                this.props.tagsAreLoaded();
                this.props.currentTagsAction(result._embedded.tags);
            }
        })
    }

    handleScrollToBottom() {
        this.setState({
            page : this.state.page + 1
        });
        this.loadTags();
    }

    render() {
        const log_status_form = [];
        const logout_status_form = [];
        const search_form = [];
        let roles = localStorage.getItem("roles");
        let tagSelect = null;
        let URLParams = new URLSearchParams(this.props.location.search);
        let listOfTags = URLParams.get("tag");
        let chosenTags = [];
        let adminPageButton = null;
        let orderLink;
        let ordersLink;
        if (listOfTags) {
            listOfTags = listOfTags.split(',');
            listOfTags.forEach((tagFromList) => {
                chosenTags = chosenTags.concat(this.props.currentTags.filter((tag) => tag.value === tagFromList));
            });
        }

        if (this.props.isLogged) {
            orderLink = '/orders/create';
            ordersLink = '/orders';
        } else {
            orderLink = '/';
            ordersLink = '/';
        }

        if (this.props.isLogged && this.props.currentTags.length > 0) {
            tagSelect = (
                <div className="custom-select">
                    <AsyncSelect id="header-react-select"
                                 value={chosenTags}
                                 isMulti
                                 defaultOptions={this.props.currentTags}
                                 placeholder="Search by tag"
                                 onChange={this.handleTagSearchChange}
                                 loadOptions={this.loadTagsFromSelectInput}
                                 onInputChange={(newValue) => {
                                     if (!newValue) {
                                         clearTimeout(this.timeout);
                                     }
                                     return newValue;
                                 }}
                                 noOptionsMessage={() => "No such tag found"}
                    />
                </div>
            )
        }

        if (this.props.isLogged) {
            log_status_form.push(
                <a key='log_status' href="#">{this.props.loggedUser}</a>
            );
            logout_status_form.push(
                <Link to='/' key='logout_status'
                      onClick={() => {
                          this.logOut();
                          this.props.unlogCurrentUserAction();
                      }}>Log out</Link>
            );
        } else {
            log_status_form.push(
                <Link key='log_status' to='/'>
                    Login
                </Link>
            );
            logout_status_form.push(
                <Link key='logout_status' to='/signup'>
                    Sign up
                </Link>
            );
        }

        if (this.props.location.pathname === "/certificates") {
            search_form.push(
                <div key='search-container' className="search-container">
                    <div className="search-input">
                        <input type="text"
                               id="search-input-text"
                               placeholder="Search by item name"
                               value={this.state.name}
                               onChange={this.handleChange}
                        />
                    </div>
                    {tagSelect}
                </div>
            )
        }

        if (roles) {
            roles = roles.split(',');
            console.log("ROLES: ", roles);
            if (roles.indexOf("ROLE_ADMIN") > -1) {
                adminPageButton = buttonToAdminPage();
            }
        }

        return (
            <div className="header">
                <div className="logo-container">
                    <div className="logo-img">
                        <Link to='/' onClick={() => this.setState({name: ''})}>
                            <img src={logo_image} alt='Logo'/>
                        </Link>
                    </div>
                    <div className="logo-text">
                        <h1>Logo</h1>
                    </div>
                </div>
                <div className="header-dropdown-menu-container">
                    <Dropdown className="header-dropdown">
                        <Dropdown.Toggle>
                            Pages
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link}
                                           to="/certificates"
                                           onClick={() => {
                                               this.setState({name: ''});
                                               this.setState({loadTags: true});
                                           }}>
                                Certificates
                            </Dropdown.Item>
                            <Dropdown.Item as={Link}
                                           to={ordersLink}
                                           onClick={() => {
                                               this.props.deleteCurrentTagsAction();
                                           }}
                            >
                                Orders
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {adminPageButton}
                {search_form}
                <div className="login-container">
                    <div className="favorites">
                        <a href="#"><img src={favorite_image} alt='favorite'/></a>
                    </div>
                    <div className="basket">
                        <Link to={orderLink}>
                            <img className="test-img" src={cart_image} alt='Logo'/>
                        </Link>
                    </div>
                    <div className="login">
                        {log_status_form}
                    </div>
                    <div className="signup">
                        {logout_status_form}
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        console.log("HEADER DID MOUNT");
        this.checkIfLogged();
        if (this.props.isLogged && this.props.location.pathname === "/certificates") {
            this.loadTags();
            this.setState({loadTags: false});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("HEADER DID UPDATE");
/*        let URLParams = new URLSearchParams(this.props.location.search);
        this.setState({name: URLParams.get("name") ? URLParams.get("name") : '',});*/
        if (this.state.loadTags && this.props.location.pathname === "/certificates" && this.props.isLogged) {
            this.loadTags();
        }
    }

    checkIfLogged() {
        let login = localStorage.getItem('login');
        let jwt = localStorage.getItem('jwt');
        if (login && jwt) {
            this.props.currentUserAction(login);
        }
    }
}

function buttonToAdminPage() {
    return (
        <div className="admin-button-container">
            <a href='/admin' className="to-admin-page-button" >
                Admin page
            </a>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        isLogged: state.isLogged,
        loggedUser: state.loggedUser,
        itemsLoading: state.itemsLoading,
        currentTags: state.currentTags,
        tagsLoadingStatus: state.tagsLoadingStatus,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        unlogCurrentUserAction: unlogCurrentUserAction,
        itemsAreLoading: itemsAreLoading,
        tagsAreLoading: tagsAreLoading,
        tagsAreLoaded: tagsAreLoaded,
        currentTagsAction: currentTagsAction,
        clearCurrentItemsAction: clearCurrentItemsAction,
        currentUserAction: currentUserAction,
        deleteCurrentTagsAction: deleteCurrentTagsAction,
        cleanItemsAction: cleanItemsAction
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);