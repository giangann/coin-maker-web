import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { ChartCoin } from '@/components/Charts/ChartCoin'
import { Layout } from '@/components/Layouts'
import { Coin, Home, Login, NotFound } from '@/screens'
import { Converter } from '@/screens/converter/Converter'
import { SiteMap } from '@/screens/site-map/SiteMap'
import { WatchList } from '@/screens/watch-list/WatchList'

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route path="/currencies/:coin_id" element={<Coin />} />
        <Route path="/chart" element={<ChartCoin idCoin="Qwsogvtv82FCd" />} />
        <Route path="/watch-list" element={<WatchList />} />
        <Route path="/convert-tool" element={<Converter />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
