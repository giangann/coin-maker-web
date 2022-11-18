import { Box, Button, Hidden, Popover, styled, Typography } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FlagEn from '@/assets/svgs/en.svg'
import FlagVn from '@/assets/svgs/vn.svg'
import i18n from '@/libs/lang/translations/i18n'

const LANGUAGES = [
  {
    name: i18n.t('language.vietnamese'),
    symbol: 'vi',
    flag: FlagVn,
  },
  {
    name: i18n.t('language.english'),
    symbol: 'en',
    flag: FlagEn,
  },
]

export const LanguageHeader = () => {
  const [displayMenu, setDisplayMenu] = useState<string>('none')
  const [flag, setFlag] = useState<string>('')
  const [languages, setLanguages] = useState()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleOpenMenu = (e: any) => {
    displayMenu === 'none' ? setDisplayMenu('') : setDisplayMenu('none')
    handleClick(e)
  }
  const { i18n } = useTranslation()
  const handleSetLang = (l: any) => {
    i18n.changeLanguage(l.symbol)
    localStorage.setItem('language', l.symbol)
    setFlag(l.flag)
    setLanguages(l.name)
    // handleOpenMenu()
    location.reload()
  }

  const setLang = async () => {
    const symbol = await localStorage.getItem('language')
    if (symbol) {
      const l = LANGUAGES.find((i) => i.symbol === symbol)
      //@ts-ignore
      setLanguages(l.name)
      //@ts-ignore
      setFlag(l.flag)
    } else {
      //@ts-ignore
      setLanguages('English')
      setFlag(FlagEn)
    }
  }
  useEffect(() => {
    setLang()
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <React.Fragment>
      <Box>
        <LanguageButton onClick={handleOpenMenu} type="button">
          <ListItemIcon sx={{ justifyContent: 'center' }}>
            <img src={flag} alt="flag" style={{ width: '40px', height: '40px' }} />
          </ListItemIcon>
          <Hidden mdUp>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize',
                color: '#fff',
              }}
            >
              {languages}
            </Typography>
          </Hidden>
        </LanguageButton>

        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <MenuList>
            {LANGUAGES.map((l, index) => (
              <MenuFlagItem
                key={index}
                onClick={() => {
                  handleSetLang(l)
                }}
              >
                <ListItemIcon>
                  <img src={l.flag} alt="flag" style={{ width: '40px', height: '40px' }} />
                </ListItemIcon>
                <LanguageButton type="button">{l.name}</LanguageButton>
              </MenuFlagItem>
            ))}
          </MenuList>
        </Popover>
      </Box>
    </React.Fragment>
  )
}
const LanguageButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    background: 'rgba(89, 195, 255, 0.1)',
  },
  fontSize: theme.spacing(1.75),
  fontWeight: 600,
  lineHeight: theme.spacing(3.5),
  textTransform: 'uppercase',
  color: theme.palette.grey[600],
  // margin: 30,
  padding: `0px ${theme.spacing(1)}`,
  '& span': {
    paddingBottom: '4px',
  },
}))
const MenuFlagItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    background: 'rgba(89, 195, 255, 0.1)',
  },
}))

const Overlay = styled('div')(() => ({
  position: 'absolute',
  width: '100%',
  height: '100vh',
  background: '#0000',
  left: '0',
  margin: '0px 20px',
}))
