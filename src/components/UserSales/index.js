import React, { memo, useContext, useEffect, useState } from 'react'
import { DappifyContext, constants, utils } from 'react-dappify'
import { Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from '@reach/router'
import UserAvatar from 'components/UserAvatar'
import { formatPrice } from 'utils/format'
import axios from 'axios'

const { cropText, formatAddress } = utils.format

// react functional component
const UserSales = ({ user, index }) => {
  const { configuration } = useContext(DappifyContext)
  // const network = constants.NETWORKS[configuration.chainId]
  const navigate = useNavigate()
  const theme = useTheme()

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
    <>
      <Grid container direction='row' justify='left' spacing={1}>
        <Grid item className='avatar__index'>
          {index + 1}.
        </Grid>
        <Grid item>
          <UserAvatar user={user} />
        </Grid>
        <Grid item>
          <Grid container direction='column' justify='left' spacing={1}>
            <Grid item>
              <Typography
                fontWeight='900'
                sx={{
                  fontSize: '16px',
                  fontWeight: '600',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => {
                  navigate(
                    `/${process.env.REACT_APP_TEMPLATE_NAME}/profile/${user.wallet}`
                  )
                }}
              >
                {user.username && cropText(user.username, 12)}
                {!user.username && formatAddress(user.wallet)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  opacity: 0.7,
                  fontWeight: '400'
                }}
              >
                {formatPrice(user.totalSales)} {network?.nativeCurrency?.symbol}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default memo(UserSales)
