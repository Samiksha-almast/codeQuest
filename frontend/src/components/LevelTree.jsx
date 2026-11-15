
function LevelTree({ levels, selectedLevel, onSelectLevel, onSelectTest })  {
  return (
    <section>
      <h2>Choose Your Challenge</h2>
      <p>Select a level to explore its tests.</p>

      <div className="level-tree">
        {levels.map((level, index) => (
          <div className="level-node" key={level.id}>
             <button
                className="level-button"
                onClick={() => onSelectLevel(level)}
                disabled={level.locked}
             >
               {level.locked ? "🔒 " : "⭐ "}
               {level.name}
              </button>

              {index !== levels.length - 1 && (
                <div className="level-connector"></div>
               )}
          </div>
        ))}
      </div>

      {selectedLevel && (
        <div className="selected-level">
          <h3>{selectedLevel.name}</h3>
          <p>{selectedLevel.description}</p>
          <h4>Available Tests</h4>

          {selectedLevel.tests.map((test, index) => (
            <button
              key={index}
              onClick={() => onSelectTest(test)}
            >
              {test}
            </button>
           ))}
        </div>
      )}
    </section>
  )
}

export default LevelTree
