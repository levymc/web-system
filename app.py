from flask import Flask, render_template, request, flash, jsonify, session
import sqlite3, requests, sqlite_funcs, json, hashlib
from flask_mail import Mail, Message
from werkzeug.exceptions import abort
from datetime import timedelta

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.permanent_session_lifetime = timedelta(seconds=2)
# app.config['SERVER_NAME'] = 'sistema.tecplas:3000'

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'levytecplas@gmail.com'
app.config['MAIL_PASSWORD'] = 'pjuamxrpynilleto'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


@app.route("/", methods=["POST", "GET"])
def index():
    return render_template('index.html')

@app.route("/requisicao/", methods=["POST", "GET"])
def requisicao():
    return render_template('requisicao.html')

@app.route("/reqPend/", methods=["POST", "GET"])
def reqPend():
    return render_template('reqPend.html')

@app.route("/consultaFPQ", methods=["POST", "GET"])
def consultaFPQ():
    return render_template('consultaFPQ.html')

@app.route("/cotacao/", methods=["POST", "GET"])
def cotacao():
    output = request.get_json()
    result = json.loads(output)
    # print(result)
    return render_template('cotacao.html')

@app.route("/second/", methods=["POST", "GET"])
def second():
    return render_template('second.html')

@app.route("/acesso", methods=["POST", "GET"])
def acessoSistema():
    global result
    usuario = None
    result = {
        'usuario': str(request.values.get('formLoginUsuario')),
        'senha': str(request.values.get('formLoginSenha')),
    }
    resposta = sqlite_funcs.confereUsuario(result['usuario'], result['senha'])
    if resposta == True:
        # if 'usuario' in session:
        #     usuario = session['usuario']
        return render_template('second.html')
    elif resposta == "vazio":
        flash(f"Digite o usuário e a senha!", "warning")
        return render_template('index.html')
    else:
        flash(f"Usuário ou Senha inválido", "error")
        return render_template('index.html')

@app.route("/usuario", methods=["POST", "GET"])
def usuario():
    usuario = {'usuario': result['usuario'],
    'senha': result['senha']}
    resposta = json.dumps(usuario)
    return resposta

@app.route("/comprasInserir", methods=["POST", "GET"])
def comprasInserir():
    output = request.get_json()
    result_ = json.loads(output)
    result_['usuario'] = result['usuario']
    salvarDB = sqlite_funcs.solicitacaoComprasInserir(result_)
    return {'value': True}

@app.route("/comprasPendentesAprovacao", methods=["POST", "GET"])
def comprasPendentesAprovacao():
    return jsonify(sqlite_funcs.comprasPendentes('0'))

@app.route("/comprasAprovar", methods=["POST", "GET"])
def comprasAprovar():
    output = request.get_json()
    comprasPara_aprovar = json.loads(output)
    valor = sqlite_funcs.compras_updateSolicitacao(comprasPara_aprovar)
    return {'value': valor}

@app.route("/rejeitarCompras", methods=["POST", "GET"])
def rejeitarCompras():
    output = request.get_json()
    id_reprovar = json.loads(output)
    valor = sqlite_funcs.rejeitarCompra(id_reprovar)
    return {'value': valor}

@app.route("/comprasPendentes", methods=["POST", "GET"])
def comprasPendentes():
    return jsonify(sqlite_funcs.comprasPendentes(1))

@app.route("/cotacaoInserir", methods=["POST", "GET"])
def cotacaoInserir():
    output = request.get_json()
    resultado = json.loads(output)
    # print("Resultado: ",resultado)
    inserirDB = sqlite_funcs.cotacaoInserirDB(resultado)
    return {'value': inserirDB}

@app.route("/cotacaoUpdate", methods=["POST", "GET"])
def cotacaoUpdate():
    output = request.get_json()
    resultado = json.loads(output)
    print("Resultado: ",resultado)
    inserirDB = sqlite_funcs.cotacaoUpdate(resultado)
    return {'value': True}

