import React from 'react'

import { BoxFlexCenter, FooterTitleText } from '@/styles'

export const Footer = () => {
  return (
    <BoxFlexCenter sx={{ borderTop: '1px solid #797c87', px: { xs: 4, sm: 8 }, py: 4, mt: 4 }}>
      <FooterTitleText>@ 2022 RubyCoin</FooterTitleText>
    </BoxFlexCenter>
  )
}
