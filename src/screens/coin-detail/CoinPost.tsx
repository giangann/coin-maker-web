import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/Card'
import { ListPost, PostForm } from '@/components/Interaction'
interface ICoinPost {
  coin_id: string
}

export const CoinPost: React.FC<ICoinPost> = ({ coin_id }) => {
  const { t } = useTranslation()
  return (
    <div style={{ marginTop: '16px' }}>
      <Card title={t('chat_together')} hasMore={false}>
        <PostForm coin_id={coin_id} />
        <ListPost coin_id={coin_id} />
      </Card>
    </div>
  )
}
