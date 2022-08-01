import React from 'react'
import Poster from './Poster'



const Posters = ({posters, onClickPoster}) => {

    return (
        <div id='container'>

            {posters.results.map((poster)=>(
                <Poster key={poster.id} poster={poster} onClickPoster={onClickPoster}/>
            ))}
        </div>
    )
}

export default Posters