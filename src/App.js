import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";

import { Header, Spinner } from "./components";
import { Home, Details, NotFound, MoviePlayer} from "./routes";
import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE } from "./config";
import store from "./store";

class App extends Component {
  state = {
    loading: true,
    movies: [],
    badge: 0,
    image: null,
    mTitle: "",
    mDesc: "",
    activePage: 0,
    totalPage: 0,
    searchText: "",
  };

  async componentDidMount() {
    try {
      const {
        data: { results, page, total_pages },
      } = await this.loadMovies();
      console.log("res", results);
      this.setState({
        movies: results,
        loading: false,
        activePage: page,
        totalPage: total_pages,
        image: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${results[0].backdrop_path}`,
        mTitle: results[0].title,
        mDesc: results[0].overview,
      });
    } catch (e) {
      console.log("e", e);
    }
  }

  loadMovies = () => {
    const page = this.state.activePage + 1;
    const url = `${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=fr`;
    return axios.get(url);
  };

  loadMore = async () => {
    try {
      this.setState({ loading: true });
      const {
        data: { results, page, total_pages },
      } = await this.loadMovies();
      console.log("res", results);
      this.setState({
        movies: [...this.state.movies, ...results],
        loading: false,
        activePage: page,
        totalPage: total_pages,
        image: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${results[0].backdrop_path}`,
        mTitle: results[0].title,
        mDesc: results[0].overview,
      });
    } catch (e) {
      console.log("erroe load more", e);
    }
    console.log("load");
  };

  searchMovie = () => {
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${this.state.searchText}&language=fr`;
    return axios.get(url);
  };

  handleSearch = (value) => {
    try {
      this.setState(
        { loading: true, searchText: value, image: null },
        async () => {
          const {
            data: { results, page, total_pages },
          } = await this.searchMovie();
          console.log("res", results);
          this.setState({
            movies: results,
            loading: false,
            activePage: page,
            totalPage: total_pages,
            image: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${results[0].backdrop_path}`,
            mTitle: results[0].title,
            mDesc: results[0].overview,
          });
        }
      );
    } catch (e) {
      console.log("search error", e);
    }
  };

  render() {
    const { badge } = this.state;
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className='App'>
            <Header badge={badge} />
            {!this.state.image ? (
              <Spinner />
            ) : (
              <Switch>
                <Route
                  exact
                  path='/'
                  render={() => (
                    <Home
                      {...this.state}
                      onSearchClick={this.handleSearch}
                      onButtonClick={this.loadMore}
                    />
                  )}
                />
                <Route exact path='/player' component={MoviePlayer} />
                <Route exact path='/player/:id' component={MoviePlayer} />
                <Route exact path='/:id' component={Details} />
                <Route component={NotFound} />
              </Switch>
            )}
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
