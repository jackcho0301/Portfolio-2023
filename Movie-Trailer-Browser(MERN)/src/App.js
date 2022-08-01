import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios';
import Category from './components/Category';
import Heading from './components/Heading';
import Posters from './components/Posters';
import HiddenDiv from './components/HiddenDiv';
import SearchForm from './components/SearchForm';

function App() {

  //states:
  const [posters, setPosters] = useState({ "results": [] });
  const [showDisplay, setShowDisplay] = useState(false);
  const [id, setId] = useState();
  const [trailerPath, setTrailerPath] = useState('');
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [runtime, setRuntime] = useState('');
  const [overview, setOverview] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);


  //when clicking categories button (See Popular || See Top-Rated)
  const onClickCategory = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    setPosters(data);
  }


  //when clicking favorite movie
  const onClickFavorites = async () => {
    const { data } = await axios.get('http://localhost:5000/api/v1/favorites');
    let resultsObj = { "results": [] };
    for (var i = 0; i < data.favorites.length; ++i) {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${data.favorites[i].id}?api_key=0c1cfc186512612b10c8d9f9fe03adb2&language=en-US`);
      resultsObj.results.push(res.data);
    }
    console.log(resultsObj);
    setPosters(resultsObj);
    setShowDisplay(false);
  }


  // //when user wishes to add or remove from favorites
  const onClickAddFavorites = async () => {
    if(!isFavorite){
      console.log("i want to add this to favorites with id: " + id);
      let newFavorite = {id: id};
      await fetch('http://localhost:5000/api/v1/favorites', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newFavorite)
      })


      alert("Added to your Favorites");

      onClickFavorites();
    }
    else {

      await fetch(`http://localhost:5000/api/v1/favorites/`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({id: id})
      })

      alert('Removed from your Favorites');
      onClickFavorites();
      setIsFavorite(!isFavorite);

    }
  }


  //when user clicks on the poster (hidden div appears)
  const onClickPoster = async (id) => {

    setShowDisplay(!showDisplay);

    const resTrailerPath = await fetch("https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=0c1cfc186512612b10c8d9f9fe03adb2&language=en-US");
    const dataTrailerPath = await resTrailerPath.json();
    setTrailerPath("https://www.youtube.com/embed/" + dataTrailerPath.results[0].key);
    const res = await fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=0c1cfc186512612b10c8d9f9fe03adb2&language=en-US");
    const data = await res.json();

    setTitle(data.title);
    setReleaseDate(data.release_date);
    setRuntime(data.runtime);
    setOverview(data.overview);
    setId(id);


    console.log(id);
    const resExisting = await fetch('http://localhost:5000/api/v1/favorites');
    const {favorites} = await resExisting.json();
    console.log(favorites);
    for (let i = 0; i< favorites.length; ++i) {
      if (favorites[i].id === id) {
        setIsFavorite(true);
        return;
      }
    }
    setIsFavorite(false);

    console.log(isFavorite);

  }


  //close button event
  const onClickClose = (id) => {
    setShowDisplay(!showDisplay);

  }

  //fetch Movies:
  const fetchPopularMovies = async () => {
    const res = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=0c1cfc186512612b10c8d9f9fe03adb2&language=en-US&page=1');
    const data = await res.json();
    return data;
  }

  //search movie:
  const searchMovie = async (input) => {
    const res = await fetch("https://api.themoviedb.org/3/search/movie?api_key=0c1cfc186512612b10c8d9f9fe03adb2&query=" + input.text);
    const data = await res.json();
    setPosters(data);
  }


  //initialize webpage with popular movies.
  useEffect(() => {
    const getMovies = async () => {
      const moviesFromServer = await fetchPopularMovies();
      setPosters(moviesFromServer);
    }
    getMovies();

  }, [])


  return (
    <>
      {showDisplay && <HiddenDiv id={id} isFavorite={isFavorite} onClickAddFav={onClickAddFavorites} trailerPath={trailerPath} title={title} releaseDate={releaseDate} runtime={runtime} overview={overview} onClickClose={onClickClose} />}
      <Category categoryID='popular-btn' categoryName='See Popular' onClick={() => onClickCategory('https://api.themoviedb.org/3/movie/popular?api_key=0c1cfc186512612b10c8d9f9fe03adb2&language=en-US&page=1')} />
      <Category categoryID='top-rated-btn' categoryName='See Top-Rated' onClick={() => onClickCategory('https://api.themoviedb.org/3/movie/top_rated?api_key=0c1cfc186512612b10c8d9f9fe03adb2&language=en-US&page=1')} />
      <Category categoryID='favorites-btn' categoryName='See Your Favorites' onClick={() => onClickFavorites()} />
      <SearchForm onSearch={searchMovie} />
      <Heading headingID='heading' headingText='Popular Movies' />
      <Posters posters={posters} onClickPoster={onClickPoster} />
    </>
  );
}




export default App;

