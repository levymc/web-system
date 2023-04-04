from flask import Flask, request, render_template
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Salvar o arquivo enviado pelo usuário
        file = request.files['file']
        file.save(file.filename)

        # Ler o arquivo CSV ou Excel e gerar os dados para o gráfico
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.filename)
        elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(file.filename)
        else:
            return 'Arquivo inválido'

        x = df.iloc[:, 0]
        y = df.iloc[:, 1]

        # Criar o gráfico usando Matplotlib
        fig, ax = plt.subplots()
        ax.plot(x, y)

        # Salvar o gráfico em um buffer de memória
        buffer = BytesIO()
        fig.savefig(buffer, format='png')
        buffer.seek(0)

        # Codificar o gráfico em base64 para incorporá-lo na página HTML
        image = base64.b64encode(buffer.getvalue()).decode('utf-8')

        # Exibir a página HTML com o gráfico incorporado
        return render_template('graph.html', image=image)
    else:
        return render_template('graph.html')

if __name__ == '__main__':
    app.run(debug=True, port=2000)
