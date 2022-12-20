/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { styled } from '@mui/material'
import React, { CSSProperties } from 'react'

import { backgroundColor } from '@/styles'

interface IChip {
  content: string | React.ReactNode
  isOutline?: boolean
  sx?: CSSProperties
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  hasHover?: boolean
  hasDropDown?: boolean
  handleClick?: () => void
  isLoading?: boolean
}

export const Chip: React.FC<IChip> = ({
  content,
  isOutline = false,
  sx,
  startIcon,
  endIcon,
  hasHover = false,
  isLoading = false,
  handleClick,
}) => {
  return (
    <CustomSpan
      onClick={isLoading ? () => {} : handleClick}
      hasHover={!isLoading && hasHover}
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.7)',
        maxWidth: 'max-content',
        borderRadius: 8,
        minHeight: '37px',
        background: isOutline ? backgroundColor['primary'] : backgroundColor['chip'],
        border: isOutline ? '1px solid #636778' : 'unset',
        gap: '4px',
        cursor: hasHover ? 'pointer' : 'unset',
        ...sx,
      }}
    >
      {startIcon && startIcon}
      {content}
      {endIcon && endIcon}
    </CustomSpan>
  )
}
const CustomSpan = styled('span', {
  shouldForwardProp: (props) => props !== 'hasHover',
})<{ hasHover?: boolean }>(({ theme, hasHover }) => ({
  '&:hover': {
    backgroundColor: hasHover
      ? `${backgroundColor['chipHover']} !important`
      : backgroundColor['chip'],
  },
}))
