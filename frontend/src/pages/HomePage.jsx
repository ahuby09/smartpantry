import React from 'react'
import Navbar from '../components/NavBar/NavBar'
import WelcomeBanner from '../components/WelcomeBanner/WelcomeBanner'
import MealSuggestCall from '../components/MealSuggestCall/MealSuggestCall'
import WeeklyMealPlan from '../components/WeeklyMealPlan/WeeklyMealPlanner'
const HomePage = () => {
  return (
    <>
    <Navbar />
    <WelcomeBanner />
    <MealSuggestCall />
    <WeeklyMealPlan />
    </>
  )
}

export default HomePage
