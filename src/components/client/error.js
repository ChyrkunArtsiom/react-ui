import React from "react";
import '../../css/error-page.css';

class ErrorPage extends React.Component {
    render() {
        return (
            <div className="error-page-container">
                <div className="error">
                    Page not found
                </div>
            </div>
        )
    }
}

export default ErrorPage;