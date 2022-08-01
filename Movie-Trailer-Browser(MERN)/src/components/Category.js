import React from 'react'

const Category = ({categoryID, categoryName, onClick}) => {
  return (
    <button id={categoryID} onClick={onClick}>{categoryName}</button>
  )
}

export default Category