import React from "react";
import Spinner from 'react-bootstrap/Spinner'
import "../../css/certificates.css"
import {ToBottomButton, ToTopButton} from "./list-buttons";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {clearCurrentItemsAction, currentItemsAction} from "../../actions/currentItemsAction";
import {itemsAreLoaded, itemsAreLoading} from "../../actions/itemsLoadingStatusAction";
import CertificateItem from "./certificateItem";

class Certificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollPosition: 0,
            size: 20,
            onScroll: false
        }

        this.manageButtons = this.manageButtons.bind(this);
        this.onTopButtonClick = this.onTopButtonClick.bind(this);
        this.onBottomButtonClick = this.onBottomButtonClick.bind(this);
        this.loadCertificates = this.loadCertificates.bind(this);
    }

    render() {
        console.log("Certificates render");
        const loading = this.props.itemsLoading;
        const items = this.props.currentItems;
        let spinner = null;

        console.log("Loading status in render: ", loading);
        if (loading) {
            spinner = [<div key="spinner-container" className="spinner-container" />,
                <Spinner key="certificate-spinner" className="certificate-spinner" animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>];
        }

        if (items !== undefined) {
            return [
                <div key="content-container"
                     className='content-container'
                     onScroll={() => {
                         this.manageButtons();
                         this.checkHeight();
                     }}
                >
                    <ToTopButton key="to-top" onClick={this.onTopButtonClick}/>
                    <ToBottomButton key="to-bottom" onClick={this.onBottomButtonClick}/>
                    {
                        items.map((item, index) => {
                            if (index < items.length)
                                return <CertificateItem key={item.name} item={item}/>
                            else {
                                return null;
                            }
                        })
                    }
                </div>,
                spinner
            ];
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Certificates componentDidUpdate started");

        if (this.props.itemsLoading === true && prevProps.itemsLoading !== this.props.itemsLoading) {
            this.loadCertificates();
        }
/*        console.log("ComponentDidUpdate finished");*/
    }

    componentDidMount() {
        console.log('Certificates componentDidMount started');
        this.loadCertificates();
/*        console.log('Certificate component did mount finished');*/
    }

    componentWillUnmount() {
        this.props.clearCurrentItemsAction();
    }

    manageButtons() {
        const container = document.querySelector('div.content-container');
        const topButton = document.getElementById("to-top");
        const downButton = document.getElementById("to-bottom");

        if (container.scrollTop > 20) {
            topButton.style.display = "block";
            downButton.style.display = "none";
        } else {
            topButton.style.display = "none";
        }
    }

    checkHeight() {
        console.log("CHECK HEIGHT");
        const container = document.querySelector('div.content-container');
        const URLParams = new URLSearchParams(this.props.location.search);
        URLParams.set("scroll", container.scrollTop.toString());

        if (container.scrollHeight - container.scrollTop === container.clientHeight && container.scrollTop !== 0) {
            let page = Number.parseInt(URLParams.get("page"));
            if (!isNaN(page) && page > 1) {
                page = page + 1;
            } else {
                page = 2;
            }

            URLParams.set("page", page);

            this.props.history.push('?' + URLParams.toString());
            this.setState({onScroll: true});
            this.props.itemsAreLoading();
        }
        this.props.history.push('?' + URLParams.toString());
    }

    onTopButtonClick() {
        const container = document.querySelector('div.content-container');
        const topButton = document.getElementById("to-top");
        const downButton = document.getElementById("to-bottom");

        this.setState({scrollPosition: container.scrollTop})
        container.scroll(0, 0);
        downButton.style.display = "block";
        topButton.style.display = "none";
    }

    onBottomButtonClick() {
        const container = document.querySelector('div.content-container');
        const topButton = document.getElementById("to-top");

        this.setState({scrollPosition: container.scrollTop})
        container.scroll(0, this.state.scrollPosition)
        topButton.style.display = "none";
    }

    loadCertificates() {
        let URLParams = new URLSearchParams(this.props.location.search);
        let lastPage = Number.parseInt(URLParams.get("page"));
        let firstPage = 1;
        if (isNaN(lastPage) || lastPage <= 1) {
            lastPage = 1;
        }
        if (this.state.onScroll) {
            firstPage = lastPage;
            this.setState({onScroll: false});
        }

        this.loadOnePage(firstPage, lastPage);
    }

    loadOnePage(currentPage, lastPage) {
        let certificatesUri = buildCertificatesURL(this, currentPage);

        fetch(certificatesUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
            }
        }).then(response => {
            if (response.ok) {
                this.loadCertificatesIntoProps(response.json()).then(() => {
                    console.log("CURRENT PAGE: ", currentPage);
                    console.log("LAST PAGE: ", lastPage);
                    if (currentPage < lastPage) {
                        this.loadOnePage(currentPage + 1, lastPage);
                    } else {
                        console.log("SCROLL!!!!");
                        scrollToPosition(this);
                    }
                })

            } else {
                this.props.itemsAreLoaded();
                scrollToPosition(this);
                if (currentPage > 1) {
                    const URLParams = new URLSearchParams(this.props.location.search);
                    URLParams.set("page", (currentPage - 1).toString());
                    this.props.history.push('?' + URLParams.toString());
                }
            }
        });
    }

    loadCertificatesIntoProps(result) {
        return result.then(result => {
            console.log('Certificates are loaded');
            if (result._embedded !== undefined) {
                console.log("Result: ", result._embedded.certificates);
                this.props.itemsAreLoaded();
                this.props.currentItemsAction(result._embedded.certificates);
            }
        })
    }
}

function buildCertificatesURL(component, page) {
    let URLParams = new URLSearchParams(component.props.location.search);
    console.log("URL: ", URLParams.toString());
    let nameParam = null;
    let tagsParam = '';
    if (URLParams.get("name")) {
        nameParam = URLParams.get("name");
    }
    if (URLParams.get("tag")) {
        tagsParam = '&tag='.concat(URLParams.get("tag"));
    }
    let certificatesUri = `http://localhost:8080/esm/certificates?page=${page}&size=${component.state.size}&name=${nameParam ? nameParam : ''}${tagsParam}`;
    console.log("URI: ", certificatesUri);
    return certificatesUri;
}

function scrollToPosition(component) {
    const URLParams = new URLSearchParams(component.props.location.search);
    const container = document.querySelector('div.content-container');
    console.log("CLIENT HEIGHT: ", container.clientHeight);
    console.log("SCROLL TOP: ", container.scrollTop);
    console.log("SCROLL HEIGHT: ", container.scrollHeight);
    console.log("SCROLL: ", Number.parseInt(URLParams.get("scroll")));
    if (Number.parseInt(URLParams.get("scroll")) + container.clientHeight < container.scrollHeight) {
        container.scroll(0, Number.parseInt(URLParams.get("scroll")));
    }
}

function mapStateToProps(state) {
    return {
        currentItems: state.currentItems,
        itemsLoading: state.itemsLoading
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        currentItemsAction: currentItemsAction,
        itemsAreLoading: itemsAreLoading,
        itemsAreLoaded: itemsAreLoaded,
        clearCurrentItemsAction: clearCurrentItemsAction
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Certificates);
