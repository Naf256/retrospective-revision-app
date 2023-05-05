import ObjectID from 'bson-objectid'
import { useNavigate } from 'react-router-dom'
import { Task, AppState } from '../types'
import { useState, useEffect } from 'react'
import taskService from '../services/taskService'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from './reducers/userReducer'
import '../dest/styles.css'


export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [revisions, setRevisions] = useState<Task[]>([])

  const user = useSelector((state: AppState) => state?.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser')
    
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
      taskService
        .getAll(loggedUser.token)
        .then(data => {
          setTasks(data.today)
          setRevisions(data.revision)
        })
        .catch(() => 
          console.log('something wrong with getting tasks')
        )
    } else {
      navigate('/login')
    }

  }, [])

  const handleAddTask = async (taskName: string) => {
    const obj = {
      id: ObjectID().toHexString(),
      name: taskName
    };

    setTasks(tasks.concat(obj as Task))

    setNewTask('')

    try {
      await taskService.create(obj, user?.token as string)
    } catch (error) {
      console.log('couldnot create the task')
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const taskName = document.getElementById(id)

    const input = document.getElementById(`input${id}`) as HTMLInputElement

    if (taskName && input) {
      input.style.display = input.style.display === 'none'
        ? 'block'
        : 'none'

      taskName.style.display = taskName.style.display === 'none'
        ? 'block'
        : 'none'
    }
    
    e.currentTarget.innerHTML = 
      e.currentTarget.innerHTML === 'save changes'
      ? 'edit'
      : 'save changes'


    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        t.name = input.value
      }
      return t
    })

    setTasks(updatedTasks)

    if (e.currentTarget.innerHTML === 'edit') {
      taskService
        .change(id, input.value)
        .then(updated => {
          console.log(updated)
        })
        .catch(() =>
          console.log('couldnot update the task')
        )
    }
  }

  const handleDelete = async (id: string) => {
    setTasks(tasks.filter(t => 
      t.id !== id
    ))

    try {
      await taskService.remove(id)
    } catch (error) {
      console.log('couldnot remove the task')
    }
  }

  if (user) {
    return (
      <div>
        <h3>{user.username} logged in</h3>
        <div className="container">

         <div className="box">
          <h2>Today tasks</h2>
            <div>
              {tasks ?
                tasks.map((t, i) => 
                  <div key={i}>
                      <div 
                        id={t.id}
                        className="task"
                        style={{ display: 'block' }}
                      >
                        {t.name}
                      </div>
                        <input
                          className="task-edit"
                          id={`input${t.id}`}
                          style={{ display: 'none' }}
                          defaultValue={t.name}
                        />
                      <div>
                        <button onClick={(e) => handleEdit(e, t.id)}>edit</button>
                        <button onClick={() => handleDelete(t.id)}>delete</button>              
                      </div>
                  </div>
                ) : 
                null
              }
              <div className="addinput-wrapper">
                <input 
                  value={newTask}
                  className="addinput"
                  onChange={(e) => setNewTask(e.target.value)}
                  type="text"
                />
                <button className="addbutton" onClick={() => handleAddTask(newTask)}>Add</button>
              </div>    
            </div>
          </div>

          <div className="box">
            <h2>Revision tasks</h2>
            <div>
              {revisions ?
                revisions.map((t, i) => 
                  <div key={i} className="task">
                      {t.name}
                  </div>
                ) : 
                null
              }
            </div>
          </div>

        </div>
      </div>
    )
  } else {
    return <p>loading...</p>
  }
}

