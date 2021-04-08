import {Link} from "react-router-dom";
import React from "react";

export function buildPageButtons(component, page) {
    let buttons = [];
    for (let iteratedPage = page - 2; iteratedPage <= page + 2; iteratedPage++) {
        if (iteratedPage >= 1 && iteratedPage <= component.state.lastPage) {
            let button = (
                <Link
                    key={`button-${iteratedPage}`}
                    className={component.state.page === iteratedPage ? "current-page-button" : "page-button"}
                    to={() => {
                        let URLParams = new URLSearchParams(component.props.location.search);
                        URLParams.set("page", iteratedPage);
                        return component.props.location.pathname + "?" + URLParams.toString();
                    }}
                    onClick={() => {
                        component.props.itemsAreLoading();
                        component.setState({page: iteratedPage});
                        if (component.state.showInfo) {
                            component.closeInfoForm();
                        }
                    }}
                >{iteratedPage}</Link>
            );
            buttons.push(button);
        }
    }
    return buttons;
}

export function buildLastPageButton(component) {
    let lastPage = component.state.lastPage ? component.state.lastPage : 1;
    return (
        <Link
            className="page-button"
            to={() => {
                let URLParams = new URLSearchParams(component.props.location.search);
                URLParams.set("page", lastPage);
                return component.props.location.pathname + "?" + URLParams.toString();
            }}
            onClick={() => {
                component.props.itemsAreLoading();
                component.setState({page: lastPage});
                console.log(component.showInfo);
                if (component.state.showInfo) {
                    component.closeInfoForm();
                }
            }}
        >&#xbb;</Link>
    );
}