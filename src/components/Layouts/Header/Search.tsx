import './style.css'

import SearchIcon from '@mui/icons-material/Search'
import { ClickAwayListener, InputBase } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import React, { useRef, useState } from 'react'

import { request } from '@/libs/request'
import { ICoinLaravel } from '@/libs/types'

import { SearchDropDown } from './SearchDropDown'

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (props) => props !== 'backgroundColor',
})<{ backgroundColor?: string }>(({ theme, backgroundColor, fullWidth }) => ({
  color: 'inherit',
  width: fullWidth ? '100%' : '50%',
  backgroundColor: backgroundColor ?? 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))
export const SearchContainer = styled('div')(({ theme }) => ({
  zIndex: 10,
  height: '40px',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const Search = () => {
  const [openDropDown, setOpenDropDown] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState<ICoinLaravel[] | null>(null)
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null)

  const handleSearchTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(async () => {
      const res = await request.get('coin/search', {
        params: {
          keyword: e.target.value,
        },
      })
      setSearchResult(res.data)
      setOpenDropDown(true)
    }, 500)
  }

  // handle off:
  const handleClickAway = () => {
    setOpenDropDown(false)
  }

  const handleCloseDropDown = () => {
    setOpenDropDown(false)
  }
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <SearchContainer>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          ref={inputRef}
          value={searchText}
          onChange={handleSearchTextChange}
          fullWidth
        />

        <SearchDropDown
          searchResult={searchResult}
          open={openDropDown}
          handleClose={handleCloseDropDown}
        />
      </SearchContainer>
    </ClickAwayListener>
  )
}
