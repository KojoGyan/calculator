import Screen from "./components/screen"
import Keypad from "./components/keypad"
import { useReducer, useEffect} from "react"

export default function App(){

  const ACTIONS = {
    "ADD_DIGIT": "add_digit",
    "REMOVE_DIGIT" : "remove_digit",
    "ADD_OPERATOR" : "add_operator",
    "EVALUATE" : "evaluate",
    "CLEAR_ALL" : "clear_all"
  }

  function evaluatTerms(term1, term2, operation){
    let results
    switch (operation){
        case '+':
          results = Number(term1) + Number(term2)
          return results.toString()
        case '-':
          results = Number(term1) - Number(term2)
          return results.toString()
        case '*':
          results = Number(term1) * Number(term2)
          return results.toString()
        case '/':
          results = Number(term1) / Number(term2)
          return results.toString()
        }
  }

  function reducer(state, actions) {
    switch (actions.type) {
      case ACTIONS.ADD_DIGIT:
        // Resets the state before adding a new value after results has been shown
        if (state.isResultShown){
          return {...state, "operand": actions.payload, "isResultShown": false}
        }
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
        // Default behaviour
        return {...state, "operand": `${state.operand}${actions.payload}`}


      case ACTIONS.CLEAR_ALL:
        return {...state, "prev_operand": '', "operator": '', "operand": '', 'isResultShown': false}


      case ACTIONS.REMOVE_DIGIT:
        // Default behaviour
        if ((state.operand && state.operator && state.prev_operand) || (!state.prev_operand && !state.operator && state.operand)){
          return {...state, "operand": state.operand.slice(0,-1)}
        }
        // Removes operator if there is no operand
        if (state.prev_operand && state.operator && !state.operand){
                    return {...state, "operator":""}
        }
        // Handles cases where the only thing left is the prev_operand
        if (state.prev_operand && !state.operator && !state.operand){
          return {...state, "prev_operand": "", "operand": state.prev_operand}
        }
        // Checks if the operand is empty 
        if (!(state.operand && state.operator && state.prev_operand)) {
          return state
        }


      case ACTIONS.ADD_OPERATOR:
        // Evaluates the expression to ensure continuous operation
        if (state.prev_operand && state.operator && state.operand)
          return {...state, "prev_operand": evaluatTerms(state.prev_operand, state.operand, state.operator), "operator": actions.payload, "operand": ""}
        // Chceks if anouther operator already exists and replaces old with new operator
        if (state.operator && state.prev_operand){
          return {...state, "operator": actions.payload}
        }
        return {...state, "prev_operand": state.operand, "operator": actions.payload, "operand": ""}
       
        
      case ACTIONS.EVALUATE:
        // Ensures an prev_operand, operand and operator exist before performing evaluation
        if (!(state.prev_operand && state.operator && state.operand)) {
          return state
        }
        return {...state, "prev_operand": "", "operator": "", "operand": evaluatTerms(state.prev_operand, state.operand, state.operator), "isResultShown": true}
        
    }

  }
  
  const [state, dispacth] = useReducer(reducer, {"prev_operand": '', "operator": '', "operand": '', "isResultShown": false})

  useEffect(()=>{
    // Use a named handler and clean it up to avoid duplicate listeners (React 18 StrictMode mounts effects twice in dev)
    const handler = (e) => {
      // log the key for debugging
      console.log("Key pressed:", e.key, "target:", e.target && e.target.tagName)

      // determine if the event target is an editable element (so we don't override normal typing)
      const target = e.target
      const isEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

      switch (e.key) {
        case "=":
        case "Enter":
          // allow Enter anywhere
          dispacth({"type": ACTIONS.EVALUATE})
          break

        case "Backspace":
        case "Delete":
          // Prevent browser navigation (Backspace -> back) when not typing in an input
          if (!isEditable) e.preventDefault()
          console.log("Removing digit via key:", e.key)
          dispacth({"type": ACTIONS.REMOVE_DIGIT})
          break

        case "+":
        case "-":
        case "*":
        case "/":
          // if focused in an input, let the input handle it
          if (isEditable) break
          dispacth({"type": ACTIONS.ADD_OPERATOR, "payload": e.key})
          break

        case ".":
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          // if focused in an input, let the input handle it
          if (isEditable) break
          dispacth({"type": ACTIONS.ADD_DIGIT, "payload": e.key})
          break
        }
    }

    // prefer 'keydown' for broader key coverage; keep consistent add/remove
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  },[])


  return (
    <>
      <article>
        <Screen work={state} HandleKeyPress={dispacth} />
        <Keypad actions={ACTIONS} HandleClick={dispacth}/>
      </article>

    </>
  )
}
