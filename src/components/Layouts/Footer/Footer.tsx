import React from 'react'

import { BoxFlexCenter, FooterTitleText } from '@/styles'

export const Footer = () => {
  return (
    <BoxFlexCenter
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        borderTop: '1px solid #797c87',
        px: { xs: 0, sm: 8 },
        py: 4,
        mt: 4,
      }}
    >
      <FooterTitleText sx={{ margin: 'auto', textAlign: { xs: 'center', sm: 'unset' } }}>
        @ 2022 RubyCoin
      </FooterTitleText>
    </BoxFlexCenter>
  )
}
