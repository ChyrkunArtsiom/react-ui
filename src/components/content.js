import React from "react";
import LoginForm from "./client/login";
import {Switch, Route} from "react-router-dom";
import Certificates from "./client/certificates";
import ErrorPage from "./client/error";
import Certificate from "./client/certificate";
import Orders from "./client/orders";
import Order from "./client/order";
import CreateOrder from "./client/create-order";

class Content extends React.Component {
    render() {
        return (
            <div className='content'>
                <Switch>
                    <Route exact path='/' component={LoginForm} />
                    <Route path="/certificates/:id" component={Certificate} />
                    <Route path="/certificates" component={Certificates} />
                    <Route path="/orders/create" component={CreateOrder} />
                    <Route path="/orders/:id" component={Order} />
                    <Route path="/orders" component={Orders} />
                    <Route component={ErrorPage} />
                </Switch>
            </div>
        )
    }
}

export default Content;