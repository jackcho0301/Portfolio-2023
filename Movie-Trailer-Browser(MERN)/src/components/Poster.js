import React from 'react'

const Poster = ({poster, onClickPoster}) => {
  return (
        <img src={`https://image.tmdb.org/t/p/original${poster.poster_path}`} alt={poster.id} onClick={() => onClickPoster(poster.id)}/>
  )
}

export default Poster