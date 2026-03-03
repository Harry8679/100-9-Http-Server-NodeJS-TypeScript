# GET tous les utilisateurs
curl http://localhost:3000/users

# GET avec filtre
curl "http://localhost:3000/users?name=harry"

# GET par ID
curl http://localhost:3000/users/1

# POST créer un utilisateur
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Clara","email":"clara@example.com","age":22}'

# PUT modifier
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Harry Mezui Updated"}'

# DELETE supprimer
curl -X DELETE http://localhost:3000/users/4

# Route inexistante → 404
curl http://localhost:3000/unknown