sequenceDiagram
    participant user
    participant browser
    participant server
    participant database
    
    user->>browser: Types new note and clicks Save
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note (with note data)
    activate server
    server->>database: Save note to database
    activate database
    database-->>server: Note saved confirmation
    deactivate database
    server-->>browser: Redirect to /notes (HTTP 302 Found)
    deactivate server
    
    Note right of browser: Browser initiates page reload due to redirect
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server
    
    Note right of browser: Browser executes JavaScript to fetch and render updated notes
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: JSON containing all notes
    deactivate server
    
    Note right of browser: Browser executes callback to render notes including the new one
