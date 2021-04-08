import {Component} from "react";
import check from "../../images/success-green-check-mark.svg";
import cross from "../../images/cross-green.svg";
import "../../css/admin/admin-info-form.css";
import {Link} from "react-router-dom";

class InfoForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = '';
        let link = '';
        let action = '';

        switch (this.props.type) {
            case 'certificate': {
                item = "Certificate ";
                break;
            }
            case 'tag': {
                item = "Tag ";
                break;
            }
            case 'order': {
                item = "Order ";
                break;
            }
            default: {
            }
        }

        switch (this.props.action) {
            case 'create': {
                switch (this.props.type) {
                    case 'certificate': {
                        link = <Link className="info-link-style" to={`certificates/${this.props.item.id}`}>№{this.props.item.id}</Link>;
                        break;
                    }
                    case 'tag': {
                        link = `№${this.props.item.id}`;
                        break;
                    }
                    case 'order': {
                        link = <Link className="info-link-style" to={`/admin/orders/${this.props.item.id}`}>№{this.props.item.id}</Link>;
                        break;
                    }
                    default: {
                    }
                }
                action = " is successfully created.";
                break;
            }
            case 'edit': {
                switch (this.props.type) {
                    case 'certificate': {
                        link = <Link className="info-link-style" to={`certificates/${this.props.item.id}`}>№{this.props.item.id}</Link>;
                        break;
                    }
                    case 'order': {
                        link = <Link className="info-link-style" to={`/admin/orders/${this.props.item.id}`}>№{this.props.item.id}</Link>;
                        break;
                    }
                    default: {
                    }
                }
                action = " is successfully updated.";
                break;
            }
            case 'delete': {
                link = `№${this.props.item.id}`;
                action = " is successfully deleted."
                break;
            }
            default: {
            }
        }

        let infoMessage = (
            <div className="info-message">
                {item}{link}{action}
            </div>
        )

        return (
            <div className="info-form-container">
                <div className="circle-cross">
                    <img src={check} alt="circle-cross" />
                </div>
                {infoMessage}
                <div className="info-close-button">
                    <img src={cross} alt="close-info" onClick={this.props.onClick()} />
                </div>
            </div>
        );
    }
}

export default InfoForm;