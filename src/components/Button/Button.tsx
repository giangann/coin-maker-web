import { Button as ButtonMUI, ButtonProps } from '@mui/material'
import React from 'react'

type TButton = {
  component?: 'string' | React.ElementType
} & ButtonProps

export const Button: React.FC<TButton> = ({ children, component = '', ...ButtonProps }) => {
  return (
    // @ts-ignore
    <ButtonMUI {...ButtonProps} sx={{ ...ButtonProps['sx'] }} component={component}>
      {children}
    </ButtonMUI>
  )
}
