import React from 'react'
import Navbar from '../components/NavBar/NavBar'
import WelcomeBanner from '../components/WelcomeBanner/WelcomeBanner'
import MealSuggestCall from '../components/MealSuggestCall/MealSuggestCall'
import WeeklyMealPlan from '../components/WeeklyMealPlan/WeeklyMealPlanner'
import FeaturedRecipe from '../components/FeaturedRecipe/FeaturedRecipe'
import Collections from '../components/Collections/Collection'
import Footer from '../components/Footer/Footer'
const HomePage = () => {
  return (
    <>
    <Navbar />
    <WelcomeBanner />
    <MealSuggestCall />
    <Collections />
    <FeaturedRecipe />
    <Footer />
    </>
  )
}

export default HomePage
