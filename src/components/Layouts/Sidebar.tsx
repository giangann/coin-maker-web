import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import LineAxisOutlinedIcon from '@mui/icons-material/LineAxisOutlined'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import { Grid, ListItemIcon, MenuItem, MenuList, Popover, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import i18n from '@/libs/lang/translations/i18n'
import { validUrlRegex } from '@/libs/regex'
// import { Link } from 'react-router-dom'
import { backgroundColor, CustomLink, SidebarMenuItem, WhiteTypograpy } from '@/styles'

import { ArrowDropDownIcon } from '../Icons'

export const sidebarList = [
  {
    name: i18n.t('sidebar.all_kind_of_currency'),
    icon: <DashboardCustomizeOutlinedIcon sx={{ color: 'white' }} />,
    link: '/site-map',
  },
  // {
  //   name: i18n.t('sidebar.exchange'),
  //   icon: <CurrencyExchangeIcon sx={{ color: 'white' }} />,
  //   link: '#',
  // },
  {
    name: i18n.t('sidebar.comunity'),
    icon: <DashboardCustomizeOutlinedIcon sx={{ color: 'white' }} />,
    link: '#',
    children: [
      {
        name: i18n.t('sidebar.articles'),
        icon: <CurrencyExchangeIcon sx={{ color: 'white' }} />,
        link: 'https://coinmarketcap.com/community/vi/articles',
      },
    ],
  },
  {
    name: i18n.t('sidebar.product'),
    icon: <SplitscreenIcon sx={{ color: 'white' }} />,
    link: '#',
    children: [
      {
        name: i18n.t('product.exchange_tool'),
        icon: <CurrencyExchangeIcon sx={{ color: 'white' }} />,
        link: '/convert-tool',
      },
    ],
  },
  {
    name: i18n.t('sidebar.learn'),
    icon: <SplitscreenIcon sx={{ color: 'white' }} />,
    link: '#',
    children: [
      {
        name: i18n.t('sidebar.news'),
        icon: <LineAxisOutlinedIcon sx={{ color: 'white' }} />,
        link: 'https://coinmarketcap.com/vi/headlines/news/',
      },
      {
        name: i18n.t('sidebar.video'),
        icon: <CurrencyExchangeIcon sx={{ color: 'white' }} />,
        link: 'https://www.youtube.com/channel/UCnhdZlwVd6ocXGhdSyV9Axg',
      },
    ],
  },

  {
    name: i18n.t('sidebar.contact'),
    icon: <DashboardCustomizeOutlinedIcon sx={{ color: 'white' }} />,
    link: '/contact',
  },
]

type SidebarProps = {
  setOpen?: () => void
}

export const Sidebar = (props: SidebarProps) => {
  const [menuItemIndex, setMenuItemIndex] = useState(null)
  const { setOpen } = props
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number | string) => {
    setAnchorEl(event.currentTarget)
    setMenuItemIndex(index as any)
  }
  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigate = (link: string) => {
    if (link.match(validUrlRegex)) {
      window.open(link, '_blank')
    } else {
      navigate(link)
    }
  }

  const open = Boolean(anchorEl)

  return (
    <Grid container spacing={4}>
      {sidebarList.map((item, index) => (
        <Grid key={index} item xs={12}>
          <CustomLink to={item.link}>
            <Tooltip followCursor title={item.name} arrow placement="bottom-end">
              {/* @ts-ignore */}
              <SidebarMenuItem
                onClick={item.children ? (event: any) => handleClick(event, index) : () => {}}
              >
                {item.icon}
                <WhiteTypograpy
                  sx={{
                    ml: 2,
                    // ...item?.sxCustom,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {item.name}
                </WhiteTypograpy>
                {item.children ? (
                  <ArrowDropDownIcon style={{ marginLeft: 6, fontSize: 24 }} />
                ) : undefined}
              </SidebarMenuItem>
            </Tooltip>
          </CustomLink>

          {item.children ? (
            <Popover
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuList
                sx={{ border: '1px solid white', backgroundColor: backgroundColor['main'] }}
              >
                {sidebarList[menuItemIndex as any]?.children?.map((item: any, index: any) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleNavigate(item.link)
                      handleClose()
                      setOpen?.()
                    }}
                  >
                    <ListItemIcon> {item.icon}</ListItemIcon>
                    <WhiteTypograpy
                      sx={{
                        ml: 2,
                        ...item?.sxCustom,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {item.name}
                    </WhiteTypograpy>
                  </MenuItem>
                ))}
              </MenuList>
            </Popover>
          ) : undefined}
        </Grid>
      ))}
    </Grid>
  )
}
