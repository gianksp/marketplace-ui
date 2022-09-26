import React from 'react'
import { navigate } from '@reach/router'
import ImageFadeIn from 'react-image-fade-in'

// react functional component
const Preview = ({ nft }) => {
  const backgroundColor = nft.metadata.background
    ? `#${nft.metadata.background}`
    : 'transparent'

  const img = nft?.metadata?.source?.image || nft?.metadata?.source?.image_data
  const isBase64 = img && img.startsWith('data')

  return (
    <span
      style={{
        background: backgroundColor,
        position: 'relative',
        width: '100%',
        height: '275px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() =>
        navigate(
          `/${process.env.REACT_APP_TEMPLATE_NAME}/item/${nft?.collection?.address}/${nft?.tokenId}`
        )
      }
    >
      {!img && <div className='lazy nft__placeholder'>{nft.metadata.name}</div>}
      {img && !isBase64 && (
        <ImageFadeIn height='275px' width='100%' src={img} alt='' />
      )}
      {img && isBase64 && <embed src={img} />}
    </span>
  )
}

export default Preview
