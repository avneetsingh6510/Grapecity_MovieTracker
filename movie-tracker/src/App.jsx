import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import LoginModal from './components/LoginModal'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Detail from './pages/Detail'
import Search from './pages/Search'
import Watchlist from './pages/Watchlist'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WatchlistProvider>
          <ToastProvider>
            {/* Blocks entire app until user is logged in */}
            <LoginModal />

            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv-shows" element={<TVShows />} />
                <Route path="/movie/:id" element={<Detail mediaType="movie" />} />
                <Route path="/tv-show/:id" element={<Detail mediaType="tv" />} />
                <Route path="/search" element={<Search />} />
                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ToastProvider>
        </WatchlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
