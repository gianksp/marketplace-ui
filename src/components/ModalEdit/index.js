import { useState, useEffect, useContext } from 'react'
import {
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Input,
  FormControl,
  InputAdornment
} from '@mui/material'
import { DappifyContext, constants } from 'react-dappify'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from 'store/selectors'
import { editPriceNft, modalReset } from 'store/actions/thunks'
import OperationResult from 'components/OperationResult'
import ConfirmationWarning from 'components/ConfirmationWarning'
import ModalActions from 'components/ModalActions'
import {
  fetchNftDetail,
  fetchHotAuctions,
  fetchNftsBreakdown
} from 'store/actions/thunks/nfts'
import { fetchCurrentUser } from 'store/actions/thunks/users'
import axios from 'axios'

const ModalEdit = ({ isOpen = false, onClose, isBid, nft, t }) => {
  const dispatch = useDispatch()
  const nftEditState = useSelector(selectors.nftEditState)
  const isEditing = nftEditState.loading
  const { configuration, loadBalances } = useContext(DappifyContext)
  // const network = constants.NETWORKS[configuration.chainId]
  const priceOver = configuration?.feature?.bids?.priceOver
  const maxBid = nft?.maxBid || 0
  const [amount, setAmount] = useState()

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

  const getToken = () => `${nft?.metadata?.name} #${nft.tokenId}`

  useEffect(() => {
    return async () => {
      await dispatch(modalReset())
    }
  }, [dispatch, isOpen])

  useEffect(() => {
    const initialAmount = isBid ? maxBid + priceOver : nft.price
    setAmount(initialAmount)
    // eslint-disable-next-line no-use-before-define
  }, [isBid, maxBid, nft, priceOver])

  const handleAction = async () => {
    await dispatch(editPriceNft(nft, amount))
  }

  const handleClose = async () => {
    dispatch(fetchNftDetail(nft.collection.address, nft.tokenId))
    dispatch(fetchHotAuctions())
    dispatch(fetchNftsBreakdown())
    dispatch(fetchCurrentUser())
    loadBalances()
    onClose()
  }

  const handleAmountChange = (e) => setAmount(parseFloat(e.target.value))

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='parent-modal-title'
      aria-describedby='parent-modal-description'
    >
      <DialogTitle>{t('Edit pricing')}</DialogTitle>
      <DialogContent className='content__modal'>
        <DialogContentText>
          {t('Edit confirmation', {
            name: getToken()
          })}
        </DialogContentText>
        <FormControl variant='standard' fullWidth>
          <Input
            id='standard-adornment-weight'
            value={amount}
            onChange={handleAmountChange}
            endAdornment={
              <InputAdornment position='end'>
                {network?.nativeCurrency?.symbol}
              </InputAdornment>
            }
            aria-describedby='standard-amount-helper-text'
            type='number'
            inputProps={{
              'aria-label': 'amount'
            }}
          />
          <Grid container spacing={2} sx={{ pt: 2 }}>
            {isEditing && <ConfirmationWarning t={t} />}
            <OperationResult state={nftEditState} t={t} />
          </Grid>
          <ModalActions
            state={nftEditState}
            onClose={handleClose}
            handleAction={handleAction}
            t={t}
            confirmLabel='Confirm'
            loading={isEditing}
          />
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}

export default ModalEdit
