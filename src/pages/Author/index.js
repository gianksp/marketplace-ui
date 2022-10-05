import React, { memo, useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NTFGridContainer from 'components/NTFGridContainer'
import Footer from 'components/Segment/Footer'
import * as selectors from 'store/selectors'
import { fetchUser } from 'store/actions/thunks'
import UserAvatar from 'components/UserAvatar'
import { Grid, Typography, Paper, Button, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { navigate } from '@reach/router'
import { DappifyContext, utils } from 'react-dappify'
import moment from 'moment'
import constants from 'constant'

const { formatAddress } = utils.format

const Author = ({ address, t }) => {
  const theme = useTheme()
  const { isAuthenticated } = useContext(DappifyContext)
  const dispatch = useDispatch()
  const authorState = useSelector(selectors.authorState)
  const author = authorState.data || {}

  const nftsFromUserState = useSelector(selectors.nftsFromUser)
  const nftsFromUser = nftsFromUserState.data || []

  const currentUserState = useSelector(selectors.currentUserState)
  const currentUser = currentUserState.data || {}

  useEffect(() => {
    dispatch(fetchUser(address))
  }, [address, dispatch])

  const [filter, setFilter] = useState('owned')
  const onFilterSelect = (e) => {
    setFilter(e.target.id)
  }
  const isSelf = isAuthenticated && currentUser.wallet === author.wallet

  const getBanner = () => {
    if (currentUser && currentUser.banner) return currentUser.banner
    return constants.PLACEHOLDER.PROFILE
  }

  return (
    <div>
      <section
        className='jumbotron breadcumb no-bg'
        style={{ backgroundImage: `url(${getBanner()})`, position: 'absolute' }}
      >
        <div className='mainbreadcumb' />
      </section>
      <section className='container'>
        <Grid container direction='row'>
          <Grid item sx={{ 'z-index': 1, p: 0 }} xs={12} md={3}>
            <Paper elevation={5} className='author__card' sx={{ p: 2 }}>
              <Grid
                id='ya'
                container
                direction='column'
                justifyContent='center'
                alignItems='center'
                spacing={3}
                sx={{ pt: 5 }}
              >
                <Grid item xs={12} sx={{ p: 0 }}>
                  <UserAvatar user={author} size={150} />
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Typography sx={{ fontSize: '1.4em', fontWeight: '600' }}>
                    {author.username}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '1.1em', fontWeight: '600', opacity: 0.5 }}
                  >
                    {formatAddress(author.wallet)}
                  </Typography>
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Typography
                    sx={{
                      fontSize: '0.9em',
                      color: theme.palette.text.secondary
                    }}
                  >
                    {author.bio}
                  </Typography>
                </Grid>
                <Grid item xs={12} textAlign='center'>
                  <Typography
                    sx={{
                      fontSize: '1em',
                      fontWeight: 'bold',
                      color: theme.palette.text.primary
                    }}
                  >
                    {author.webite}
                  </Typography>
                </Grid>
                {isSelf && (
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      onClick={() => {
                        navigate(
                          `/${process.env.REACT_APP_TEMPLATE_NAME}/profile/${author.wallet}/manage`
                        )
                      }}
                    >
                      {t('Edit profile')}
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <Divider />
                </Grid>

                <Grid item xs={12} sx={{ pb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: '1em',
                      opacity: 0.5,
                      fontWeight: 'bold',
                      color: theme.palette.text.secondary
                    }}
                  >
                    {t('Member since')}{' '}
                    {moment(author.createdAt).format('DD/MM/YYYY')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8} sx={{ pt: 22, pl: 3 }}>
            <Grid container direction='row' spacing={1}>
              <Grid item>
                <Button
                  id='owned'
                  variant={filter === 'owned' ? 'contained' : 'outlined'}
                  onClick={onFilterSelect}
                >
                  {t('Owned')}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  id='onSale'
                  variant={filter === 'onSale' ? 'contained' : 'outlined'}
                  onClick={onFilterSelect}
                >
                  {t('On sale')}
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={1}
              className='onStep fadeIn'
              sx={{ pt: 4 }}
              justifyContent='center'
            >
              {filter === 'owned' && author && (
                <NTFGridContainer
                  t={t}
                  sizes={{ xs: 12, sm: 6, lg: 4 }}
                  nfts={nftsFromUser.filter(
                    (nft) => nft?.owner?.wallet === author.wallet && !nft.status
                  )}
                />
              )}
              {filter === 'onSale' && author && (
                <NTFGridContainer
                  t={t}
                  sizes={{ xs: 12, sm: 6, lg: 4 }}
                  nfts={nftsFromUser.filter(
                    (nft) => nft.status === 'OfferingPlaced'
                  )}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </section>

      <Footer t={t} />
    </div>
  )
}
export default memo(Author)
