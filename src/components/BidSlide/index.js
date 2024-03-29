import React, { useState, useContext, useEffect } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { DappifyContext, constants } from 'react-dappify'
import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from '@reach/router'
import ModalPurchase from 'components/ModalPurchase'
import { useTranslation } from 'react-i18next'
import UserProfileMini from 'components/UserProfileMini'
import { formatPrice } from 'utils/format'
import axios from 'axios'
import ImageFadeIn from 'react-image-fade-in'

const BidSlide = ({ nft, usdPrice }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { configuration } = useContext(DappifyContext)
  // const network = constants.NETWORKS[configuration.chainId]
  const [openCheckoutbid, setOpenCheckoutbid] = useState()

  const defaultPlaceholder =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'

  const img = nft?.metadata?.source?.image || nft?.metadata?.source?.image_data
  const isBase64 = img && img.startsWith('data')

  const [network, setNetwork] = useState({})

  const loadNetwork = async () => {
    if (!configuration?.chainId) {
      return
    }
    const response = await axios.get(
      `${process.env.REACT_APP_DAPPIFY_API_URL}/chain/${configuration?.chainId}`,
      {
        headers: {
          'x-api-Key': process.env.REACT_APP_DAPPIFY_API_KEY,
          accept: 'application/json'
        }
      }
    )
    setNetwork(response.data)
  }

  useEffect(() => {
    loadNetwork()
  }, [])

  return (
    <div className='nft__item_lg'>
      <div className='row align-items-center'>
        <div
          className='col-lg-6'
          style={{ padding: '20px', position: 'relative' }}
        >
          <span
            style={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              overflow: 'hidden',
              cursor: 'pointer',
              borderRadius: theme?.shape?.borderRadius
            }}
          >
            {!img && (
              <div className='lazy nft__placeholder'>{nft.metadata.name}</div>
            )}
            {img && !isBase64 && (
              <ImageFadeIn
                height='auto'
                width='100%'
                src={img || defaultPlaceholder}
                alt=''
              />
            )}
            {img && isBase64 && (
              <div>
                <embed src={img || defaultPlaceholder} />
              </div>
            )}
          </span>

          {nft?.metadata?.animation_url && (
            <audio
              src={nft.metadata.animation_url}
              controls
              controlsList='nodownload'
              className='audio__controller'
            >
              {t('Your browser does not support the audio element')}
            </audio>
          )}
        </div>
        <div className='col-lg-6'>
          <div className='d-desc'>
            <h2>{nft.metadata.name}</h2>
            <div className='d-author'>
              <UserProfileMini profile={nft.owner} />
            </div>
            <div className='d-attr'>
              <div className='col first'>
                <span className='d-title'>
                  {t('Price per unit')} (1/{nft.quantity ? nft.quantity : 1})
                </span>
                {nft.price > 0 ? (
                  <h3>
                    {formatPrice(nft.price)} {network?.nativeCurrency?.symbol}
                  </h3>
                ) : (
                  <h3>{t('Not for sale')}</h3>
                )}
                <h5>(${`${formatPrice(nft.price * usdPrice)}`})</h5>
              </div>
              <div className='line' />
            </div>
            <div className='spacer-10' />
            <div className='d-buttons'>
              <Button
                sx={{ mr: 2, fontSize: '1.25em' }}
                variant='contained'
                size='large'
                onClick={() => setOpenCheckoutbid(true)}
              >
                {t('Purchase')}
              </Button>
              <Button
                sx={{ fontSize: '1.25em' }}
                variant='contained'
                size='large'
                onClick={() => {
                  navigate(
                    `/${process.env.REACT_APP_TEMPLATE_NAME}/item/${nft.collection.address}/${nft.tokenId}`
                  )
                }}
              >
                {t('View artwork')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {openCheckoutbid && (
        <ModalPurchase
          t={t}
          nft={nft}
          isOpen={openCheckoutbid}
          onClose={() => {
            setOpenCheckoutbid(false)
          }}
        />
      )}
    </div>
  )
}

export default BidSlide
