import { useState } from 'react'
import './header.css'

function Header() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedIndices, setSelectedIndices] = useState([])
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [store, setStore] = useState([])
  const [selectedStore, setSelectedStore] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (inputValue.trim()) {
      setStore([...todos, inputValue])
      setTodos([...todos, inputValue])
      setInputValue('')
    }
  }

  const handleItemSubmit = (event, index) => {
    event.preventDefault()

    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index))
      setSelectedStore(selectedStore.filter((i) => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
      setSelectedStore([...selectedStore, index])
    }
  }

  const handleDelete = (index) => {
    setStore((prevTodos) => prevTodos.filter((_, i) => i !== index))
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index))
    setSelectedIndices(selectedIndices.filter((i) => i !== index))
    setSelectedStore(selectedStore.filter((i) => i !== index))
  }
  const clearCompleted = () => {
    setTodos(todos.filter((_, index) => !selectedIndices.includes(index)))
    setStore(store.filter((_, index) => !selectedStore.includes(index)))
    setSelectedIndices([])
    setSelectedStore([])
  }
  const showCompleted = () => {
    const completedTodos = store.filter((_, index) =>
      selectedStore.includes(index),
    )
    setTodos(completedTodos)
    const newSelectedIndices = completedTodos.map((_, index) => index)
    setSelectedIndices(newSelectedIndices)
    setActiveFilter('completed')
  }
  const showActive = () => {
    const activeTodos = store.filter(
      (_, index) => !selectedStore.includes(index),
    )
    setTodos(activeTodos)
    setSelectedIndices([])
    setActiveFilter('active')
  }
  const showAll = () => {
    setTodos([...store])
    const newSelectedIndices = store
      .map((_, index) => (selectedStore.includes(index) ? index : -1))
      .filter((index) => index !== -1)
    setSelectedIndices(newSelectedIndices)
    setActiveFilter('all')
  }

  const handleDragStart = (index) => {
    setDraggingIndex(index)
  }

  const handleDragOver = (event, index) => {
    event.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggingIndex !== null && dragOverIndex !== null) {
      const updatedTodos = Array.from(todos)
      const draggedTodo = updatedTodos[draggingIndex]
      updatedTodos.splice(draggingIndex, 1)
      updatedTodos.splice(dragOverIndex, 0, draggedTodo)

      setTodos(updatedTodos)
    }

    setDraggingIndex(null)
    setDragOverIndex(null)
  }

  return (
    <>
      <header>
        <h1>To Do</h1>
        <i className="fa-solid fa-list-check"></i>
      </header>
      <form onSubmit={handleSubmit}>
        <button type="submit"></button>
        <input
          type="text"
          placeholder="Create new todo"
          value={inputValue}
          onChange={handleInputChange}
        ></input>
      </form>
      <main>
        {todos.map((todo, index) => (
          <div
            key={index}
            className={`todo-item ${draggingIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={handleDragEnd}
          >
            <form onSubmit={(event) => handleItemSubmit(event, index)}>
              <button
                type="submit"
                style={{
                  backgroundColor: selectedIndices.includes(index)
                    ? 'rgb(251, 116, 19)'
                    : '',
                  backgroundImage: selectedIndices.includes(index)
                    ? `url('/images/icon-check.svg')`
                    : '',
                  backgroundPosition: selectedIndices.includes(index)
                    ? 'center'
                    : '',
                  backgroundRepeat: selectedIndices.includes(index)
                    ? 'no-repeat'
                    : '',
                  backgroundSize: selectedIndices.includes(index) ? '13px' : '',
                }}
              ></button>
              <input
                type="text"
                value={todo}
                style={{
                  textDecoration: selectedIndices.includes(index)
                    ? ' line-through'
                    : '',
                  color: selectedIndices.includes(index) ? '#acadb7' : '',
                }}
                readOnly
              />
              <img
                src="images/icon-cross.svg"
                alt="cross"
                className="cross"
                onClick={() => handleDelete(index)}
              ></img>
            </form>
          </div>
        ))}
        <div className="tools">
          <p>{todos.length} items left</p>
          <div className="filter">
            <h6
              onClick={() => showAll()}
              className={activeFilter === 'all' ? 'active-filter' : ''}
            >
              All
            </h6>
            <h6
              onClick={() => showActive()}
              className={activeFilter === 'active' ? 'active-filter' : ''}
            >
              Active
            </h6>
            <h6
              onClick={() => showCompleted()}
              className={activeFilter === 'completed' ? 'active-filter' : ''}
            >
              Completed
            </h6>
          </div>
          <p onClick={() => clearCompleted()}>Clear Completed</p>
        </div>
        <div className="filter-mobile">
          <h6
            onClick={() => showAll()}
            className={activeFilter === 'all' ? 'active-filter' : ''}
          >
            All
          </h6>
          <h6
            onClick={() => showActive()}
            className={activeFilter === 'active' ? 'active-filter' : ''}
          >
            Active
          </h6>
          <h6
            onClick={() => showCompleted()}
            className={activeFilter === 'completed' ? 'active-filter' : ''}
          >
            Completed
          </h6>
        </div>
      </main>
      <footer>
        <p>Drag and drop to reorder list</p>
      </footer>
    </>
  )
}

export default Header
