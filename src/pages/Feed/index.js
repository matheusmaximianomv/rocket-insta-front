import React, { Component } from 'react';
import io from 'socket.io-client';

import api from '../../services/api';
import { logout } from '../../services/auth';

import Header from './../../components/Header';

import more from './../../assets/img/more.svg';
import like from './../../assets/img/like.svg';
import comment from './../../assets/img/comment.svg';
import send from './../../assets/img/send.svg';
import profileanonymous from './../../assets/img/profileanonymous.png';

import './feed.css';

export default class Feed extends Component {

    state = {
        posts: []
    };

    async componentDidMount() {
        this.registerToSocket();
        try {
            const response = await api.get('/posts ');
            this.setState({ posts: response.data });
        } catch (error) {
            if (error.response.status === 401) {
                logout();
                window.location.reload();
            }
        }
    }

    registerToSocket = () => {
        const socket = io(process.env.REACT_APP_HOST);

        socket.on('post', newPost => {
            this.setState({ posts: [newPost, ...this.state.posts,] });
        });

        socket.on('like', likedPost => {
            this.setState({
                posts: this.state.posts.map(post =>
                    post._id === likedPost._id ? likedPost : post
                )
            });
        });
    }

    handleLike = async id => {
        await api.post(`/posts/${id}/like`);
    }

    render() {

        const { posts } = this.state;

        return (
            <div>
            <Header />
            <section id="post-list">
                {/* <div style={{background : '#f8d7da', borderColor: '#f5c6cb',marginTop:"15px", borderRadius : "5px", paddingTop: '15px', paddingLeft : '20px', paddingBottom: '15px'}}>
                    <p style={{color : '#721c24', textAlign : "center"}}>Tipo de erros</p>
                </div> */}
                {posts.map(post => (
                    <article key={post._id}>
                        <header>
                            <div className="container">
                                <div className="profile-img">
                                    {post.author.image ?
                                        <img src={`${process.env.REACT_APP_HOST}/files/${post.author.image}`} alt="Foto do Usuário" />
                                        :
                                        <img src={profileanonymous} alt="Foto do Usuário" />
                                    }
                                </div>
                                <div className="user-info">
                                    <span>{post.author.name}</span>
                                    <span className="place">{post.place}</span>
                                </div>
                            </div>
                            <img src={more} alt="mais" />
                        </header>

                        <img src={`${process.env.REACT_APP_HOST}/files/${post.image}`} alt="" />

                        <footer>
                            <div className="actions">
                                <button onClick={() => this.handleLike(post._id)}>
                                    <img src={like} alt="like" />
                                </button>
                                <img src={comment} alt="comentario" />
                                <img src={send} alt="enviar" />
                            </div>

                            <strong>{post.likes + ' '}Curtidas</strong>

                            <p>
                                {post.description}
                                <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                ))}
            </section>
            </div>
        );
    }
}