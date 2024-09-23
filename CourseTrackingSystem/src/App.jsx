import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LoginPage from './LoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <LoginPage/>
    </>
  )
}

export default App
