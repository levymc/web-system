import sqlite3, hashlib
from datetime import datetime


def inserir(result):
    conn = sqlite3.connect('static/db/fpq_status.db')
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO contato_processo (nome, motivo, descricao) VALUES (?, ?, ?)", (result['nome'], result['motivo'], result['descricao']))
    print(result['nome'], result['motivo'], result['descricao'])
    conn.commit()
    conn.close()
    return "Informações inseridas no DB"

def reqConsulta():
    conn = sqlite3.connect('static/db/requisicao.db')
    cursor = conn.cursor()
    produtos = cursor.execute("SELECT id_item,descricao,um FROM itens").fetchall()
    conn.close()
    data=[]
    for i in produtos:
        data.append({
            'id_item':i[0],
            'descricao':i[1],
            'um':i[2]
        })
    response = {
        'aaData': data
    }
    return response

def pendConsulta():
    conn = sqlite3.connect('static/db/requisicao.db')
    cursor = conn.cursor()
    pend_req_eng = cursor.execute("SELECT * FROM req_eng WHERE done = 0").fetchall()
    data = []
    for i in pend_req_eng:
        for itens in cursor.execute(f"SELECT id_item FROM requisicoes WHERE id_requisicao ='{i[0]}'").fetchall():
            solicitante = cursor.execute(f"SELECT solicitante_eng FROM req_eng WHERE id_req_eng = '{i[0]}'").fetchall()[0][0]
            data.append({
                'id_item': itens[0],
                'descricao': cursor.execute(f"SELECT descricao FROM itens WHERE id_item = '{itens[0]}'").fetchall()[0][0],
                'um': cursor.execute(f"SELECT um FROM itens WHERE id_item = '{itens[0]}'").fetchall()[0][0],
                'tipo': cursor.execute(f"SELECT tipo FROM itens WHERE id_item = '{itens[0]}'").fetchall()[0][0],
                'qnt_solicitada' : cursor.execute(f"SELECT qnt_requisicao FROM requisicoes WHERE id_item ='{itens[0]}'").fetchall()[0][0],
                'solicitante' : solicitante,
                'setor' : cursor.execute(f"SELECT setor FROM usuarios WHERE usuario = '{solicitante}'").fetchall()[0][0]
            })
    response = {'aaData': data}
    conn.close()
    return response

def insertReqEng(codigos, quantidades):
    conn = sqlite3.connect('static/db/requisicao.db')
    cursor = conn.cursor()
    hoje = datetime.today().strftime('%d-%m-%Y')
    cursor.execute(f"INSERT INTO req_eng (solicitante_eng, data_solicitacao) VALUES (?, ?)", ("LEVY", hoje))
    conn.commit()
    id_req = cursor.execute(f"SELECT id_req_eng FROM req_eng WHERE id_req_eng=(SELECT max(id_req_eng) FROM req_eng)").fetchall()
    print(id_req[0][0])
    for a, b in enumerate(quantidades):
        if quantidades[b] != 0:
            print(b+":"+str(quantidades[b]))
            cursor.execute(f"INSERT INTO requisicoes (id_item, id_requisicao, qnt_requisicao) VALUES (?, ?, ?)", (int(b), id_req[0][0], quantidades[b]))
            conn.commit()

def confereUsuario(usuario, senha):
    if usuario == '' and senha == '':
        return "vazio"
    else:
        conn = sqlite3.connect('static/db/requisicao.db')
        cursor = conn.cursor()
        senha2 = hashlib.md5(senha.encode()).hexdigest()
        try:
            dados = cursor.execute(f"SELECT senha FROM usuarios WHERE usuario='{usuario}' ").fetchall()[0][0]
            dados2 = cursor.execute(f"SELECT usuario FROM usuarios WHERE senha='{senha2}' ").fetchall()[0][0]
            if dados and dados2:
                return True
            else:
                print("Usuário ou senha inválidos")
                return False
        except Exception as e:
            print("Usuário ou senha inválidos")
            print(e)
            return False

