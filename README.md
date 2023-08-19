# README

This is a basic test application using Rails API + ReactJS.
The point of it all is to experiment with websockets and ActionCable.
This application is a very basic chat application.

# Running the application

```sh
bundle install
rails db:migrate
rails s

# in another terminal
cd client
npm install
npm run dev
```

Lastly, open a browser, and visit http://localhost:5173
