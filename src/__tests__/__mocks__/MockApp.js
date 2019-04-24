import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'

import appStore from '~/reducers'
import theme from '~/styles/theme'


function MockApp({ children }) {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default MockApp
