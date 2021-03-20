import {Component} from "react";
import {Redirect} from "react-router-dom";

class RootAdmin extends Component {
    render() {
        return (
            <Redirect to="/admin/certificates" />
        );
    }
}

export default RootAdmin;