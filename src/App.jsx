import Screen from "./components/screen"
import Keypad from "./components/keypad"
import { useReducer, useEffect } from "react"

export default function App(){

  const ACTIONS = {
    "ADD_DIGIT": "add_digit",
    "REMOVE_DIGIT" : "remove_digit",
    "ADD_OPERATOR" : "add_operator",
    "EVALUATE" : "evaluate",
    "CLEAR_ALL" : "clear_all"
  }


  function reducer(state, actions) {
    switch (actions.type) {
      case ACTIONS.ADD_DIGIT:
        // Ensures operand does not start with 0
        if (state.operand === "0" || state.operand === "00" || state.operand === "000" && actions.payload !== '.'){
          return {...state, "operand": actions.payload}
        }

        // Automatically puts the 0 before the point when the point is the first digit entered
        if (state.operand === "" && actions.payload === "."){
          return {...state, "operand": `0${actions.payload}`}
        } 

        // Ensures operand contains only on decimal point
        if (state.operand.includes('.') && actions.payload === "." ){
          return state
        }

        return {...state, "operand": `${state.operand}${actions.payload}`}

      case ACTIONS.CLEAR_ALL:
        console.log("clear sequence activated")
        return {"prev_operand": '', "operator": '', "operand": ''}

    }

  }
  
  const [state, dispacth] = useReducer(reducer, {"prev_operand": '', "operator": '', "operand": ''})



  return (
    <>
      <article>
        <Screen work={state} HandleKeyPress={dispacth} />
        <Keypad actions={ACTIONS} HandleClick={dispacth}/>
      </article>

    </>
  )
}
