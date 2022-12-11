import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { ChartCoin } from '@/components/Charts/ChartCoin'
import { Layout } from '@/components/Layouts'
import { Coin, Home, Login, NotFound } from '@/screens'
import { Converter } from '@/screens/converter/Converter'
import { AdminDashboard } from '@/screens/dashboard/AdminDashboard'
import { Forbidden } from '@/screens/forbidden/Forbidden'
import { ScoreToMoneyEditForm } from '@/screens/profile/ScoreToMoneyEditForm'
import { UserProfile } from '@/screens/profile/UserProfile'
import { SiteMap } from '@/screens/site-map/SiteMap'
import { WatchList } from '@/screens/watch-list/WatchList'

export const Router = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route path="/currencies/:coin_id" element={<Coin />} />
        <Route path="/chart" element={<ChartCoin idCoin="Qwsogvtv82FCd" />} />
        <Route path="/watch-list" element={<WatchList />} />
        <Route path="/convert-tool" element={<Converter />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/form/:id" element={<ScoreToMoneyEditForm />} />
        <Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : <Forbidden />} />
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
