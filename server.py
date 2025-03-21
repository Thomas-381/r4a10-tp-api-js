from livereload import Server, shell
server = Server()

server.setHeader('Access-Control-Allow-Origin', '*')
server.setHeader('Access-Control-Allow-Methods', '*')
server.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
server.setHeader("Pragma", "no-cache")
server.setHeader("Expires", "0")

server.watch('./assets/styles.css')
server.watch('./app.js')
server.watch('./index.html')

# use custom host and port
server.serve(port=8080, host='0.0.0.0')
