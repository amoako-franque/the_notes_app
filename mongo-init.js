
db = db.getSiblingDB('notes')

db.createCollection('users')
db.createCollection('notes')

db.users.createIndex({ "googleId": 1 }, { unique: true })
db.notes.createIndex({ "user": 1 })
db.notes.createIndex({ "title": "text", "body": "text" })

print('Database initialized successfully!')

