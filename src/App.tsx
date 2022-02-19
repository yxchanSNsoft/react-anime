import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { debounce } from "lodash"
import AnimeDetails from "./animeDetails";
import {Navigate, useRoutes} from 'react-router-dom';

function App() {

  const [animes, setAnime] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [showAnime, setShowAnime] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState({
    image_url : "",
    title : "",
    synopsis : "",
    score : "",
    members : "",
    type : "", 
    rated : "",
  })
  const results_per_page = 14;

  /*
  * @animes : to store api return  
  * @page : pagination , current selected page
  * @results_per_page : how many results to display per page
  */


  async function request(search : string) {
    let result = await fetch("https://api.jikan.moe/v3/search/anime?q=" + search).then((res) => res.json()).then(res2=>{
      console.log("res2",res2)
      setAnime(res2.results)

    })
  }

  const debounceOnSearch = debounce(onSearch, 1000);

  function gotoResult(anime: any) {
    setSelectedAnime(anime)
    setShowAnime(true)

  }

  function onSearch(text : string) {
    console.log(text)
    request(text)
    console.log("3", animes)
  }

  function gotoPage(num: number) {
    console.log(num)
    setPage(num)
  };

  function handleClick() {
    setShowAnime(false)
  }

  return (
    <div className="App">
      <div className="header">
        Anime Search App
      </div>
      {!showAnime && <><div className="search-container">
        <input type="text" placeholder="Search" onChange={(e)=>debounceOnSearch(e.target.value)} />
      </div>
      <div className="result-container">
        {
          animes && animes.length > 0 && animes.map((value, index)=>{
            if (index < page * results_per_page + results_per_page + 1 && index > results_per_page * page) {
              return (
                <div className="anime-container" key={'result' + index} onClick={()=>gotoResult(value)}>
                  <div><img src={value.image_url} /></div>
                  <div>{value.title}</div>
                </div>
              )
            }
            
          })
        }
      </div>
      <div className="pagination-container">
        {/* <Footer results_per_page={results_per_page} page={page} pages={pages} /> */}
        {
          animes && animes.length > 0 && animes.map((value, index)=>{
            if (index % results_per_page == 0) {
              let num = (index / results_per_page)
              return (
                <div className={`page-container ${num == page && "selected"} `}   key={'page' +index} onClick={()=>gotoPage(num)}>
                  {num+1}
                </div>
              )
            }
            
          })
        }
      </div></>}
      {showAnime && <>
        <div className="flex-box">
          <div className="flex-one">
            <img src={selectedAnime.image_url} />
          </div>
          <div className="flex-eight">
            <div><h3>Synopsis</h3></div>
            <div>{selectedAnime.synopsis}</div>
            <div className="card-container">
              <div className="card" style={{backgroundColor:"lightblue"}}>
                <p>{selectedAnime.score}</p>
                <p className="card-text">SCORE</p>
              </div>
              <div className="card" style={{backgroundColor:"#f0a3e0" }}>
                <p>{selectedAnime.type}</p>
                <p className="card-text">TYPE</p>
              </div>
              <div className="card" style={{backgroundColor:"#eb7d34"}}>
                <p>{selectedAnime.rated}</p>
                <p className="card-text">RATED</p>
              </div>
              <div className="card" style={{backgroundColor:"#bff0a3"}}>
                <p>{selectedAnime.members}</p>
                <p className="card-text">MEMBERS</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-box">
          <button onClick={handleClick}>{"<"} &nbsp;&nbsp;&nbsp; Back</button>
        </div>
      </>}
    </div>
  );
}

export default App;
