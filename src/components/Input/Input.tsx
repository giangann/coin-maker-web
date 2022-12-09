import { FormControlProps, OutlinedInputProps } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'

import { AddControlProps, InputControl } from './InputControl'
import { InputStyled } from './InputStyled'

export type InputProps<T> = UseControllerProps<T> &
  OutlinedInputProps &
  AddControlProps & {
    controlProps?: FormControlProps
  }

function Input<T>({
  name,
  control,
  defaultValue,
  fullWidth,
  label,
  helperText,
  controlProps,
  required,
  ...props
}: InputProps<T>) {
  const {
    field: { ref, ...inputProps },
    fieldState: { error },
  } = useController({ name, control, defaultValue })

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      required={required}
      helperText={helperText}
      {...controlProps}
    >
      <InputStyled {...inputProps} {...props} inputRef={ref} />
    </InputControl>
  )
}

export { Input }
