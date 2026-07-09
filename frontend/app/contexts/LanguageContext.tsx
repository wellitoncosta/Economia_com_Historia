'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'pt' | 'en'

type Dictionary = {
  navHome: string
  navExplore: string
  navCommunity: string
  navQuizzes: string
  navProfile: string
  navSettings: string
  login: string
  createAccount: string
  loginOrCreate: string
  guest: string
  recommended: string
  startReading: string
  publicArchiveTitle: string
  publicArchiveText: string
  recommendations: string
  noRecommendations: string
  personalizedRecommendations: string
  rankingByRegion: string
  rankingUnavailable: string
  goToQuizzes: string
  splashTitle: string
  splashCountry: string
  startExploration: string
  alreadyAccount: string
  exploreGuest: string
  welcome: string
  createAccountTitle: string
  accountAccess: string
  email: string
  password: string
  region: string
  institution: string
  processing: string
  enter: string
  register: string
  forgotPassword: string
  languageName: string
}

const dictionaries: Record<Language, Dictionary> = {
  pt: {
    navHome: 'Inicio',
    navExplore: 'Explorar',
    navCommunity: 'Comunidade',
    navQuizzes: 'Quizzes',
    navProfile: 'Perfil',
    navSettings: 'Configuracoes',
    login: 'Entrar',
    createAccount: 'Criar conta',
    loginOrCreate: 'Entrar / Criar conta',
    guest: 'Publico (Visitante)',
    recommended: 'Recomendado',
    startReading: 'Comecar Leitura',
    publicArchiveTitle: 'Explore o acervo publico',
    publicArchiveText: 'Conteudos, foruns e quizzes ligados ao backend real da plataforma.',
    recommendations: 'Recomendados',
    noRecommendations: 'Sem recomendacoes disponiveis por agora.',
    personalizedRecommendations: 'Inicie sessao para receber recomendacoes personalizadas.',
    rankingByRegion: 'Ranking por Regiao',
    rankingUnavailable: 'Ranking indisponivel.',
    goToQuizzes: 'Ir para Quizzes',
    splashTitle: 'Economia com Historia',
    splashCountry: 'Angola',
    startExploration: 'Comecar a Exploracao',
    alreadyAccount: 'Ja tenho conta',
    exploreGuest: 'Explorar sem conta',
    welcome: 'Bem-vindo(a)',
    createAccountTitle: 'Criar conta',
    accountAccess: 'Aceda ao seu acervo academico',
    email: 'E-mail',
    password: 'Palavra-passe',
    region: 'Regiao',
    institution: 'Instituicao',
    processing: 'A processar...',
    enter: 'Entrar',
    register: 'Registar',
    forgotPassword: 'Esqueci a minha palavra-passe',
    languageName: 'PT',
  },
  en: {
    navHome: 'Home',
    navExplore: 'Explore',
    navCommunity: 'Community',
    navQuizzes: 'Quizzes',
    navProfile: 'Profile',
    navSettings: 'Settings',
    login: 'Sign in',
    createAccount: 'Create account',
    loginOrCreate: 'Sign in / Create account',
    guest: 'Public visitor',
    recommended: 'Recommended',
    startReading: 'Start Reading',
    publicArchiveTitle: 'Explore the public archive',
    publicArchiveText: 'Content, forums and quizzes connected to the platform backend.',
    recommendations: 'Recommended',
    noRecommendations: 'No recommendations available yet.',
    personalizedRecommendations: 'Sign in to receive personalized recommendations.',
    rankingByRegion: 'Ranking by Region',
    rankingUnavailable: 'Ranking unavailable.',
    goToQuizzes: 'Go to Quizzes',
    splashTitle: 'Economy with History',
    splashCountry: 'Angola',
    startExploration: 'Start Exploring',
    alreadyAccount: 'I already have an account',
    exploreGuest: 'Explore as guest',
    welcome: 'Welcome',
    createAccountTitle: 'Create account',
    accountAccess: 'Access your academic archive',
    email: 'E-mail',
    password: 'Password',
    region: 'Region',
    institution: 'Institution',
    processing: 'Processing...',
    enter: 'Sign in',
    register: 'Register',
    forgotPassword: 'I forgot my password',
    languageName: 'EN',
  },
}

const LanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: Dictionary
}>({
  language: 'pt',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: dictionaries.pt,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'pt'
    return localStorage.getItem('language') === 'en' ? 'en' : 'pt'
  })

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-AO' : 'en'
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (next: Language) => setLanguageState(next)
  const toggleLanguage = () => setLanguageState((current) => current === 'pt' ? 'en' : 'pt')

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
