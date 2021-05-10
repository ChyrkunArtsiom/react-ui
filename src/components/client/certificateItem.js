import React, {Component} from "react";
import {Link} from "react-router-dom";
import favorite_image from "../../images/favorite-24px.svg";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class CertificateItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddButton: true
        }
    }

    render() {
        let addButton = null;
        let deleteButton = null;

        if (this.props.isLogged) {
            addButton = (
                this.state.showAddButton &&
                <button className="add-button"
                        onClick={() => this.saveCertificateToOrder(this.props.item.id)}>
                    Add to order
                </button>
            );
            deleteButton = (
                !this.state.showAddButton &&
                <button className="add-button"
                        onClick={() => this.deleteCertificateFromOrder(this.props.item.id)}>
                    Delete from order
                </button>
            );
        }

        return (
            <div className="coupon-item">
                <div className="coupon-img" />
                <div className="coupon-text">
                    <div className="coupon-name">
                        <Link
                            to={`/certificates/${this.props.item.id}`}
                        >
                            <h1>{this.props.item.name}</h1>
                        </Link>
                        <div className="favorites-item">
                            <a href="#"><img key={`CouponItemFavImg${this.props.item.name}`} src={favorite_image} alt='favorite'/></a>
                        </div>
                    </div>
                    <p className="coupon-short-description">{this.props.item.description}</p>
                    <p className="created-date">Created: {new Date(this.props.item.createDate).toLocaleDateString()}</p>
                    <div className="coupon-item-bottom">
                        <h1>${this.props.item.price}</h1>
                        {
                            addButton
                        }
                        {
                            deleteButton
                        }
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const savedCertificates = localStorage.getItem("savedCertificates");
        if (savedCertificates) {
            let arr = savedCertificates.split(',').map(e => +e);
            if (arr.indexOf(this.props.item.id) !== -1) {
                this.setState({showAddButton: false});
            }
        }
    }

    saveCertificateToOrder(id) {
        const savedCertificates = localStorage.getItem("savedCertificates");
        let certificates = [];
        if (savedCertificates) {
            certificates = savedCertificates.split(',');
        }
        certificates.push(id);
        localStorage.setItem("savedCertificates", certificates.join(','));
        this.setState({showAddButton: false});
    }

    deleteCertificateFromOrder(id) {
        const savedCertificates = localStorage.getItem("savedCertificates");
        if (savedCertificates) {
            let arr = savedCertificates.split(',').map(e => +e);
            const index = arr.indexOf(id);
            if (index > -1) {
                arr.splice(index, 1);
                localStorage.setItem("savedCertificates", arr.join(','));
                this.setState({showAddButton: true});
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        isLogged: state.isLogged
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(CertificateItem);