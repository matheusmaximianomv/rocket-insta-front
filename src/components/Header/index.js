import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { logout } from './../../services/auth';

import './header.css';

import logo from './../../assets/img/logo.svg';
import camera from './../../assets/img/camera.svg';
import user from './../../assets/img/icons insta.svg'
import logout_icon from './../../assets/img/logout.png'

export default class Header extends Component {

    handleLogout = () => {
        logout();
        window.location.reload();
    }

    render() {
        return (
            <header id="main-header">
                <div className="header-content">
                    <Link to="/home">
                        <img src={logo} alt="RocketInsta" title="Home" />
                    </Link>
                    <div className="header-navigation">
                        <Link to="/new">
                            <img src={camera} alt="Enviar Publicação" title="Postar" />
                        </Link>
                        <Link to="/profile">
                            <img src={user} alt="Perfil" title="Perfil" />
                        </Link>
                        <Link to="" onClick={this.handleLogout}>
                            <img src={logout_icon} className="logout" alt="Logout" title="Sair" />
                        </Link>
                    </div>
                </div>
            </header>
        );
    }
}