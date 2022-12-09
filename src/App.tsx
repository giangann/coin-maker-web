import 'react-toastify/dist/ReactToastify.css'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { useAtom } from 'jotai'
import React, { Suspense, useEffect, useState } from 'react'
import { QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'

import { queryClient } from '@/libs/react-query'
import { Router } from '@/routers'
import { defaulTheme } from '@/styles'

import { getMe } from './libs/apis'
import { userAtomWithStorage } from './libs/atoms/authAtom'
const App = () => {
  const [userStorage, setUserStorage] = useAtom(userAtomWithStorage)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  useEffect(() => {
    getMe().then((res) => {
      setUserStorage(res.data.data)
      setIsAdmin(res.data.data.is_admin)
    })
  }, [])
  return (
    <>
      <ThemeProvider theme={defaulTheme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Suspense fallback="Loading...">
            <ToastContainer />
            <Router isAdmin={isAdmin} />
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  )
}

export default App