def solicitacaoComprasInserir(result):
    resultado = result['usuario'], result['dataAtual'], result['nomeItem'], result['descricao'], result['quantidade'], result['unidade'], result['motivo'], result['setor']
    print(resultado)
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        cursor.execute(f"""
            INSERT INTO solicitacao 
            (solicitante, data, nome_item, descricao, quantidade, unidade, motivo, setor) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", 
            (resultado))
        conn.commit()
        conn.close()
        return True
    except Exception as e: 
        print(type(e),e)
        return False

def comprasPendentes(status):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        compras = []
        dados = cursor.execute(f"SELECT * FROM solicitacao WHERE status = {status}").fetchall()
        for i in dados:
            qnt_cotacao = len(cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao = {i[0]} AND status_cotacao = 0").fetchall())
            qnt_cotacao_rejeitada = len(cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao = {i[0]} AND status_cotacao = 2").fetchall())
            if qnt_cotacao_rejeitada != 0:
                qnt_cotacao = 1 + qnt_cotacao - qnt_cotacao_rejeitada
            compras.append({
                'id_solicitacao':i[0],
                'solicitante': i[1],
                'data': i[2],
                'nomeItem': i[3],
                'descricao': i[4],
                'quantidade': i[5],
                'unidade': i[6],
                'motivo': i[7],
                'setor':i[8],
                'qnt_cotacao': qnt_cotacao,
            })
        conn.close()
        return {'aaData': compras}
    except Exception as e:
        return {'value': False}

def compras_updateSolicitacao(comprasPara_aprovar):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        cursor.execute(f"UPDATE solicitacao SET status=1 WHERE id_solicitacao='{comprasPara_aprovar['id_solicitacao']}'")
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(e)
        return e

def rejeitarCompra(id):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        cursor.execute(f"UPDATE solicitacao SET status=2 WHERE id_solicitacao='{id}'")
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(e)
        return e

def cotacaoInserirDB(resultado):
    print("Resultado22: ",resultado)
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        qnt_solicitada = ''
        if str(resultado["qnt_solicitada"]).isnumeric() == False: 
            for i in resultado["qnt_solicitada"]:
                if i.isnumeric():
                    qnt_solicitada+=i
            if resultado["frete"] != "":
                resultado["valor_total"] = int(resultado["valor_unitario"])*int(qnt_solicitada)+int(resultado["frete"])
            else: resultado["valor_total"] = int(resultado["valor_unitario"])*int(qnt_solicitada)
            cursor.execute(f"""
                INSERT INTO cotacao 
                (id_solicitacao, usuario, fornecedor, quantidade, unidade, valor_un, valor_total, frete, inf_extra, validade_cotacao)
                VALUES (?,?,?,?,?,?,?,?,?)
                """,
                (resultado['id_solicitacao'], resultado['solicitante'], resultado['fornecedor'], 
                qnt_solicitada, resultado['unidade'], resultado['valor_unitario'], resultado['valor_total'],
                resultado['frete'], resultado['inf_extra'], resultado['validade_cotacao']))
            qnt_cotacao = cursor.execute(f"SELECT qnt_cotacao FROM solicitacao WHERE id_solicitacao = {resultado['id_solicitacao']}").fetchall()[0][0]
            qnt_cotacao_rejeitada = cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao = {resultado['id_solicitacao']} AND status_cotacao = 2").fetchall()
            qnt_cotacao = qnt_cotacao - len(qnt_cotacao_rejeitada)
            cursor.execute(f"""UPDATE solicitacao SET qnt_cotacao = {int(qnt_cotacao)+1} WHERE id_solicitacao = {resultado['id_solicitacao']}""")
            print(qnt_cotacao)
            conn.commit()
            conn.close()
        else: 
            qnt_solicitada = resultado["qnt_solicitada"]
            if resultado["frete"] != "":
                resultado["valor_total"] = int(resultado["valor_unitario"])*qnt_solicitada+int(resultado["frete"])
            else: resultado["valor_total"] = int(resultado["valor_unitario"])*qnt_solicitada
            cursor.execute(f"""
                INSERT INTO cotacao 
                (id_solicitacao, usuario, fornecedor, quantidade, unidade, valor_un, valor_total, frete, inf_extra, validade_cotacao)
                VALUES (?,?,?,?,?,?,?,?,?,?)
                """,
                (resultado['id_solicitacao'], resultado['solicitante'], resultado['fornecedor'], 
                qnt_solicitada, resultado['unidade'], resultado['valor_unitario'], resultado['valor_total'],
                resultado['frete'], resultado['inf_extra'], resultado['validade_cotacao']))
            qnt_cotacao = cursor.execute(f"SELECT qnt_cotacao FROM solicitacao WHERE id_solicitacao = {resultado['id_solicitacao']}").fetchall()[0][0]
            cursor.execute(f"""UPDATE solicitacao SET qnt_cotacao = {int(qnt_cotacao)+1} WHERE id_solicitacao = {resultado['id_solicitacao']}""")
            conn.commit()
            conn.close()
        print("Informações enviadas ao DB com sucesso!")
        return True
    except Exception as e:
        print("Erro: ",e)
        return False

def cotacaoApagar(id_cotacao):
    try:
        id_cotacao = id_cotacao['id']
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        cursor.execute(f"UPDATE cotacao SET status_cotacao = 2 WHERE id_cotacao='{id_cotacao}'")
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(e)
        return False

def cotacaoInformacoesDB(id_solicitacao):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        dict_informacoes = {}
        informacoes = cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao={id_solicitacao} AND status_cotacao=0").fetchall()
        if len(informacoes)<=1:
            informacoes = informacoes[0]
            dict_informacoes['id_cotacao']=informacoes[0]
            dict_informacoes['id_solicitacao']=informacoes[1]
            dict_informacoes['solicitante']=informacoes[2]
            dict_informacoes['fornecedor']=informacoes[3]
            dict_informacoes['contato_fornecedor']=informacoes[4]
            dict_informacoes['qnt_solicitada']=informacoes[5]
            dict_informacoes['valor_unitario']=informacoes[6]
            dict_informacoes['valor_total']=informacoes[7]
            dict_informacoes['frete']=informacoes[8]
            dict_informacoes['inf_extra']=informacoes[9]
            dict_informacoes['validade_cotacao']=informacoes[10]
            dict_informacoes['status_cotacao']=informacoes[11]
            return dict_informacoes
        else:
            dict_lista_informacoes = []
            for i in informacoes:
                dict_lista_informacoes.append({
                    'id_cotacao':i[0],
                    'id_solicitacao':i[1],
                    'solicitante':i[2],
                    'fornecedor':i[3],
                    'contato_fornecedor':i[4],
                    'qnt_solicitada':i[5],
                    'valor_unitario':i[6],
                    'valor_total':i[7],
                    'frete':i[8],
                    'inf_extra':i[9],
                    'validade_cotacao':i[10],
                    'status_cotacao':i[11],
                })
            return dict_lista_informacoes
        conn.close()
    except Exception as e:
        print(e)
        return False

def dadosCotacao(id_cotacao):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        dict_informacoes = {}
        dados = cursor.execute(f"SELECT * FROM cotacao WHERE id_cotacao={id_cotacao} AND status_cotacao=0").fetchall()
        informacoes = dados[0]
        dict_informacoes['id_cotacao']=informacoes[0]
        dict_informacoes['id_solicitacao']=informacoes[1]
        dict_informacoes['solicitante']=informacoes[2]
        dict_informacoes['fornecedor']=informacoes[3]
        dict_informacoes['contato_fornecedor']=informacoes[4]
        dict_informacoes['qnt_solicitada']=informacoes[5]
        dict_informacoes['valor_unitario']=informacoes[6]
        dict_informacoes['valor_total']=informacoes[7]
        dict_informacoes['frete']=informacoes[8]
        dict_informacoes['inf_extra']=informacoes[9]
        dict_informacoes['validade_cotacao']=informacoes[10]
        dict_informacoes['status_cotacao']=informacoes[11]
        return dict_informacoes
    except Exception as e:
        print(e)
        return False


def selec_status(var):
    conn = sqlite3.connect('./static/db/fpq_status.db')
    cursor = conn.cursor()
    posts = cursor.execute(f'SELECT * FROM status_fpq WHERE cemb={var} OR pn_topo="{var}"').fetchall()
    conn.close()
    return posts

# solicitacaoComprasInserir()
# pendConsulta()
# print(pendConsulta())
# print(reqConsulta())
# confereUsuario('teste', 'teste')
# print(comprasPendentes())