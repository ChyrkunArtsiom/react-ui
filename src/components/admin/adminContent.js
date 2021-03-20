import {Component} from "react";
import "../../css/admin/admin-content.css";
import {Route, Switch} from "react-router-dom";
import AdminCertificates from "./adminCertificates";
import RootAdmin from "./rootAdmin";
import AdminError from "./adminError";
import AdminCertificate from "./adminCertificate";

class AdminContent extends Component {
    render() {
        return (
            <div className="admin-content">
                <Switch>
                    <Route exact path="/admin" component={RootAdmin} />
                    <Route exact path="/admin/certificates/:id" component={AdminCertificate} />
                    <Route exact path="/admin/certificates" component={AdminCertificates} />
                    <Route component={AdminError} />
                </Switch>
            </div>
        );
    }
}

export default AdminContent;