import MenuIcon from '@mui/icons-material/Menu'
import { Avatar, Grid, Hidden, Stack, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageHeader, Search } from '@/components/Layouts/Header'
import {
  AlignGrid,
  backgroundColor,
  responsiveTextStyle,
  strokeColor,
  whiteColorStyle,
  yellow,
} from '@/styles'

interface HeaderProps {
  triggerSidebar: () => void
}

export const Header = ({ triggerSidebar }: HeaderProps) => {
  const { t } = useTranslation()
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
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
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
            LOGO
          </Typography>
        </AlignGrid>

        <AlignGrid item container xs={10}>
          <Grid item xs={4}>
            <Stack direction="row" justifyContent="space-around">
              <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                {t('tracking_list')}
              </Typography>
              <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                {t('menu')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Search />
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" justifyContent="space-around" alignItems="center">
              <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                {t('sign_in')}
              </Typography>
              <Typography sx={{ ...whiteColorStyle, ...responsiveTextStyle }} component="span">
                {t('sign_up')}
              </Typography>
              <LanguageHeader />
              <Avatar
                sx={{ width: '32px', height: '32px' }}
                alt="Remy Sharp"
                src={'/assets/images/avatar3.webp'}
              />
            </Stack>
          </Grid>
        </AlignGrid>
      </Hidden>

      {/* mobile */}
      <Hidden smUp>
        <AlignGrid item xs={2}>
          <IconButton onClick={triggerSidebar}>
            <MenuIcon sx={{ color: 'white' }} fontSize="large" />
          </IconButton>
        </AlignGrid>
        <AlignGrid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: yellow['primary'],
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
        </AlignGrid>
        <AlignGrid item xs={2}>
          <Avatar
            sx={{ width: '32px', height: '32px' }}
            alt="Remy Sharp"
            src={'/assets/images/avatar3.webp'}
          />
        </AlignGrid>
      </Hidden>
    </Grid>
  )
}
