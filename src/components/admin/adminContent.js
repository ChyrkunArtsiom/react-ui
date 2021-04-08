import {Component} from "react";
import "../../css/admin/admin-content.css";
import {Route, Switch} from "react-router-dom";
import AdminCertificates from "./certificates/adminCertificates";
import RootAdmin from "./rootAdmin";
import AdminError from "./adminError";
import AdminCertificate from "./certificates/adminCertificate";
import AdminTags from "./tags/adminTags";
import AdminUsers from "./users/adminUsers";
import AdminUser from "./users/adminUser";
import AdminOrders from "./orders/adminOrders";
import AdminOrder from "./orders/adminOrder";

class AdminContent extends Component {
    render() {
        return (
            <div className="admin-content">
                <Switch>
                    <Route exact path="/admin" component={RootAdmin} />
                    <Route exact path="/admin/certificates/:id" component={AdminCertificate} />
                    <Route exact path="/admin/certificates" component={AdminCertificates} />
                    <Route exact path="/admin/tags" component={AdminTags} />
                    <Route exact path="/admin/users/:id" component={AdminUser} />
                    <Route exact path="/admin/users" component={AdminUsers} />
                    <Route exact path="/admin/orders/:id" component={AdminOrder} />
                    <Route exact path="/admin/orders" component={AdminOrders} />
                    <Route exact path="/admin/orders/:userId/order" component={AdminOrders} />
                    <Route component={AdminError} />
                </Switch>
            </div>
        );
    }
}

export default AdminContent;