import { useContext, useState, useEffect } from 'react'
import {
  TextField,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography
} from '@mui/material'
import { DappifyContext, constants } from 'react-dappify'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from 'store/selectors'
import { purchaseNft, modalReset } from 'store/actions/thunks'
import Verification from 'components/Verification'
import OperationResult from 'components/OperationResult'
import ConfirmationWarning from 'components/ConfirmationWarning'
import ModalActions from 'components/ModalActions'
import {
  fetchNftDetail,
  fetchHotAuctions,
  fetchNftsBreakdown
} from 'store/actions/thunks/nfts'

const ModalPurchase = ({ isOpen = false, onClose, isBid, nft, t }) => {
  const dispatch = useDispatch()
  const nftPurchaseState = useSelector(selectors.nftPurchaseState)
  const isPurchasing = nftPurchaseState.loading
  const { configuration, loadBalances } = useContext(DappifyContext)
  const [qty, setQty] = useState(1)
  const [totalPayable, setTotalPayable] = useState(qty * nft.price)
  const network = constants.NETWORKS[configuration.chainId]

  const getToken = () => `${nft?.metadata?.name} #${nft.tokenId}`

  useEffect(() => {
    const total = qty * nft.price
    setTotalPayable(total || 0)
  }, [nft.price, qty])

  useEffect(() => {
    return async () => {
      await dispatch(modalReset())
    }
  }, [dispatch, isOpen])

  const handleAction = async () => {
    await dispatch(purchaseNft(nft, qty))
  }

  const handleClose = async () => {
    dispatch(fetchNftDetail(nft.collection.address, nft.tokenId))
    dispatch(fetchHotAuctions())
    dispatch(fetchNftsBreakdown())
    loadBalances()
    onClose()
  }

  const getOperationTitle = () =>
    isBid ? <Typography variant='h5'>Your bid</Typography> : null

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='parent-modal-title'
      aria-describedby='parent-modal-description'
    >
      <DialogTitle>
        <Typography variant='title'>Confirm your purchase</Typography>
      </DialogTitle>
      <DialogContent className='content__modal'>
        <DialogContentText>
          {t('Purchase confirmation', {
            name: getToken(),
            price: nft.price,
            unit: network.nativeCurrency.symbol
          })}
        </DialogContentText>
        {nft.type === 'ERC1155' && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label={`${t('Numer of copies', { max: nft.quantity })} Max(${
                  nft.quantity
                })`}
                defaultValue={qty}
                fullWidth
                onChange={(e) => {
                  const newVal = parseInt(e.target.value)
                  setQty(newVal)
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled
                label={t('Total amount', {
                  currency: network.nativeCurrency.symbol
                })}
                value={totalPayable}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        {getOperationTitle()}
        <Grid container spacing={2}>
          <Verification nft={nft} t={t} />
          {isPurchasing && <ConfirmationWarning t={t} />}
          <OperationResult state={nftPurchaseState} t={t} />
        </Grid>
        <ModalActions
          state={nftPurchaseState}
          onClose={handleClose}
          handleAction={handleAction}
          t={t}
          confirmLabel='Purchase'
          loading={isPurchasing}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ModalPurchase
