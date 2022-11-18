import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import LineAxisOutlinedIcon from '@mui/icons-material/LineAxisOutlined'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import { Grid, ListItemIcon, MenuItem, MenuList, Popover, Tooltip } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import i18n from '@/libs/lang/translations/i18n'
// import { Link } from 'react-router-dom'
import { backgroundColor, CustomLink, SidebarMenuItem, WhiteTypograpy, yellow } from '@/styles'

import { ArrowDropDownIcon } from '../Icons'

export const sidebarList = [
  {
    name: i18n.t('sidebar.all_kind_of_currency'),
    icon: <DashboardCustomizeOutlinedIcon sx={{ color: 'white' }} />,
    link: '/site-map',
  },
  {
    name: i18n.t('sidebar.exchange'),
    icon: <CurrencyExchangeIcon sx={{ color: 'white' }} />,
    link: '#',
  },
  {
    name: i18n.t('sidebar.comunity'),
    icon: <DashboardCustomizeOutlinedIcon sx={{ color: 'white' }} />,
    link: '#',
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
    name: i18n.t('sidebar.contact'),
    icon: <DashboardCustomizeOutlinedIcon sx={{ color: 'white' }} />,
    link: '#',
  },
  {
    name: i18n.t('sidebar.view_demo_chart'),
    icon: <LineAxisOutlinedIcon sx={{ color: 'white' }} />,
    link: '/chart',
    sxCustom: { color: yellow['primary'] },
  },
]

export const Sidebar = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  return (
    <Grid container spacing={4}>
      {sidebarList.map((item, index) => (
        <Grid key={index} item xs={12}>
          <CustomLink to={item.link}>
            <Tooltip followCursor title={item.name} arrow placement="bottom-end">
              {/* @ts-ignore */}
              <SidebarMenuItem onClick={item.children ? handleClick : () => {}}>
                {item.icon}
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
                {item?.children?.map((item: any, index: any) => (
                  <MenuItem key={index} onClick={() => navigate(item.link)}>
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
