import ReactDOM from 'react-dom/client'
import RegisterForm from './RegisterForm'
import App from './App'
import LoginForm from './LoginForm'
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
    </Router>
  </Provider>
)
