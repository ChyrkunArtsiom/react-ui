import {Component} from "react";
import {bindActionCreators} from "redux";
import {hideManageForm} from "../../../actions/manageFormAction";
import {connect} from "react-redux";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import "../../../css/admin/admin-manage-tag.css";
import {itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";

class AdminManageTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            error: ''
        }
        this.createTag = this.createTag.bind(this);
    }

    render() {
        let header = "Add New Tag";

        return (
            <div className="manage-tag-container">
                <div className="manage-tag-header">
                    {header}
                </div>
                <form className="manage-tag-form" onSubmit={(event) => {
                    this.createTag(event);
                }}>
                    <div className="manage-tag-row">
                        <label htmlFor="inputTitle"
                               className="manage-tag-label">
                            Name
                        </label>
                        <input type="text"
                               id="inputTitle"
                               className="manage-tag-input"
                               required
                               maxLength="45"
                               value={this.state.title}
                               onChange={event => this.setState({title: event.target.value})}
                        />
                    </div>
                    <div className="manage-tag-row error-text">
                        {this.state.error.errorMessage}
                    </div>
                    <div className="manage-tag-row manage-tag-buttons">
                        <input className="manage-tag-save-button" type="submit" value="Save"/>
                        <input className="manage-tag-cancel-button" type="button" value="Cancel" onClick={() => this.props.hideManageForm()}/>
                    </div>
                </form>
            </div>
        )
    }

    createTag(event) {
        event.preventDefault();

        let tagsUri = `http://localhost:8080/esm/tags`;
        console.log(tagsUri);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }


        let data = {
            name: this.state.title
        }

        fetch(tagsUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                console.log("success");
                response.json().then(result => {
                    this.props.itemsAreLoading();
                    this.props.hideManageForm();
                    this.props.onCreate(result);
                });
            } else {
                response.json().then((result) => this.setState({error: result}));
            }
        });
    }
}

function mapStateToProps(state) {
    return {
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        hideManageForm: hideManageForm,
        itemsAreLoading: itemsAreLoading
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminManageTag);