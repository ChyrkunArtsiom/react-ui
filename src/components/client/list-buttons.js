import React from "react";

export function ToTopButton(props) {
    return <button id="to-top" className="to-top" title="Go to top" onClick={props.onClick}/>;
}

export function ToBottomButton(props) {
    return <button id="to-bottom" className="to-bottom" title="Go to bottom" onClick={props.onClick}/>;
}

export function AddButton(props) {
    return <button id="add-order-button" className="add-order-button" title="Add" onClick={props.onClick}/>;
}