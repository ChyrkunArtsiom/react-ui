import React, {Component} from "react";
import "../../css/admin/admin-error-page.css";

class AdminError extends Component {
    render() {
        return (
            <div className="admin-error-page-container">
                <div className="admin-error">
                    Page not found
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.title = "Error";
    }
}

export default AdminError;