import React from 'react'
import { useState } from 'react'



const SearchForm = ({ onSearch }) => {

    //component-level state:
    const [text, setText] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        onSearch({ text });

        //clear the form by setting the state
        setText('');
    }





    return (
        <form id="form" onSubmit={onSubmit}>
            <label htmlFor="input">Search Movies:</label>
            <input type="text" id="input" value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" id="search-btn">Search</button>
        </form>
    )
}

export default SearchForm