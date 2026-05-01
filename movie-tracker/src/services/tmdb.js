import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
export const POSTER_SIZE = '/w500'
export const BACKDROP_SIZE = '/original'
export const PROFILE_SIZE = '/w185'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

// Movies
export const getTrendingMovies = () =>
  tmdb.get('/trending/movie/week')

export const getPopularMovies = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } })

export const getTopRatedMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } })

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, { params: { append_to_response: 'credits' } })

// TV Shows
export const getTrendingTV = () =>
  tmdb.get('/trending/tv/week')

export const getPopularTV = (page = 1) =>
  tmdb.get('/tv/popular', { params: { page } })

export const getTopRatedTV = (page = 1) =>
  tmdb.get('/tv/top_rated', { params: { page } })

export const getTVDetails = (id) =>
  tmdb.get(`/tv/${id}`, { params: { append_to_response: 'credits' } })

// Search
export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', { params: { query, page } })

export default tmdb
