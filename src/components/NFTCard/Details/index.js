/* eslint-disable prettier/prettier */
import React, { useContext, useState, useEffect } from 'react'
import { DappifyContext, constants, Metadata } from 'react-dappify'
import { Grid, Typography, Tooltip, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import * as selectors from 'store/selectors'
import ModalSale from 'components/ModalSale'
import ModalPurchase from 'components/ModalPurchase'
import ModalWithdraw from 'components/ModalWithdraw'
import ModalEdit from 'components/ModalEdit'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import EditIcon from '@mui/icons-material/Edit'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import RefreshButton from 'components/RefreshButton';
import {
  fetchCurrentUser,
  fetchNftsBreakdown,
  fetchUserRanking,
  fetchHotAuctions,
  fetchNftShowcase
} from 'store/actions/thunks'
import axios from 'axios'
import { formatPrice } from 'utils/format'

// react functional component
const Details = ({ nft, t }) => {
  const { configuration } = useContext(DappifyContext)
  // const network = constants.NETWORKS[configuration.chainId]
  const dispatch = useDispatch()
  const [isOpenSale, setOpenSale] = useState(false)
  const [isOpenWithdraw, setOpenWithdraw] = useState(false)
  const [isOpenPurchase, setOpenPurchase] = useState(false)
  const [isOpenEdit, setOpenEdit] = useState(false)

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

  const currentUserState = useSelector(selectors.currentUserState)
  const currentUser = currentUserState.data || {}

  const isOwner = currentUser.wallet && currentUser.wallet === nft.owner.wallet
  const canEdit = isOwner && nft.status === 'OfferingPlaced'
  const canSell = isOwner && nft.status !== 'OfferingPlaced'
  const canWithdraw = isOwner && nft.status === 'OfferingPlaced'
  const canPurchase = !isOwner && nft.status === 'OfferingPlaced'

  const handlePurchase = async () => {
    setOpenPurchase(false)
    dispatch(fetchNftsBreakdown())
    dispatch(fetchUserRanking())
    dispatch(fetchHotAuctions())
    dispatch(fetchNftShowcase())
  }

  const handleSell = async () => {
    setOpenSale(false)
    dispatch(fetchCurrentUser())
    dispatch(fetchNftsBreakdown())
    dispatch(fetchUserRanking())
    dispatch(fetchHotAuctions())
    dispatch(fetchNftShowcase())
  }

  const handleWithdraw = async () => {
    setOpenWithdraw(false)
    dispatch(fetchCurrentUser())
    dispatch(fetchNftsBreakdown())
    dispatch(fetchUserRanking())
    dispatch(fetchHotAuctions())
    dispatch(fetchNftShowcase())
  }

  const handleEdit = async () => {
    setOpenEdit(false)
    dispatch(fetchCurrentUser())
    dispatch(fetchNftsBreakdown())
    dispatch(fetchUserRanking())
    dispatch(fetchHotAuctions())
    dispatch(fetchNftShowcase())
  }

  const incompleteNft = !nft?.source?.attributes?.chainId || 
                        !nft?.source?.attributes?.contract || 
                        !nft?.source?.attributes?.tokenId

  const refreshMetadata = async () => {
    try {
      const chainId = nft?.source?.attributes?.chainId
      const tokenAddress = nft?.source?.attributes?.contract
      const tokenId = nft?.source?.attributes?.tokenId
      if (incompleteNft) return
      const result = await axios.get(
        `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}/metadata/resync?chain=${chainId}&mode=sync`,
        {
          headers: {
            'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
            accept: 'application/json'
          }
        }
      )
      const newMeta = await axios.get(
        `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}?chain=${chainId}&format=decimal`,
        {
          headers: {
            'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
            accept: 'application/json'
          }
        }
      )
      const metad = JSON.parse(newMeta.data.metadata)
      nft.source.set('metadata', metad)
      await nft.source.save()
      window.location.reload()
    } catch (e) {
      console.log(e)
    }
  }

  const capString = (value, len) => {
    let response = value
    if ((response.length) > len) {
      response = response.substring(0, len) + '...'
    }
    return response
  }

  return (
    <Grid container spacing={1} sx={{ px: 1, m: 0 }}>
      <Grid item xs={12}>
        <Typography fontSize='0.85em' fontWeight='bold' color='text.secondary'>
          {`${capString(nft?.collection?.name, 20)} #${
            capString(nft?.tokenId, 8)
          }`}{' '}
          (1/{nft.quantity ? nft.quantity : 1})
        </Typography>
        <Typography fontSize='1.15em' fontWeight='400'>
          {capString(nft?.metadata?.name, 30)}
        </Typography>
      </Grid>
      <Grid container spacing={1} sx={{ px: 1, pt: 1 }}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            {canSell && (
              <Grid item>
                <Tooltip title='Add to marketplace'>
                  <Button
                    variant='outlined'
                    color='success'
                    className='circular__button'
                    onClick={() => setOpenSale(true)}
                  >
                    <AddBusinessIcon />
                  </Button>
                </Tooltip>
              </Grid>
            )}
            {canPurchase && (
              <Grid item>
                <Tooltip title='Purchase'>
                  <Button
                    variant='outlined'
                    color='success'
                    className='circular__button'
                    onClick={() => setOpenPurchase(true)}
                  >
                    <ShoppingCartIcon />
                  </Button>
                </Tooltip>
              </Grid>
            )}
            {canWithdraw && (
              <Grid item>
                <Tooltip title='Withdraw from marketplace'>
                  <Button
                    variant='outlined'
                    color='info'
                    className='circular__button'
                    onClick={() => setOpenWithdraw(true)}
                  >
                    <PlaylistRemoveIcon />
                  </Button>
                </Tooltip>
              </Grid>
            )}
            {canEdit && (
              <Grid item>
                <Tooltip title='Edit pricing'>
                  <Button
                    variant='outlined'
                    color='info'
                    className='circular__button'
                    onClick={() => setOpenEdit(true)}
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
              </Grid>
            )}
            <RefreshButton nft={nft} />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container justifyContent='right'>
            <Grid item>
              {nft.offeringId && (
                <Tooltip title='Pricing'>
                  <Button
                    variant='outlined'
                    color='success'
                    onClick={() => canPurchase && setOpenPurchase(true)}
                  >
                    <Typography fontWeight='bold'>
                      {formatPrice(nft.price)} {network?.nativeCurrency?.symbol}
                    </Typography>
                  </Button>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Grid>

        {isOpenSale && (
          <ModalSale nft={nft} isOpen={isOpenSale} onClose={handleSell} t={t} />
        )}
        {isOpenPurchase && (
          <ModalPurchase
            nft={nft}
            isOpen={isOpenPurchase}
            onClose={handlePurchase}
            t={t}
          />
        )}
        {isOpenWithdraw && (
          <ModalWithdraw
            nft={nft}
            isOpen={isOpenWithdraw}
            onClose={handleWithdraw}
            t={t}
          />
        )}
        {isOpenEdit && (
          <ModalEdit nft={nft} isOpen={isOpenEdit} onClose={handleEdit} t={t} />
        )}
      </Grid>
      {/* <Grid item xs={6} sx={{ pb: 2 }} textAlign="right">
                <span style={{opacity:0.5}}>{likes}</span>
                <IconButton onClick={handleLike} sx={{opacity: 0.5}}>
                    {liked ? <FavoriteIcon />: <FavoriteBorderIcon /> }
                </IconButton>
                </Grid> */}
    </Grid>
  )
}

export default Details
