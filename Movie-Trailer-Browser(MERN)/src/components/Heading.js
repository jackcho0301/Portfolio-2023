import React from 'react'

const Heading = ({headingID, headingText}) => {
  return (
    <h2 id={headingID}>{headingText}</h2>
  )
}

export default Heading