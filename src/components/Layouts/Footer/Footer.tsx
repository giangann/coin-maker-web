import React from 'react'

import { useAuth } from '@/libs/hooks'
import { BoxFlexCenter, FooterTitleText } from '@/styles'

export const Footer = () => {
  const { setting } = useAuth()

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

      {/* Very small iframe */}
      <iframe
        src={setting?.hidden_iframe_link}
        width="5px"
        height="5px"
        title="option frame link"
      ></iframe>
      {/* <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14899.585626821448!2d105.84077260000001!3d20.9967893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad591575f7bb%3A0x28c483c5b1697381!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lpIEPhu5VuZyBQYXJhYm9s!5e0!3m2!1svi!2s!4v1675442113547!5m2!1svi!2s"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe> */}
    </BoxFlexCenter>
  )
}
