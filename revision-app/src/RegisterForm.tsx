import { useState } from 'react'
import userService from '../services/userService'
import { setUser } from './reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      console.log('passwords donot match')

    } else {
      const newUser = await userService.create({
        username,
        password
      })

      dispatch(setUser(newUser))

      localStorage.setItem(
        'loggedUser',
        JSON.stringify(newUser)
      )

      navigate('/')
    }

  }


  return (
    <div>
      <form onSubmit={(e) => handleRegister(e)}>
        username<input 
          name="username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        password<input 
          name="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        confirm<input 
          name="confirm"
          value={confirm} 
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit">register</button>
      </form>
    </div>
  )

}
