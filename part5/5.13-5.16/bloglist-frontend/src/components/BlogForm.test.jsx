import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('calls onSubmit with correct details when new blog is created', () => {
  const createBlog = vi.fn()

  const component = render(<BlogForm createBlog={createBlog} />)

  fireEvent.change(component.getByLabelText('Title'), {
    target: { value: 'React Testing' },
  })
  fireEvent.change(component.getByLabelText('Author'), {
    target: { value: 'Dan Abramov' },
  })
  fireEvent.change(component.getByLabelText('URL'), {
    target: { value: 'https://reactjs.org' },
  })

  fireEvent.submit(component.container.querySelector('form'))

  expect(createBlog).toHaveBeenCalledOnce()
  expect(createBlog).toHaveBeenCalledWith({
    title: 'React Testing',
    author: 'Dan Abramov',
    url: 'https://reactjs.org',
  })
})
