import { setUser } from './reducers/userReducer'
import { useState } from 'react'
import userService from '../services/userService'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      const user = await userService.login({
        username,
        password
      })

      dispatch(setUser(user))

      localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )


      navigate('/')

    } catch (error) {
      console.log('something wrong with login')
    }

  }

  return (
    <div>
      <form onSubmit={(e) => handleLogin(e)}>
        username:
        <input 
          name="username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        password:
        <input 
          name="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  )

}
