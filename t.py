import sqlite_funcs, json, hashlib, sqlite3

conn = sqlite3.connect('static/db/compras.db')
cursor = conn.cursor()
cursor.execute(f"""UPDATE solicitacao SET qnt_cotacao = {0+1} WHERE id_solicitacao = {1}""")
conn.commit()