import {Component} from "react";
import "../../css/order.css";
import {getTokenFromLocalStorage} from "../localStorageMethods";

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
            error: null
        }
    }

    render() {
        let error = this.state.error;
        let order = this.state.order;

        if (error) {
            return (
                <div className="item-container">
                    <div className="order-error">
                        Order not found
                    </div>
                </div>
            );
        }
        if (order) {
            return (

                    <div className="content-container order-content-container">
                        <div className="order-header">
                            Order details
                        </div>
                        <div className="order-container">
                            <div className="order-inner-header">
                                <h1 className="order-id">Order number: {order.id}</h1>
                                <p className="order-purchase-date">Purchased: {new Date(order.purchaseDate).toLocaleDateString()}</p>
                            </div>
                            {
                                order.certificates.map((certificate) => (
                                    <div key={certificate.name} className="order-row">
                                        <div className="order-content">
                                            <h1 className="order-name">{certificate.name}</h1>
                                            <p className="order-description">{certificate.description}</p>
                                        </div>
                                        <h1 className="order-price">${certificate.price}</h1>
                                    </div>
                                ))
                            }
                            <div className="total-price-container">
                                <h1 className="total">Total</h1>
                                <h1 className="total-price">${order.cost}</h1>
                            </div>
                        </div>
                    </div>

            )
        }
        return null;
    }

    componentDidMount() {
        let tagsUri = `http://localhost:8080/esm/orders/${this.props.match.params.id}`;
        console.log(tagsUri);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(tagsUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => this.setState({order: result}));
            } else {
                response.json().then((result) => this.setState({error: result}));
                console.error('Error: ');
            }
        });
    }
}

export default Order;