import {
  Autocomplete,
  CircularProgress,
  FormControlProps,
  InputAdornment,
  OutlinedInputProps,
} from '@mui/material'
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

import { useSelectQuery } from '@/libs/hooks/useSelectQuery'

import { AddControlProps, InputControl } from '../Input'
import { InputStyled } from '../Input/InputStyled'
import { Tag } from './Tag'

export type UnknownObj = Record<string, unknown>
export type SelectOption = {
  label: string
  value: unknown
}

export type SelectQueryProps<T extends UnknownObj> = {
  query?: string
  queryFilter?: string
  addQueryFilter?: UnknownObj
  labelValueKeys?: [keyof T, keyof T]
}

export type LabelValueType<T> = [keyof T, keyof T]

export type BaseSelectProps<T, F> = UseControllerProps<F> &
  AddControlProps &
  OutlinedInputProps & {
    controlProps?: FormControlProps
    options?: SelectOption[]
    multiple?: boolean
    loading?: boolean
    labelValueKeys?: LabelValueType<T>
  }

export type SelectProps<T extends UnknownObj, F> = BaseSelectProps<T, F> & SelectQueryProps<T>

const defaultKey = ['name', 'id']

function Select<T extends UnknownObj, F = any>({
  name,
  control,
  defaultValue,
  fullWidth,
  label,
  helperText,
  controlProps,
  options: rawOptions,
  multiple,
  loading,
  disabled,
  query,
  required,
  queryFilter,
  addQueryFilter,
  labelValueKeys = defaultKey as LabelValueType<T>,
  ...props
}: SelectProps<T, F>) {
  const {
    field: { ref, onChange, onBlur, value: rawValue },
    fieldState: { error },
  } = useController({ name, control, defaultValue })

  const [inputValue, setInputValue] = useState('')

  const queryParams = useMemo(() => {
    if (!queryFilter && !addQueryFilter) return { per_page: -1 }
    const inputParams = inputValue && queryFilter ? { [queryFilter]: inputValue } : undefined

    return { per_page: -1, ...inputParams, ...addQueryFilter }
  }, [addQueryFilter, inputValue, queryFilter])

  const { options: queryOptions, isLoading } = useSelectQuery<T>({
    endpoint: query,
    params: queryParams,
    labelValueKeys: labelValueKeys as [keyof T, keyof T],
    enabled: !!query,
  })

  const filterValue = useCallback(
    (value: unknown | unknown[]) => {
      const _options = query ? queryOptions : rawOptions

      if (!_options) {
        return multiple ? [] : null
      }

      if (multiple) {
        return (
          _options.filter(
            (option) => ((value as unknown[]) || []).findIndex((el) => el === option.value) !== -1,
          ) || []
        )
      }

      return _options.find((option) => option.value === value) || null
    },
    [query, queryOptions, rawOptions, multiple],
    // []
  )

  const [value, setValue] = useState<SelectOption | SelectOption[] | null>(null)

  useEffect(() => {
    setValue(filterValue(rawValue))
  }, [rawValue, filterValue, multiple])

  const handleChangeValue = (
    e: SyntheticEvent<Element, Event>,
    newValue: SelectOption | SelectOption[] | null,
  ) => {
    if (!newValue) {
      return
    }
    if (multiple) {
      const _value = (newValue as SelectOption[]).map((option) => option.value)
      onChange(_value)
    } else {
      onChange((newValue as SelectOption).value)
      setInputValue((newValue as SelectOption).label)
    }

    setValue(newValue)
  }

  const handleChangeInputValue = (e: SyntheticEvent<Element, Event>, newValue: string) => {
    setInputValue(newValue)
    if (!newValue) {
      onChange('')
    }
  }

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      required={required}
      helperText={helperText}
      {...controlProps}
    >
      <Autocomplete
        value={value}
        inputValue={inputValue}
        onChange={handleChangeValue}
        onInputChange={handleChangeInputValue}
        multiple={multiple}
        onBlur={onBlur}
        ref={ref}
        loading={loading || isLoading}
        disablePortal
        options={rawOptions || queryOptions}
        isOptionEqualToValue={(options, value) => options.value === value.value}
        disabled={disabled}
        renderInput={(params) => (
          <InputStyled
            fullWidth
            disabled={disabled}
            {...params.InputProps}
            inputProps={params.inputProps}
            endAdornment={
              <InputAdornment position="end">
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </InputAdornment>
            }
            {...props}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option: SelectOption, index: number) => (
            <Tag label={option.label} {...getTagProps({ index })} key={index} />
          ))
        }
      />
    </InputControl>
  )
}

export { Select }
