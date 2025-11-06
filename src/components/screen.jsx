export default function Screen ({work}) {
    return (
        <div className="screen">
          {/* Make this element focusable so it can receive keyboard events when focused */}
          <p className="results" > 0 </p>
          <p className="workings"> {work.operand? work.operand: "0"} </p>
        </div>
    )
}