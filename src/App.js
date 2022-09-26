import { useContext } from 'react'
import { DappifyContext, Template } from 'react-dappify'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import Routes from 'Routes'

const App = () => {
  const { configuration } = useContext(DappifyContext)
  const theme = createTheme(configuration?.theme)

  const template = Template.current()
  i18n.use(initReactI18next).init(template?.translation || {})

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  )
}

export default App
