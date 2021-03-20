import {Component} from "react";
import "../../css/admin/admin-error-form.css";
import circle_cross from "../../images/close.svg";
import cross from "../../images/close-cross.svg";

class ErrorForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <div className="error-message">
                    {this.props.error.errorMessage}
                </div>
            );
        }

        return (
          <div className="error-form-container">
            <div className="circle-cross">
                <img src={circle_cross} alt="circle-cross" />
            </div>
              {errorMessage}
              <div className="error-close-button">
                  <img src={cross} alt="close-error" onClick={this.props.onClick()} />
              </div>
          </div>
        );
    }
}

export default ErrorForm;
