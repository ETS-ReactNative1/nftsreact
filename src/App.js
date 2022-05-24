
import React, { useState, useContext, createContext } from 'react';
import './App.css';
import { CarouselLeft, CarouselRight, CarouselCenter, CarouselServer,CarouselWeb } from "./Carousels/Carousels.js";
import "./Carousels/jquery.carousel-3d.default.scss";
import { SocketContext,TargetContext,SetTargetContext } from './index.js';

function App ()
{
  const sock = useContext( SocketContext );
  const searchData = {
    contract: {
      value: "atomicassets",
      data: [ "atomicassets" ]
    },
    collection: {
      value: "",
      data: [ "" ]
    },
    serie: {
      value: "",
      data: [ "" ]
    },
    user: {
      value: "qkhai.wam",
      data: [ "qkhai.wam" ]
    },
    by: {
      value: "",
      data: [ "" ]
    },
    limits: {
      collection: 50,
      serie: 50,
      nft: 30
    },
    lower: "mlb"
  };
  const [ search, setSearch ] = useState( searchData );
  sock.emit( "nfts", "assets", search.user.value, search.limits.nft, search.contract.value );
  sock.emit( "getdata", "collections", search.contract.value, search.limits.collection, "collections", search.lower );



  /*
    left: About me + about nft
    center: Select and search nfts
    right: View commands and results;
  */
  return ( <div className="maindiv">
    <SearchContext.Provider value={ search }>
      <SetSearchContext.Provider value={ setSearch }>
    <div id="wrapper">
      <div id="myCarousel" data-carousel-3d>
            <CarouselCenter selected />
            <CarouselRight />
            <CarouselServer />
            <CarouselWeb />
            <CarouselLeft />
      </div>
    </div>
      </SetSearchContext.Provider>
    </SearchContext.Provider>
  </div> );
}
export default App;
