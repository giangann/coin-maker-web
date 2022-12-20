import { Box, Stack, useMediaQuery } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsCaretDownFill, BsCaretUpFill, BsFileEarmarkImage } from 'react-icons/bs'
import { TiDelete } from 'react-icons/ti'
import { toast } from 'react-toastify'

import { Button } from '@/components/Button'
import { ButtonCustomDisableColor } from '@/components/Form'
import { InforUser } from '@/components/Interaction'
import { TAG_POST } from '@/constants'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { LoginDialog } from '@/screens/auth'
import {
  backgroundColor,
  BoxFlexCenter,
  BoxFlexCenterSpaceBetween,
  text as textColor,
} from '@/styles'
import { grey } from '@/styles/colors'

interface IPostForm {
  coin_id: string
}

export const PostForm: React.FC<IPostForm> = ({ coin_id }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { userStorage, userAvatar } = useAuth()
  const { t } = useTranslation()
  const [text, setText] = useState<string>('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [tagPost, setTagPost] = useState<number>(TAG_POST['UNSET'])
  const [files, setFiles] = useState<File>()

  const handleTextChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setText(e.target.value)
  }

  const handleSubmit = async () => {
    if (!userStorage) {
      handleOpenDialog()
      return
    }

    if (text.trim().length === 0 && !files?.type) {
      toast.error(t('post.require_post'))
      return
    }

    try {
      const formData = new FormData()
      formData.append('coin_id', coin_id)
      formData.append('content', text)
      formData.append(
        'tag',
        (tagPost === TAG_POST['UNSET'] ? TAG_POST['UNSET'] : tagPost).toString(),
      )
      if (files) {
        formData.append('image', files)
      }

      setIsLoading(true)
      const res = await request.post('/post', formData)
      setIsLoading(false)

      if (res.status === 200) {
        toast.success('success')
        setText('')
        setTagPost(TAG_POST['UNSET'])
        setFiles(undefined)
        queryClient.fetchQuery([`post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`], {
          staleTime: 2000,
        })
      }
    } catch (error) {
      toast.error(error as string)
    }
  }

  const hanleEditTag = (tag: number) => {
    setTagPost(tag)
  }

  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setOpenLoginDialog(false)
  }

  const handleOpenDialog = () => {
    setOpenLoginDialog(true)
  }

  return (
    <>
      <Stack
        sx={{ backgroundColor: backgroundColor['post'], padding: '20px', borderRadius: '8px' }}
      >
        <BoxFlexCenterSpaceBetween>
          <InforUser user_name={userStorage?.name || ''} user_avatar={userAvatar || ''} />
          <BoxFlexCenter gap="12px">
            <Button
              startIcon={<BsCaretUpFill size="14px" />}
              variant={tagPost === TAG_POST['BULLISH'] ? 'contained' : 'outlined'}
              size="small"
              color="success"
              sx={{ textTransform: 'capitalize' }}
              onClick={() =>
                hanleEditTag(
                  tagPost === TAG_POST['BULLISH'] ? TAG_POST['UNSET'] : TAG_POST['BULLISH'],
                )
              }
            >
              {t('bullish')}
            </Button>
            <Button
              startIcon={<BsCaretDownFill size="14px" />}
              variant={tagPost === TAG_POST['BEARISH'] ? 'contained' : 'outlined'}
              size="small"
              color="error"
              sx={{ textTransform: 'capitalize' }}
              onClick={() =>
                hanleEditTag(
                  tagPost === TAG_POST['BEARISH'] ? TAG_POST['UNSET'] : TAG_POST['BEARISH'],
                )
              }
            >
              {t('bearish')}
            </Button>
          </BoxFlexCenter>
        </BoxFlexCenterSpaceBetween>
        <input
          style={{
            padding: '20px',
            border: 'none',
            outline: 'none',
            borderRadius: '8px',
            marginTop: '16px',
            width: '100%',
            backgroundColor: '#323546',
            color: textColor['primary'],
          }}
          onChange={handleTextChange}
          value={text}
          placeholder="Write your review of Bitcoin"
        />
        {files ? (
          <Box position="relative" width="max-content">
            <Box
              component="img"
              sx={{
                width: '100%',
                maxWidth: {
                  xs: 275,
                  sm: 375,
                },
                marginTop: '16px',
              }}
              src={files.type ? URL.createObjectURL(files) : ''}
              alt="preview"
            />
            <TiDelete
              size="28px"
              color={grey['primary']}
              style={{
                position: 'absolute',
                top: '18px',
                right: '2px',
                cursor: 'pointer',
                zIndex: 1,
              }}
              onClick={() => setFiles(undefined)}
            />
          </Box>
        ) : null}
        <Box sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            component="label"
            sx={{ width: 'max-content', marginTop: '12px', marginRight: '12px' }}
            size={isMobile ? 'small' : 'medium'}
            startIcon={<BsFileEarmarkImage size="14px" />}
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                const listFile = e.target.files as FileList
                const file = listFile[0]
                setFiles(file)
              }}
            />
            {t('image')}
          </Button>
          <ButtonCustomDisableColor
            variant="contained"
            sx={{ width: 'max-content', marginTop: '12px' }}
            onClick={handleSubmit}
            size={isMobile ? 'small' : 'medium'}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <CircularProgress size={isMobile ? 22.75 : 24.5} /> : t('post.name')}
          </ButtonCustomDisableColor>
        </Box>
      </Stack>

      <LoginDialog open={openLoginDialog} handleClose={handleCloseDialog} />
    </>
  )
}
