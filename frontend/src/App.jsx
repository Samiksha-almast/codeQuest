
import { useState } from 'react'
import './App.css'
import { levels } from './data/level.js'
import { questions } from './data/questions.js'

const dataStructureTree = [
  {
    name: 'Linear',
    description: 'Elements arranged sequentially',
    topics: ['Array', 'Queue', 'Stack', 'Linked List', 'String', 'Deque'],
  },
  {
    name: 'Non-Linear',
    description: 'Elements arranged hierarchically or as networks',
    topics: ['Tree', 'Graph', 'Trie', 'Hash Table'],
  },
]

const languages = ['C', 'C++', 'Java', 'Python', 'JavaScript']

function App() {
  const [page, setPage] = useState('auth')
  const [authMode, setAuthMode] = useState('signup')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [dsOpen, setDsOpen] = useState(true)
  const [openCategory, setOpenCategory] = useState('')

  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedTest, setSelectedTest] = useState('')

  const [answers, setAnswers] = useState({})
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(null)

  const selectedQuestions = selectedTest
    ? questions[selectedTest] || []
    : []

  const currentQuestion = selectedQuestions[questionIndex]

  function handleAuth(event) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      alert('Please enter your email and password.')
      return
    }

    if (password.length < 8) {
      alert('Password must contain at least 8 characters.')
      return
    }

    if (authMode === 'signup' && !name.trim()) {
      alert('Please enter your name.')
      return
    }

    setPage('topics')
  }

  function chooseTopic(topic) {
    setSelectedTopic(topic)
    setSelectedLanguage('')
    setSelectedLevel(null)
    setSelectedTest('')
    setAnswers({})
    setScore(null)
    setPage('languages')
  }

  function chooseLanguage(language) {
    setSelectedLanguage(language)
    setSelectedLevel(null)
    setPage('levels')
  }

  function chooseLevel(level) {
    if (level.locked) return

    setSelectedLevel(level)
    setSelectedTest('')
    setAnswers({})
    setScore(null)
    setQuestionIndex(0)
  }

  function startTest(test) {
    setSelectedTest(test)
    setAnswers({})
    setScore(null)
    setQuestionIndex(0)
    setPage('quiz')
  }

  function selectAnswer(option) {
    setAnswers(previous => ({
      ...previous,
      [currentQuestion.id]: option,
    }))
    setScore(null)
  }

  function submitQuiz() {
    const allAnswered = selectedQuestions.every(
      question => answers[question.id] !== undefined
    )

    if (!allAnswered) {
      alert('Please answer all questions before submitting.')
      return
    }

    const total = selectedQuestions.filter(
      question => answers[question.id] === question.answer
    ).length

    setScore(total)
    setPage('result')
  }

  function goBack() {
    if (page === 'topics') setPage('auth')
    else if (page === 'languages') setPage('topics')
    else if (page === 'levels') setPage('languages')
    else if (page === 'quiz') setPage('levels')
    else if (page === 'result') setPage('levels')
  }

  function restart() {
    setSelectedLevel(null)
    setSelectedTest('')
    setAnswers({})
    setQuestionIndex(0)
    setScore(null)
    setPage('levels')
  }

  return (
    <main className="app-container">

      <header className="app-header">
        <div className="brand-icon">⌘</div>
        <div>
          <h1>CodeQuest</h1>
          <p>Learn. Practice. Improve.</p>
        </div>
      </header>

      {page !== 'auth' && (
        <button className="back-button" onClick={goBack}>
          ← Back
        </button>
      )}

      {/* LOGIN / SIGN UP */}
      {page === 'auth' && (
        <section className="panel auth-panel">
          <div className="section-icon">✦</div>

          <h2>
            {authMode === 'login'
              ? 'Welcome Back!'
              : 'Create Your Account'}
          </h2>

          <p>
            {authMode === 'login'
              ? 'Login to continue your learning journey.'
              : 'Sign up and begin your coding journey.'}
          </p>

          <form onSubmit={handleAuth}>
            {authMode === 'signup' && (
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={8}
              required
            />

            <button className="primary-button" type="submit">
              {authMode === 'login' ? 'Login →' : 'Create Account →'}
            </button>
          </form>

          <p className="switch-auth">
            {authMode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}

            <button
              type="button"
              className="text-button"
              onClick={() =>
                setAuthMode(authMode === 'login' ? 'signup' : 'login')
              }
            >
              {authMode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </section>
      )}

      {/* DSA TREE */}
      {page === 'topics' && (
        <section className="panel tree-panel">
          <div className="section-heading">
            <span className="section-icon">⌘</span>
            <div>
              <h2>Explore Data Structures</h2>
              <p>Follow the tree and choose a topic to practise.</p>
            </div>
          </div>

          <div className="dsa-tree">

            {/* ROOT */}
            <div className="tree-root-row">
              <div className="tree-root">
                <span>✦</span>
                <strong>DSA</strong>
                <small>Data Structures & Algorithms</small>
              </div>
            </div>

            {/* DS BRANCH */}
            <div className="tree-main-branch">
              <div className="tree-stem" />

              <button
                className="tree-main-node"
                onClick={() => setDsOpen(!dsOpen)}
                aria-expanded={dsOpen}
              >
                <span className="node-icon">▦</span>
                <span>
                  <strong>Data Structures (DS)</strong>
                  <small>Explore different data structures</small>
                </span>
                <span className="expand-icon">
                  {dsOpen ? '−' : '+'}
                </span>
              </button>

              {dsOpen && (
                <div className="category-branches">
                  {dataStructureTree.map(category => {
                    const isOpen = openCategory === category.name

                    return (
                      <div className="category-branch" key={category.name}>
                        <div className="category-row">
                          <span className="branch-connector" />

                          <button
                            className={`category-node ${
                              isOpen ? 'category-active' : ''
                            }`}
                            onClick={() =>
                              setOpenCategory(isOpen ? '' : category.name)
                            }
                            aria-expanded={isOpen}
                          >
                            <span className="category-symbol">
                              {category.name === 'Linear' ? '☰' : '⑂'}
                            </span>

                            <span className="category-info">
                              <strong>{category.name}</strong>
                              <small>{category.description}</small>
                            </span>

                            <span className="expand-icon">
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                        </div>

                        {isOpen && (
                          <div className="topic-branches">
                            {category.topics.map((topic, index) => (
                              <div className="topic-row" key={topic}>
                                <span className="topic-connector" />

                                <button
                                  className="topic-node"
                                  onClick={() => chooseTopic(topic)}
                                >
                                  <span className="topic-number">
                                    {String(index + 1).padStart(2, '0')}
                                  </span>

                                  <span>{topic}</span>

                                  <span className="topic-arrow">→</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="tree-note">
            <span>💡</span>
            <p>
              Select a category to explore its topics. Choose any topic
              to continue your learning journey.
            </p>
          </div>
        </section>
      )}

      {/* LANGUAGE SELECTION */}
      {page === 'languages' && (
        <section className="panel">
          <div className="section-icon">💻</div>
          <h2>Choose Programming Language</h2>
          <p>
            Selected topic: <strong>{selectedTopic}</strong>
          </p>

          <div className="choice-grid">
            {languages.map(language => (
              <button
                className="choice-button"
                key={language}
                onClick={() => chooseLanguage(language)}
              >
                {language}
                <span>→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* LEVEL SELECTION */}
      {page === 'levels' && (
        <section className="panel tree-panel">
          <h2>Choose Your Learning Path</h2>

          <p>
            Topic: <strong>{selectedTopic}</strong>
            {' · '}
            Language: <strong>{selectedLanguage}</strong>
          </p>

          <p className="tree-instruction">
            Choose your starting level, then select a test.
          </p>

          <div className="learning-tree">
            {levels.map((level, index) => {
              const isSelected = selectedLevel?.id === level.id

              return (
                <div className="tree-level" key={level.id}>
                  <button
                    className={`tree-level-card ${
                      isSelected ? 'active-level' : ''
                    }`}
                    disabled={level.locked}
                    onClick={() => chooseLevel(level)}
                  >
                    <span className="tree-level-number">
                      {level.locked ? '🔒' : index + 1}
                    </span>

                    <span className="tree-level-info">
                      <strong>{level.name}</strong>
                      <small>{level.description}</small>
                    </span>

                    <span className="tree-level-arrow">
                      {level.locked ? 'Locked' : isSelected ? '✓ Selected' : '→'}
                    </span>
                  </button>

                  {isSelected && (
                    <div className="level-tests">
                      <h3>Available Tests</h3>

                      {level.tests.map(test => (
                        <button
                          className="test-card"
                          key={test}
                          onClick={() => startTest(test)}
                        >
                          <span>▶</span>
                          <strong>{test}</strong>
                          <span>Start Quiz →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* QUIZ */}
      {page === 'quiz' && (
        <section className="panel quiz-panel">
          <h2>{selectedTest}</h2>

          <p>
            {selectedTopic} · {selectedLanguage} · {selectedLevel?.name}
          </p>

          {selectedQuestions.length > 0 && currentQuestion ? (
            <>
              <div className="quiz-progress">
                Question {questionIndex + 1} of {selectedQuestions.length}
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((questionIndex + 1) / selectedQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>

              <h3 className="question-text">
                {currentQuestion.question}
              </h3>

              <div className="options-list">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      answers[currentQuestion.id] === option ? 'selected' : ''
                    }`}
                    onClick={() => selectAnswer(option)}
                  >
                    <span>{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              <div className="quiz-navigation">
                <button
                  className="secondary-button"
                  onClick={() => setQuestionIndex(questionIndex - 1)}
                  disabled={questionIndex === 0}
                >
                  ← Previous
                </button>

                {questionIndex < selectedQuestions.length - 1 ? (
                  <button
                    className="primary-button"
                    onClick={() => setQuestionIndex(questionIndex + 1)}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    className="primary-button"
                    onClick={submitQuiz}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="empty-questions">
              <h3>Questions are being prepared!</h3>
              <p>No questions are currently available for this test.</p>
              <button className="primary-button" onClick={goBack}>
                Back to Learning Path
              </button>
            </div>
          )}
        </section>
      )}

      {/* RESULTS */}
      {page === 'result' && (
        <section className="panel result-panel">
          <div className="section-icon">🏆</div>
          <h2>Quiz Completed!</h2>
          <p>Your result for {selectedTest}</p>

          <h1 className="score">
            {score} / {selectedQuestions.length}
          </h1>

          <p>Correct answers: {score}</p>
          <p>Incorrect answers: {selectedQuestions.length - score}</p>

          <button className="primary-button" onClick={restart}>
            Return to Learning Path →
          </button>
        </section>
      )}

      <footer>
        <p>CodeQuest © 2026 <span>♥</span></p>
      </footer>
    </main>
  )
}

export default App




