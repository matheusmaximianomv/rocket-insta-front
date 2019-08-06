import React, { Component } from 'react';

import api from './../../services/api';

import Header from './../../components/Header';

import './post.css';

export default class Post extends Component {

    state = {
        image: null,
        urlImage: '',
        place: '',
        description: '',
        hashtags: '',
        error: false,
        errorMessage: true
    }

    handleImageChange = (event) => {
        const file = event.target.files[0];
        const fileType = file.type.split('/')[0];
        if (fileType === "image")
            this.setState({ image: file, urlImage : URL.createObjectURL(file) });
        else
            this.setState({ image: null, error: true, errorMessage: "Tipo de Arquivo não suportado." });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault(event);
        this.setState({ error: '' });

        const { image, place, description, hashtags } = this.state;
        
        if (!image || !place || !description || !hashtags) {
            this.setState({ error: true, errorMessage: "Alguns Campos estão Vazios." });
            return;
        }

        const data = new FormData();

        data.append('image', image);
        data.append('place', place);
        data.append('description', description);
        data.append('hashtags', hashtags);

        try {
            await api.post('/posts', data);
            this.props.history.push('/home');
        } catch (error) {
            this.setState({ error : true, errorMessage : error.response.data });
        }



    }

    render() {

        const { error, errorMessage, urlImage } = this.state;

        return (
            <div>
                <Header />
                <form id="new-post" onSubmit={this.handleSubmit}>
                    {urlImage ? <img src={urlImage} alt="Pre-visualização da imagem" /> : null }
                    <input type="file" name="image" onChange={this.handleImageChange} accept="image/*" />
                    <input type="text" name="place" placeholder="Local da Postagem" onChange={this.handleChange} />
                    <input type="text" name="description" placeholder="Descrição da Postagem" onChange={this.handleChange} />
                    <input type="text" name="hashtags" placeholder="Hashtags" onChange={this.handleChange} />
                    {error ? <span>{errorMessage}</span> : null}
                    <button type="submit">Enviar</button>
                </form>
            </div>
        );
    }
}