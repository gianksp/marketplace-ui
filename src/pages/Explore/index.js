import { useContext, useEffect, useState } from 'react'
import NTFGridContainer from 'components/NTFGridContainer'
import Footer from 'components/Segment/Footer'
import { DappifyContext, Property, utils } from 'react-dappify'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from '../../store/selectors'
import { fetchNfts } from 'store/actions/thunks'
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useLocation } from '@reach/router'
import { parse } from 'query-string'

const { toUri } = utils.format

const Explore = ({ t }) => {
  const location = useLocation()
  const { configuration } = useContext(DappifyContext)
  const dispatch = useDispatch()
  const nftItems = useSelector(selectors.nftsState)
  const nfts = nftItems?.data ? nftItems.data : []
  const [categories] = useState(Property.findAllWithType({ type: 'category' }))
  const [category, setCategory] = useState(
    categories.find((cat) => toUri(cat.key) === parse(location.search).category)
      ?.key
  )

  useEffect(() => {
    const status = 'OfferingPlaced'
    dispatch(fetchNfts({ category, status }))
  }, [dispatch, configuration, category])

  const renderCategories = () => {
    const list = []
    categories?.forEach((cat) => {
      list.push(
        <MenuItem value={cat.key} key={cat.key}>
          {t(cat.key)}
        </MenuItem>
      )
    })
    return list
  }

  const filter = (
    <Grid container direction='row' sx={{ my: 3 }}>
      <Grid item>
        <FormControl sx={{ minWidth: 120 }} size='small'>
          <InputLabel id='demo-select-small'>{t('Category')}</InputLabel>
          <Select
            labelId='demo-select-small'
            value={category}
            id='demo-select-small'
            label='Category'
            onChange={(e) => {
              setCategory(e.target.value)
            }}
          >
            <MenuItem value=''>
              <em>{t('All')}</em>
            </MenuItem>
            {renderCategories()}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )

  return (
    <div className='theme-background'>
      <section className='jumbotron breadcumb no-bg subheader'>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>{t('Explore')}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='container'>
        {filter}
        <NTFGridContainer
          t={t}
          sizes={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          nfts={nfts}
        />
      </section>
      <Footer t={t} />
    </div>
  )
}

export default Explore
