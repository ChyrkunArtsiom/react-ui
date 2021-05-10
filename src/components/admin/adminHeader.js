import React, {Component} from "react";
import '../../css/admin/admin-header.css';
import {bindActionCreators} from "redux";
import {unlogCurrentUserAction} from "../../actions/currentUserAction";
import {connect} from "react-redux";
import {showManageForm} from "../../actions/manageFormAction";
import {deleteItemFromEditForm} from "../../actions/itemToEditAction";
import {Dropdown} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import addButtonVisibilityStatus from "../../reducers/addButtonVisibilityStatus";

class AdminHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToClient: false
        }
    }


    logOut() {
        localStorage.removeItem('login');
        localStorage.removeItem('jwt');
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
    }

    render() {
        let addButton = null;

        if (this.state.redirectToClient) {
            return <Redirect to="/" />;
        }

        if (this.props.addButtonVisibilityStatus) {
            addButton = (
                <div className="admin-add-new-button-container">
                    <button className="admin-add-new-button" onClick={() => {
                        this.props.showManageForm();
                        this.props.deleteItemFromEditForm();
                    }}>
                        Add new
                    </button>
                </div>
            );
        }

        return (
            <div className="admin-header">
                <div className="admin-logo-container">
                    Admin UI
                </div>
                <div className="header-admin-dropdown-menu-container">
                    <Dropdown className="admin-header-dropdown">
                        <Dropdown.Toggle>
                            Pages
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link}
                                           to="/admin/certificates">
                                Certificates
                            </Dropdown.Item>
                            <Dropdown.Item as={Link}
                                           to="/admin/orders">
                                Orders
                            </Dropdown.Item>
                            <Dropdown.Item as={Link}
                                           to="/admin/users">
                                Users
                            </Dropdown.Item>
                            <Dropdown.Item as={Link}
                                           to="/admin/tags">
                                Tags
                            </Dropdown.Item>
                            <Dropdown.Item href="/">
                                Back to Client
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {addButton}
                <div className="admin-login-container">
                    <div className="admin-login-status">
                        <a href="#">{this.props.loggedUser}</a>
                    </div>
                    <div className="admin-logout">
                        <a href='/'
                           onClick={() => {
                               this.logOut();
                               this.props.unlogCurrentUserAction();
                           }}>
                            Log out
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedUser: state.loggedUser,
        addButtonVisibilityStatus: state.addButtonVisibilityStatus
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        unlogCurrentUserAction: unlogCurrentUserAction,
        showManageForm: showManageForm,
        deleteItemFromEditForm: deleteItemFromEditForm
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminHeader);