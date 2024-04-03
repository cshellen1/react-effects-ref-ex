import React from 'react'

function Card({image, name}) {
  return (
    <img
      src={image}
      className='card'
      alt={name}
    />
  )
}

export default Card