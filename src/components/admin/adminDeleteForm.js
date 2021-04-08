import {Component} from "react";
import "../../css/admin/admin-delete-item.css";

class AdminDeleteForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let type = '';

        switch (this.props.type) {
            case 'certificate': {
                type = 'certificate';
                break;
            }
            case 'tag': {
                type = 'tag';
                break;
            }
            case 'order': {
                type = 'order';
                break;
            }
            default:
        }

        return (
            <div className="delete-item-container">
                <div className="delete-item-header">
                    Delete confirmation
                </div>
                <div className="delete-item-content">
                    Do you really want to delete {type} with id = {this.props.item}?
                </div>
                <div className="delete-item-buttons">
                    <button className="delete-item-yes-button" onClick={this.props.onDelete}>Yes</button>
                    <button className="delete-item-cancel-button" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default AdminDeleteForm;