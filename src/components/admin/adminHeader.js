import React, {Component} from "react";
import '../../css/admin/admin-header.css';
import {bindActionCreators} from "redux";
import {unlogCurrentUserAction} from "../../actions/currentUserAction";
import {connect} from "react-redux";
import {showManageForm} from "../../actions/manageFormAction";
import {deleteItemFromEditForm} from "../../actions/itemToEditAction";

class AdminHeader extends Component {
    logOut() {
        localStorage.removeItem('login');
        localStorage.removeItem('jwt');
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
    }

    render() {
        let addButton = null;

        if (!this.props.location.pathname.includes("admin/users")) {
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
        isLogged: state.isLogged,
        loggedUser: state.loggedUser
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