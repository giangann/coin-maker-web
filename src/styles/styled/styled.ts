import { Box, Grid, Link as LinkMUI, MenuItem, styled, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { backgroundColor } from '@/styles'

export const BoxImage = styled(Box)({
  width: 28,
  height: 28,
})

export const imageStyle = {
  width: 20,
  height: 20,
}

export const GridWithBackground = styled(Grid)({
  backgroundColor: backgroundColor['primary'],
})

export const FooterTitleText = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: 32,
  fontWeight: 600,
  letterSpacing: 6,
  opacity: 0.7,

  [theme.breakpoints.down('sm')]: {
    fontSize: 24,
  },
}))

export const WhiteTypograpy = styled(Typography)({
  color: 'white',
})

export const whiteColorStyle = {
  color: 'white',
}

export const responsiveTextStyle = {
  fontSize: { xs: 12, sm: 14 },
}

export const responsiveBiggerTextStyle = {
  fontSize: { xs: 14, sm: 16 },
}

export const SidebarMenuItem = styled(MenuItem)({
  width: '100%',
})

export const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: '#fff',
})

export const CustomLinkMUI = styled(LinkMUI)({
  textDecoration: 'none',
  color: '#fff',
})

export const MenuItemStyled = styled(MenuItem)({
  minWidth: '150px',
  backgroundColor: backgroundColor['primary'] + ' !important',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
  fontWeight: 700,
})

export const CurveBoxWithCustomBackground = styled(Box, {
  shouldForwardProp: (props) => props !== 'bgColor',
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  // width: 'fit-content',
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1),
  backgroundColor: bgColor ?? 'none',
  // overflow: 'hidden',
  // whiteSpace: 'nowrap',
  // textOverflow: 'elipsis',
}))

// export const BoxGreyBorder = styled(Box)({
//   border: ''
// })

export const DotWithColor = styled(Box, {
  shouldForwardProp: (props) => props !== 'dotColor' && props !== 'size',
})<{ dotColor?: string; size: number }>(({ theme, dotColor, size }) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  backgroundColor: dotColor ?? 'rgba(255, 255, 255, 0.5)',
}))
