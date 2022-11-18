import { Button, Grid, Menu, MenuItem } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AlignGrid, backgroundColor, strokeColor, WhiteTypograpy } from '@/styles'

import { Search } from './Search'

export const SubHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { t } = useTranslation()

  const headerList = [
    {
      name: t('watch_list.name'),
      link: '/watch-list',
    },
    {
      name: t('menu'),
      link: '#',
    },
  ]

  const navigate = useNavigate()
  const handleClickSubHeaderMenu = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <Grid
      container
      sx={{
        backgroundColor: backgroundColor['primary'],
        borderBottom: `1px solid ${strokeColor['primary']}`,
        height: '70px',
      }}
    >
      <AlignGrid item xs={3}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickSubHeaderMenu}
        >
          <WhiteTypograpy sx={{ textTransform: 'none', fontWeight: 700 }}>Menu</WhiteTypograpy>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            sx: { border: '1px solid white', backgroundColor: backgroundColor['main'] },
          }}
        >
          {headerList.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose()
                navigate(item.link)
              }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </AlignGrid>
      <AlignGrid item xs={8}>
        <Search />
      </AlignGrid>
    </Grid>
  )
}