@app.route("/cotacaoApagar", methods=["POST", "GET"])
def cotacaoApagar():
    output = request.get_json()
    resultado = json.loads(output)
    # print("Resultado: ",resultado)
    apagou = sqlite_funcs.cotacaoApagar(resultado)
    return {'value': apagou}

@app.route("/cotacaoInformacoes", methods=["POST", "GET"])
def cotacaoInformacoes():
    output = request.get_json()
    resultado = json.loads(output)
    informacoes = sqlite_funcs.cotacaoInformacoesDB(resultado['id_solicitacao'])
    return informacoes ## Devolve as cotações refentes ao id_solicitacao

@app.route("/dadosCotacao", methods=["POST", "GET"])
def dadosCotacao():
    output = request.get_json()
    resultado = json.loads(output)
    informacoes = sqlite_funcs.dadosCotacao(resultado['id_cotacao'])
    return informacoes ## Devolve a cotação referente ao id_cotacao

@app.route("/send", methods = ["POST"])
def send():
    if 'usuario_logado' not in session or session['usuario_logado'] == None:
        flash("Você não está conectado. Refaça o login!")
    output = request.get_json()
    result = json.loads(output) #this converts the json output to a python dictionary
    print(result) # Printing the new dictionary
    insert_message = sqlite_funcs.inserir(result)
    nome = result['nome']
    motivo = result['motivo']
    desc = result['descricao']
    msg = Message('ERRO - FPQ CONSULTA', sender = 'aeb0b9af40e392', recipients = ['processo5@tecplas.com.br'])
    msg.body = f"""
        Usuário:       {nome}
        Motivo:       {motivo}
        Descrição:       {desc}
        """
    mail.send(msg)
    return result

@app.route("/resultado", methods=["POST", "GET"])
def resultado():
    if request.method == 'POST':
        msg_ = request.values.get('input_2') if request.values.get('input_2') else ''
        try:
            if msg_ =='':
                flash(f"Digite algo para pesquisar", "error")
                return render_template('consultaFPQ.html')
            else:
                posts = sqlite_funcs.selec_status(msg_)
                return render_template('consultaFPQ.html', msg_=msg_, posts=posts)
        except sqlite3.OperationalError as e: 
            flash(f"Peça não encontrada, digite novamente !", "warning")
            return render_template('consultaFPQ.html', msg_=""), print(type(e), e)
    else: return render_template('consultaFPQ.html', msg_=msg_)

@app.route("/ajaxfile", methods = ["POST", "GET"])
def requiConsulta():
    produtos = sqlite_funcs.reqConsulta()
    return jsonify(produtos)

@app.route("/ajaxpendentes", methods = ["POST", "GET"])
def pendConsulta():
    try:
        pendencias = sqlite_funcs.pendConsulta()
        return jsonify(pendencias)
    except Exception as e:
        print("e")
        return e

@app.route("/requisicao/confere", methods = ["POST", "GET"])
def confere():
    output = request.get_json()
    result = json.loads(output) #Converte JSON em Py Dict
    senha = hashlib.md5(result['senha'].encode()).hexdigest()
    try:
        conn = sqlite3.connect('static/db/requisicao.db')
        cursor = conn.cursor()
        user_find = cursor.execute(f"SELECT * FROM usuarios WHERE senha='{senha}'").fetchall()[0][1]
        print("Login realizado com Sucesso!")
        print(result)
        # AQUI ENTRA O SCRIPT DE ENVIO AO BANCO DE DADOS!
        return render_template('requisicao.html')
    except IndexError as passwordError: 
        print("Erro: "+ str(passwordError))
        return render_template('requisicao.html')
    except Exception as e:
        print("Algum erro ocorreu no sistema: \n"+type(e)+":"+str(e))
        return render_template('requisicao.html', e=e)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000) #, use_reloader=False