sequenceDiagram
    participant user
    participant browser
    participant server
    
    user->>browser: Types new note and clicks Save
    Note right of browser: Browser captures the new note data
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa 
    activate server
    server-->>browser: { "message": "Note saved successfully" }
    deactivate server
    
    Note right of browser: Browser updates the UI to include the new note without reloading the page

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: JSON containing updated notes data
    deactivate server
    
    Note right of browser: Browser processes the JSON data and re-renders the notes list, including the new note
