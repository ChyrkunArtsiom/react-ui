import {Component} from "react";
import cart_image from '../../images/shopping_cart-24px.svg';
import '../../css/certificate.css';

class Certificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificate: null,
            error: null,
            showAddButton: true
        }
    }

    render() {
        let error = this.state.error;
        let certificate = this.state.certificate;

        if (error) {
            return (
                <div className="item-container">
                    <div className="certificate-error">
                        Certificate not found
                    </div>
                </div>
            );
        }
        if (certificate) {
            let tags = certificate.tags.map((tag) => tag.name);
            tags = tags.join(', ');
            return (
                <div className="item-container">
                    <div className="item-head">
                        <div className="item-img">
                        </div>
                        <div className="item-details">
                            <div className="item-text">
                                <h1 className="coupon-name">{certificate.name}</h1>
                                <p className="coupon-description">{certificate.description}</p>
                            </div>
                            <div className="time-container">
                                <p className="created-date">Created: {new Date(certificate.createDate).toLocaleDateString()}</p>
                                <p className="updated-date">Updated: {certificate.lastUpdateDate ? new Date(certificate.lastUpdateDate).toLocaleDateString() : null}</p>
                                <p className="duration">Duration: {certificate.duration}</p>
                                <p>Tags: {tags}</p>
                            </div>
                            <div className="item-bottom">
                                <h1 className="price">${certificate.price}</h1>
                                {
                                    this.state.showAddButton ?
                                        <button className="add-to-cart" onClick={() => this.saveCertificateToOrder(this.props.match.params.id)}>
                                            <span className="add-to-cart-text">Add to order</span>
                                            <img className="basket-img" src={cart_image} alt="cart" />
                                        </button> :
                                        <button className="add-to-cart" onClick={() => this.deleteCertificateFromOrder(this.props.match.params.id)}>
                                            <span className="add-to-cart-text">Delete from order</span>
                                            <img className="basket-img" src={cart_image} alt="cart" />
                                        </button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return null;
    }

    componentDidMount() {
        const savedCertificates = localStorage.getItem("savedCertificates");
        if (savedCertificates) {
            let arr = savedCertificates.split(',');
            if (arr.indexOf(this.props.match.params.id) > -1) {
                this.setState({showAddButton: false});
            }
        }

        let tagsUri = `http://localhost:8080/esm/certificates/${this.props.match.params.id}`;
        console.log(tagsUri);
        fetch(tagsUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US'
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => this.setState({certificate: result}));
            } else {
                response.json().then((result) => this.setState({error: result}));
                console.error('Error: ');
            }
        });
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
            let arr = savedCertificates.split(',');
            const index = arr.indexOf(id);
            if (index > -1) {
                arr.splice(index, 1);
                localStorage.setItem("savedCertificates", arr.join(','));
                this.setState({showAddButton: true});
            }
        }
    }
}

export default Certificate;