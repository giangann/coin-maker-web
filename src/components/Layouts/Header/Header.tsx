import MenuIcon from '@mui/icons-material/Menu'
import { Button, Grid, Hidden, Stack, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CurrencyHeader, LanguageHeader, Notification, Search } from '@/components/Layouts/Header'
import { userAtomWithStorage, userProfileImage } from '@/libs/atoms/authAtom'
import { LoginDialog } from '@/screens/auth/LoginDialog'
import {
  AlignGrid,
  backgroundColor,
  CustomLink,
  responsiveTextStyle,
  strokeColor,
  whiteColorStyle,
  yellow,
} from '@/styles'

import { ProfileHeader } from './ProfileHeader'

interface HeaderProps {
  triggerSidebar: () => void
}

export const Header = ({ triggerSidebar }: HeaderProps) => {
  const { t } = useTranslation()

  const [userStorage, setUserStorage] = useAtom(userAtomWithStorage)
  const [profileImage, setProfileImage] = useAtom(userProfileImage)
  const isLoggined = userStorage ? true : false
  const navigate = useNavigate()
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false)

  const handleClose = () => {
    setOpenLoginDialog(false)
  }

  const handleLogout = () => {
    setUserStorage(null)
    localStorage.setItem('user-token', 'null')
    setProfileImage(null)
    navigate('/')
    window.location.reload()
  }

  const handleNavigate = () => {
    navigate('/watch-list')
  }

  return (
    <Grid
      container
      sx={{
        backgroundColor: backgroundColor['primary'],
        borderBottom: `1px solid ${strokeColor['primary']}`,
        height: '90px',
      }}
      spacing={2}
    >
      {/* desktop */}
      <Hidden smDown>
        <AlignGrid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CustomLink to="/">
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: yellow['primary'],
                textDecoration: 'none',
              }}
            >
              RUBY_COIN
            </Typography>
          </CustomLink>
        </AlignGrid>

        <AlignGrid item container xs={10}>
          <Grid item xs={4}>
            <Stack direction="row" justifyContent="space-around">
              <Button onClick={handleNavigate}>
                <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                  {t('watch_list.name')}
                </Typography>
              </Button>
              <Button>
                <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                  {t('menu')}
                </Typography>
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Search />
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" justifyContent="space-around" alignItems="center">
              {isLoggined ? (
                <Button onClick={handleLogout}>
                  <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                    {t('log_out')}
                  </Typography>
                </Button>
              ) : (
                <Button onClick={() => setOpenLoginDialog(true)}>
                  <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                    {t('sign_in')}
                  </Typography>
                </Button>
              )}
              <LanguageHeader />
              <CurrencyHeader />
              <Notification />
              <ProfileHeader handleLogout={handleLogout} />
            </Stack>
          </Grid>
        </AlignGrid>
      </Hidden>

      {/* mobile */}
      <Hidden smUp>
        <AlignGrid item xs={4}>
          <IconButton onClick={triggerSidebar}>
            <MenuIcon sx={{ color: 'white' }} fontSize="large" />
          </IconButton>
        </AlignGrid>
        <AlignGrid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            // noWrap
            component="a"
            href="/"
            sx={{
              // mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: yellow['primary'],
              textDecoration: 'none',
            }}
          >
            RUBYCOIN
          </Typography>
        </AlignGrid>
        <AlignGrid item xs={4} sx={{ justifyContent: { xs: 'end', sm: 'inherit' } }}>
          <Notification />
          <ProfileHeader handleLogout={handleLogout} />
        </AlignGrid>
      </Hidden>

      {/* Login dialog */}
      <LoginDialog open={openLoginDialog} handleClose={handleClose} />
    </Grid>
  )
}
