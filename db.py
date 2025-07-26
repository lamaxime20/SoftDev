import psycopg2
from psycopg2 import OperationalError

host = 'dpg-d228skre5dus739coue0-a.oregon-postgres.render.com'
dbname = 'formulairedevsoft'
user = 'formulairedevsoft_user'
password = 'pIvarf5IubHWjEbE7VG0anZrC59qFpmK'

connection = None

try:
    connection = psycopg2.connect(
        host=host,
        dbname=dbname,
        user=user,
        password=password
    )
    print("Connexion réussie à la base de données PostgreSQL.")
except OperationalError as e:
    print(f"Erreur de connexion : {e}")