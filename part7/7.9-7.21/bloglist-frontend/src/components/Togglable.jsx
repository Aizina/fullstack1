import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Paper, Stack } from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }))

  return (
    <Box>
      {!visible && (
        <Button
          variant="contained"
          color="primary"
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </Button>
      )}

      {visible && (
        <Paper
          elevation={3}
          sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid #ccc' }}
        >
          <Stack spacing={2}>
            {props.children}
            <Button
              variant="outlined"
              color="error"
              onClick={toggleVisibility}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default Togglable
