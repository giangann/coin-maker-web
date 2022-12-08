import { Box, FormControl, FormControlProps } from '@mui/material'
import React, { memo } from 'react'
import { FieldError } from 'react-hook-form'

import { FormHelper } from './FormHelper'
import { FormLabel } from './FormLabel'

export type AddControlProps = {
  helperText?: string | React.ReactNode
  label?: string
  fieldError?: FieldError | boolean
}

export type InputControlProps = FormControlProps<'div', AddControlProps>

function RawInputControl({
  fieldError,
  fullWidth,
  label,
  helperText,
  children,
  required,
  ...props
}: InputControlProps) {
  return (
    <FormControl fullWidth={fullWidth} error={!!fieldError} {...props}>
      {label && (
        <FormLabel>
          {required ? (
            <>
              {label}
              <Box sx={{ marginLeft: '3px' }} component="span" color="red">
                *
              </Box>
            </>
          ) : (
            `${label}`
          )}
        </FormLabel>
      )}

      {children}

      {!!fieldError && (
        <FormHelper error>
          {typeof fieldError === 'boolean' ? helperText : fieldError?.message}
        </FormHelper>
      )}
      {helperText && <FormHelper error={false}>{helperText}</FormHelper>}
    </FormControl>
  )
}

const InputControl = memo(RawInputControl) as typeof RawInputControl

export { InputControl }
