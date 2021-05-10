import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import ReactDOM from 'react-dom';
import ClientContainer from "./components/clientContainer";
import store from './components/store';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import AdminContainer from "./components/admin/adminContainer";

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <BrowserRouter>
              <Switch>
                  <Route path='/admin' component={AdminContainer} />
                  <Route path='/' component={ClientContainer} />
              </Switch>
          </BrowserRouter>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
