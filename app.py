from flask import Flask, request, jsonify, render_template
from db import connection
import re

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")  # sert la page principale

@app.route('/formulaire', methods=['POST'])
def handle_form():
    nom = request.form.get('nom', '').strip()
    email = request.form.get('email', '').strip()
    message = request.form.get('message', '').strip()

    if not nom or not email or not message:
        return "❌ Tous les champs sont obligatoires.", 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return "❌ Adresse email invalide.", 400

    try:
        with connection.cursor() as cursor:
            cursor.callproc('CreationReq', [nom, email, message])
            connection.commit()
        return "✅ Requête envoyée avec succès !", 200
    except Exception as e:
        return f"❌ Erreur : {e}", 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=10000)