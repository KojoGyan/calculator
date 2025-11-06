export default function Keypad (props) {
    const Buttons = ["AC","C","/","*","7","8","9","-","4","5","6","+","1","2","3","=","0",".","00","000"]
    const ButtonEl = Buttons.map((button) => {
        return (<button key={button} onClick={() => {
            if (button === "="){
                return props.HandleClick({"type": props.actions.EVALUATE})
            }
            else if (button === "AC") {
                return props.HandleClick({"type": props.actions.CLEAR_ALL})
            }
            else if (button === "C"){
                return props.HandleClick({"type": props.actions.REMOVE_DIGIT})
            }
            else if (button === "+" || button === "-" || button === "*" || button === "/") {
                return props.HandleClick({"type": props.actions.ADD_OPERATION, "payload": button})
            }
            else {
                return props.HandleClick({"type": props.actions.ADD_DIGIT, "payload": button})
            }
        }}>
            {button}
            </button>)
    })
    return (

        <div className="keypad">
          {ButtonEl}
        </div>
    )
}