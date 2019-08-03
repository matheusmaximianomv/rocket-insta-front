import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import api from './../../services/api';
import { login } from './../../services/auth';

import logo from './../../assets/img/logo.svg';

import './home.css';

export default class Home extends Component {
    state = {
        withAccount: true
    }

    handleChangePage = () => {
        this.setState({ withAccount: !this.state.withAccount });
    }

    render() {

        const { withAccount } = this.state;

        return (
            <div>
                <header id="main-header">
                    <div className="header-content">
                        <Link to="/">
                            <img src={logo} alt="RocketInsta" title="Home" />
                        </Link>
                    </div>
                </header>
                <section className="main-section">
                    <img src={logo} alt="Instagram" />
                    {withAccount ?
                        <p>Entre para testar um projeto desenvolvido com intuito de aprendizagem.</p> :
                        <p>Cadastre-se para testar um projeto desenvolvido com intuito de aprendizagem.</p>
                    }
                    {withAccount ? <Login /> : <Signup />}
                </section>
                <section className="info">
                    {withAccount ? <p>Não tem uma conta? <span onClick={this.handleChangePage}>Cadastre-se</span></p> : <p>Tem uma conta? <span onClick={this.handleChangePage}>Conecte-se</span></p>
                    }
                </section>
                <footer id="main-footer">
                    <div className="footer-content">
                        <p>Aplicação desenvolvida com intuito de aprendizagem, todos os direitos resevados a <a href="https://www.instagram.com/?hl=pt-br" target="_blank" rel="noopener noreferrer">&copy; Instagram</a>.</p>
                    </div>
                </footer>
            </div>
        );
    }
}

class Login extends Component {

    state = {
        email: '',
        password: '',

        error: false,
        errorMessage: '',

        buttonDisabled: true
    }

    handleChange = async (event) => {
        await this.setState({ [event.target.name]: event.target.value });

        const { email, password } = this.state;

        if (email && password.length > 7)
            this.setState({ buttonDisabled: false });
        else if (!email || password.length < 8)
            this.setState({ buttonDisabled: true });

        return;
    }

    handleSubmit = async (event) => {
        event.preventDefault(event);
        this.setState({ error: false });

        const { email, password } = this.state;

        const regEmail = new RegExp(/^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/);

        if (!regEmail.test(email))
            return this.setState({ error: true, errorMessage: 'Email Mal Formatado.' });

        if (password.length < 8)
            return this.setState({ error: true, errorMessage: 'Senha Insuficiente.' });

        const data = new FormData();

        data.append('email', email);
        data.append('password', password);

        try {
            const response = await api.post('/users/signin', data);
            login(response.data.token);
            window.location.assign('/home');
        } catch (error) {
            const erroAxios = error;
            const fail = erroAxios.response.data.erro.description || erroAxios.response.data;
            this.setState({ error: true, errorMessage: fail });
        }

        return;
    }

    render() {

        const { email, password, error, errorMessage, buttonDisabled } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    value={email}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    onChange={this.handleChange}
                    value={password}
                />
                {error ? <span>{errorMessage}</span> : null}
                <button type="submit" disabled={buttonDisabled}>Entrar</button>
            </form>
        );
    }
}

class Signup extends Component {

    state = {
        name: '',
        email: '',
        password: '',

        success : false,
        successMessage : '',
        error: false,
        errorMessage: '',

        buttonDisabled: true
    }

    handleChange = async (event) => {
        await this.setState({ [event.target.name]: event.target.value });

        const { name, email, password } = this.state;

        if (name && email && password.length > 7)
            this.setState({ buttonDisabled: false });
        else if (!name || !email || password.length < 8)
            this.setState({ buttonDisabled: true });

        return;
    }

    handleSubmit = async (event) => {
        event.preventDefault(event);
        this.setState({ error: false });

        const { name, email, password } = this.state;

        const regEmail = new RegExp(/^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/);

        if (name.length < 5)
            return this.setState({ error: true, errorMessage: 'Digite seu nome e sobrenome.' });

        if (!regEmail.test(email))
            return this.setState({ error: true, errorMessage: 'Email mal formatado.' });

        if (password.length < 8)
            return this.setState({ error: true, errorMessage: 'Senha com carateres insuficiente.' });
        
        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('password', password);

        try {
            await api.post('/users/signup', data);
            this.setState({success : true, successMessage : 'Sua conta foi criada com sucesso.'});
            setTimeout(() => window.location.reload(), 3000); 
        } catch (error) {
            const erroAxios = error;
            const fail = erroAxios.response.data.erro.description || erroAxios.response.data;
            this.setState({ error : true, errorMessage : fail});
        }

        return;

    }

    render() {

        const { name, email, password, error, errorMessage, success, successMessage, buttonDisabled } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    onChange={this.handleChange}
                    value={name}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    value={email}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    onChange={this.handleChange}
                    value={password}
                />
                {error ? <span>{errorMessage}</span> : null}
                {success ? <span className="success">{successMessage}</span> : null}
                <button type="submit" disabled={buttonDisabled}>Enviar</button>
            </form>
        );
    }
}