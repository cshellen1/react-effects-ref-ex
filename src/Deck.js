import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import axios from 'axios';

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [auto, setAuto] = useState(false);
  const timerRef = useRef(null);


  useEffect(() => {
    async function getDeck() {

      try {
        const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle');

        setDeck(res.data);

      } catch (err) {
        alert(err);
      }
    }
    getDeck();
  }, [setDeck]);

  useEffect(() => {

    async function getCard() {
      let { deck_id } = deck;

      try {
        let drawRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);

        if (drawRes.data.remaining === 0) {
          // setAuto(false);
          throw new Error("no cards remaining!");
        }

        let card = drawRes.data.cards[0];
      
        setDrawn(d => [
          ...d, {
            id: card.code,
            image: card.image,
            name: card.suit + " " + card.value,
          }
        ]);

      } catch (err) {
        alert(err);
      }
    };

    if (auto && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
    
  }, [setAuto, auto, deck]);
  
  const toggleAuto = () => {
    setAuto(!auto ? true : !auto)
  };

  const cards = drawn.map(c => (
    [<Card key={c.id} name={c.name} image={c.image}/>]
  ));

  return (
    <>
      <button onClick={toggleAuto}>{auto ? "Stop" : "Start" } Drawing!</button>
      <div id="cards" >{cards}</div>
    </>
  )
}

export default Deck