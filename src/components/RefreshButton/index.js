/* eslint-disable prettier/prettier */
import React, { useContext } from 'react'
import { DappifyContext } from 'react-dappify'
import { Grid, Tooltip, Button } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import axios from 'axios'

// react functional component
const RefreshButton = ({ nft }) => {
  const { configuration } = useContext(DappifyContext)
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

  return !incompleteNft ? (
    <Grid item>
      <Tooltip title="Refresh metadata">
        <Button
          variant="outlined"
          color='info'
          className='circular__button'
          onClick={() => refreshMetadata()}
        >
          <RefreshIcon />
        </Button>
      </Tooltip>
    </Grid>
  ) : (<></>)
}

export default RefreshButton
