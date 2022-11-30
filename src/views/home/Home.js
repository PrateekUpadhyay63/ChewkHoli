import React from 'react'
import SearchSection from "../../components/searchSection/SearchSection"
import ImgMediaCard from "../../components/cards/card"
const Home = ({setData}) => {
  return (
    <div>
      <SearchSection />
      <ImgMediaCard setData={setData}/>
      </div>
  )
}

export default Home