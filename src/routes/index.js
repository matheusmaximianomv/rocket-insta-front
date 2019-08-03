import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

import Home from './../pages/Home';
import Feed from './../pages/Feed';
import Post from './../pages/Post';
import Profile from './../pages/Profile';


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                {/* Rotas de Acesso Público */}
                <PublicRoute path='/' exact component={Home}/>
                {/* Rotas Com Autenticação */}
                <PrivateRoute path="/home" exact component={Feed} />
                <PrivateRoute path="/new" exact component={Post} />
                <PrivateRoute path="/profile" exact component={Profile} />
                <Route path='*' exact component={() => <h1>Page Not Found</h1>}/>
            </Switch>
        </BrowserRouter>
    );
}