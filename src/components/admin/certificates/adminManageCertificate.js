import {Component} from "react";
import "../../../css/admin/admin-manage-certificate.css";
import CreatableSelect from 'react-select/creatable';
import {bindActionCreators} from "redux";
import {itemsAreLoading} from "../../../actions/itemsLoadingStatusAction";
import {hideManageForm} from "../../../actions/manageFormAction";
import {connect} from "react-redux";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import {convertTagsForReactSelect} from "../../../reducers/currentTagsReducer";
import {deleteItemFromEditForm} from "../../../actions/itemToEditAction";

class AdminManageCertificate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title: props.item ?  props.item.name : '',
            description: props.item ? props.item.description : '',
            duration: props.item ? props.item.duration : '',
            price: props.item ? props.item.price : '',
            tags: props.item ? convertTagsForReactSelect(props.item.tags) : [],
            error: ''
        }
        this.addTags = this.addTags.bind(this);
        this.createCertificate = this.createCertificate.bind(this);
        this.editCertificate = this.editCertificate.bind(this);
    }

    render() {
        let header;
        let isTitleInputDisabled = '';
        if (this.props.item) {
            header = `Edit certificate with name = ${this.props.item.name}`;
            isTitleInputDisabled = 'disabled';
        } else {
            header = "Add New Certificate";
        }

        return (
            <div className="manage-certificate-container">
                <div className="manage-certificate-header">
                    {header}
                </div>
                <form className="manage-certificate-form" onSubmit={(event) => {
                    if (this.props.item) {
                        this.editCertificate(event);
                    } else {
                        this.createCertificate(event);
                    }
                }}>
                    <div className="manage-certificate-row">
                        <label htmlFor="inputTitle"
                               className="manage-certificate-label">
                            Title
                        </label>
                        <input type="text"
                               id="inputTitle"
                               className="manage-certificate-input"
                               disabled={isTitleInputDisabled}
                               required
                               maxLength="45"
                               value={this.state.title}
                               onChange={event => this.setState({title: event.target.value})}
                        />
                    </div>
                    <div className="manage-certificate-row">
                        <label htmlFor="inputDescription"
                               className="manage-certificate-label">
                            Description
                        </label>
                        <textarea required
                                  maxLength="45"
                                  id="inputDescription"
                                  className="manage-certificate-textarea"
                                  value={this.state.description}
                                  onChange={event => this.setState({description: event.target.value})}
                        />
                    </div>
                    <div className="manage-certificate-row">
                        <label htmlFor="inputDuration"
                               className="manage-certificate-label">
                            Duration
                        </label>
                        <input type="number"
                               id="inputDuration"
                               className="manage-certificate-input"
                               required
                               min="0"
                               value={this.state.duration}
                               onChange={event => this.setState({duration: event.target.value})}
                        />
                    </div>
                    <div className="manage-certificate-row">
                        <label htmlFor="inputTitle"
                               className="manage-certificate-label">
                            Price
                        </label>
                        <input type="number"
                               id="inputPrice"
                               step="0.01"
                               className="manage-certificate-input"
                               required
                               min="0"
                               value={this.state.price}
                               onChange={event => this.setState({price: event.target.value})}
                        />
                    </div>
                    <div className="manage-certificate-row">
                        <label htmlFor="inputTags"
                               className="manage-certificate-label">
                            Tags
                        </label>
                        <div className="manage-certificate-input-select">
                            <CreatableSelect
                                id="inputTags"
                                isMulti
                                className="manage-certificate-select"
                                value={this.state.tags}
                                onChange={this.addTags}
                                placeholder="Enter tags..."
                            />
                        </div>
                    </div>
                    <div className="manage-certificate-row error-text">
                        {this.state.error.errorMessage}
                    </div>
                    <div className="manage-certificate-row manage-certificate-buttons">
                        <input className="manage-certificate-save-button" type="submit" value="Save"/>
                        <input className="manage-certificate-cancel-button" type="button" value="Cancel" onClick={() => this.props.hideManageForm()}/>
                    </div>
                </form>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.item && !this.props.item) {
            this.setState({
                title: '',
                description: '',
                duration: '',
                price: '',
                tags: [],
            })
        }
    }

    componentWillUnmount() {
        this.props.deleteItemFromEditForm();
    }

    addTags(event) {
        const result = event.filter(word => word.label.length > 3 && word.label.length < 16);
        this.setState({tags: result});
    }

    createCertificate(event) {
        event.preventDefault();

        let certificatesURI = `http://localhost:8080/esm/certificates`;
        console.log(certificatesURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        let tags = [];
        this.state.tags.forEach((element) => tags.push({name: element.value}));

        let data = {
            name: this.state.title,
            description: this.state.description,
            price: Number.parseFloat(this.state.price),
            duration: Number.parseInt(this.state.duration),
            tags: tags
        }

        fetch(certificatesURI, {
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

    editCertificate(event) {
        event.preventDefault();

        let certificatesURI = `http://localhost:8080/esm/certificates`;
        console.log(certificatesURI);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        let tags = [];
        this.state.tags.forEach((element) => tags.push({name: element.value}));

        let data = {
            name: this.state.title,
            description: this.state.description,
            price: Number.parseFloat(this.state.price),
            duration: Number.parseInt(this.state.duration),
            tags: tags
        }

        fetch(certificatesURI, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                response.json().then(
                    result => {
                        this.props.itemsAreLoading();
                        this.props.hideManageForm();
                        this.props.onCreate(result);
                    },
                    () => {
                        this.props.itemsAreLoading();
                        this.props.hideManageForm();
                        this.props.onEdit(this.props.item);
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
        itemsAreLoading: itemsAreLoading,
        deleteItemFromEditForm: deleteItemFromEditForm
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminManageCertificate);