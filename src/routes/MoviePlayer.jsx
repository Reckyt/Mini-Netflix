import React, { Component } from "react";
import Axios from "axios";
import _ from "lodash";

import { VideoPlayer, MvPlayerList, Spinner } from "../components";
import { API_KEY, API_URL, IMAGE_BASE_URL, BACKDROP_SIZE } from "../config";
import "../css/MoviePlayer.css";
import { calcTime } from "../Utils/Helpers";

let newMovies = [];

class MoviePlayer extends Component {
  state = {
    movies: [
      {
        duration: "2h 9m",
        id: 429617,
        imageUrl:
          "http://image.tmdb.org/t/p/w1280//5myQbDzw3l8K9yofUXRJ4UTVgam.jpg",
        position: 1,
        title: "Spider man",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        duration: "2h 9m",
        id: 429618,
        imageUrl:
          "http://image.tmdb.org/t/p/w1280//5myQbDzw3l8K9yofUXRJ4UTVgam.jpg",
        position: 1,
        title: "Spider man",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        duration: "2h 9m",
        id: 429619,
        imageUrl:
          "http://image.tmdb.org/t/p/w1280//5myQbDzw3l8K9yofUXRJ4UTVgam.jpg",
        position: 1,
        title: "Spider man",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        duration: "2h 9m",
        id: 429620,
        imageUrl:
          "http://image.tmdb.org/t/p/w1280//5myQbDzw3l8K9yofUXRJ4UTVgam.jpg",
        position: 1,
        title: "Spider man",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
    ],
    selectedMovie: {
      duration: "2h 9m",
      id: 429617,
      imageUrl:
        "http://image.tmdb.org/t/p/w1280//5myQbDzw3l8K9yofUXRJ4UTVgam.jpg",
      position: 1,
      title: "Spider man",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    loading: true,
  };

  async componentDidMount() {
    const oldMovies = JSON.parse(localStorage.getItem("movies"));
    const results = await this.getNewMovies(oldMovies);
    newMovies = oldMovies.map((oldMovie, index) => {
      return {
        id: oldMovie.id,
        position: index + 1,
        title: oldMovie.title,
        duration: results[index],
        imageUrl: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${oldMovie.backdrop_path}`,
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      };
    });

    const id = this.props.match.params.id;
    if (id) {
      const selectedMovie = this.getSelectedMovie(newMovies, id);
      this.setState({ loading: false, movies: [...newMovies], selectedMovie });
    } else {
      const selectedMovie = newMovies[0];
      this.setState({ loading: false, movies: [...newMovies], selectedMovie });
      this.props.history.push({
        pathname: `/player/${selectedMovie.id}`,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      const id = this.props.match.params.id;
      const selectedMovie = this.getSelectedMovie(newMovies, id);
      this.setState({ selectedMovie });
    }
  }

  getSelectedMovie = (movies, movieId) => {
    const selectedMovie = _.find(movies, { id: parseInt(movieId, 10) });
    return selectedMovie;
  };

  handleEnded = () => {
    console.log("vidéo fini");
    const { movies, selectedMovie } = this.state;
    const movieIndex = movies.findIndex(
      (movie) => selectedMovie.id === movie.id
    );
    const nextMovieIndex =
      movieIndex === movies.length - 1 ? 0 : movieIndex + 1;
    const newSelectedMovie = movies[nextMovieIndex];
    this.props.history.push({ pathname: `/player/${newSelectedMovie.id}` });
    this.setState({ selectedMovie: newSelectedMovie });
  };

  getTime = (movieId) => {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr`;
      Axios.get(url)
        .then((data) => {
          const duration = data.data.runtime;
          resolve(duration);
        })
        .catch((e) => {
          console.log("error", e);
          reject("error");
        });
    });
  };

  getNewMovies = async (oldMovies) => {
    let promises = [];
    for (let i = 0; i < oldMovies.length; i++) {
      const element = oldMovies[i];
      const id = element.id;
      const time = await this.getTime(id);
      promises.push(calcTime(time));
    }
    return Promise.all(promises);
  };

  render() {
    const { movies, selectedMovie } = this.state;
    return (
      <div className='moviePlayer'>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <>
            <VideoPlayer
              videoUrl={selectedMovie.videoUrl}
              imageUrl={selectedMovie.imageUrl}
              handleEnded={this.handleEnded}
            />
            <MvPlayerList movies={movies} selectedMovie={selectedMovie} />
          </>
        )}
      </div>
    );
  }
}

export { MoviePlayer };
