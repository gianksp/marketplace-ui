import { useState, useEffect, useContext } from 'react'
import { Alert, Grid, Typography, Button } from '@mui/material'
import { DappifyContext, constants } from 'react-dappify'
import axios from 'axios'

const OperationResult = ({ state, t }) => {
  const { project, configuration } = useContext(DappifyContext)
  const [explorerUrl, setExploreUrl] = useState()

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

  useEffect(() => {
    const prepareExplorerUrl = () => {
      if (network?.explorers?.length > 0) {
        const explorerBase = network?.explorers[0]
        setExploreUrl(`${explorerBase?.url}/tx/${state.data}`)
      }
    }

    prepareExplorerUrl()
  }, [project, state, network])

  const isTxCompleted = state.loadFailed || state.data
  const errorState = state.loadFailed && (
    <Alert severity='error'>
      <Typography variant='body'>{t(state.error)}</Typography>
    </Alert>
  )

  const successState = !state.loadFailed && state.data && (
    <Alert severity='success'>
      <Typography variant='body'>
        <a href={explorerUrl} target='_blank' rel='noreferrer'>
          {t('Transaction successful')}
        </a>
        <Button
          sx={{ height: 15 }}
          href={explorerUrl}
          target='_blank'
          rel='noreferrer'
        >
          {t('View in explorer')}
        </Button>
      </Typography>
    </Alert>
  )

  return (
    isTxCompleted && (
      <Grid item xs={12}>
        {errorState}
        {successState}
      </Grid>
    )
  )
}

export default OperationResult
