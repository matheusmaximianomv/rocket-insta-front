import React, { Component } from 'react';

import api from './../../services/api';

import Header from './../../components/Header';

import profileanonymous from './../../assets/img/profileanonymous.png';
import './profile.css';

export default class Profile extends Component {

    state = {
        user: {},
        image: null,
        name: '',
        email: '',

        error: false,
        errorMessage: '',

        buttonDisabled: true
    }

    async componentDidMount() {
        try {
            const response = await api.get('/users/profile');

            const { data: user } = response;
            const { name, email } = user;

            this.setState({ user, name, email });
        } catch (error) {
            const erroAxios = error;
            this.setState({ error: true, errorMessage: erroAxios.response.data });
        }
    }

    handleImageChange = async (event) => {
        const file = event.target.files[0];
        const fileType = file.type.split('/')[0];
        if (fileType === "image") {
            await this.setState({ image: file });
            this.handleButton();
        } else
            this.setState({ image: null, error: true, errorMessage: "Tipo de Arquivo não suportado." });
        return;
    }

    handleChange = async (event) => {
        await this.setState({ [event.target.name]: event.target.value });
        this.handleButton();
        return;
    }

    handleButton = () => {

        const { user, image, name, email } = this.state;

        if (image || user.name.trim() !== name.trim() || user.email.trim() !== email.trim())
            this.setState({ buttonDisabled: false });
        else
            this.setState({ buttonDisabled: true });
        return;

    }

    handleSubmit = async (event) => {
        event.preventDefault(event);

        const { image, name, email } = this.state;

        const regEmail = new RegExp(/^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/);

        if (name.length < 5)
            return this.setState({ error: true, errorMessage: 'Digite um nome e sobrenome.' });

        if (!regEmail.test(email))
            return this.setState({ error: true, errorMessage: 'Email mal formatado.' });

        const data = new FormData();

        data.append('image', image);
        data.append('name', name);
        data.append('email', email);

        try {
            await api.put('/users', data);
            window.location.reload();
        } catch (error) {
            const { response } = error;
            const fail = response.data || response.data.result;
            this.setState({ error: true, errorMessage: fail });
        }

        return;

    }

    render() {

        const { user, name, email, error, errorMessage, buttonDisabled } = this.state;

        return (
            <div>
                <Header />
                <form id="profile" onSubmit={this.handleSubmit}>
                    <div>
                        <img src={user.image ? `${process.env.REACT_APP_HOST}/files/${user.image}` : profileanonymous} alt="Imagem de Perfil" />
                    </div>
                    <input
                        type="file"
                        onChange={this.handleImageChange}
                    />
                    <label htmlFor="name">Nome</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={this.handleChange}
                        value={name}
                    />
                    <label htmlFor="name">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={this.handleChange}
                        value={email}
                    />
                    {error ? <span>{errorMessage}</span> : null}
                    <button type="submit" disabled={buttonDisabled}>Atualizar</button>
                </form>
            </div>
        );
    }
}