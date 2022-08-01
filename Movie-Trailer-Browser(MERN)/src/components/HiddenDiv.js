import React from 'react'

const HiddenDiv = ({ trailerPath, isFavorite, id,onClickAddFav, title, releaseDate, runtime, overview, onClickClose}) => {
    
    return (
        <div id="hidden-div">
            <button className="btn" id="close_button" onClick={onClickClose}>CLOSE</button>
            <button className="btn" id="add-fav-button" onClick={() => onClickAddFav(id)}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>            
            <br />
            <iframe id="trailer" src={trailerPath} title={"trailer"}>
            </iframe>

            <h4 id="detail-title">{title}</h4>
            <p id="detail-release-date">Release Date: {releaseDate}</p>
            <p id="detail-runtime">Runtime: {runtime} minutes</p>
            <p id="detail-overview">Overview: {overview}</p>

            
        </div>
    )
}

HiddenDiv.defaultProps= {

  }
  
export default HiddenDiv