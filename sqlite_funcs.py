import sqlite3, hashlib
from datetime import datetime
from DBfuncs import *


def inserir(result):
    conn = sqlite3.connect('static/db/fpq_status.db')
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO contato_processo (nome, motivo, descricao) VALUES (?, ?, ?)", (result['nome'], result['motivo'], result['descricao']))
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
    for a, b in enumerate(quantidades):
        if quantidades[b] != 0:
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
    
    resultado = result['usuario'], result['dataAtual'], result['motivo'], result['qnt_itens'], result['setor'], result['prioridade']
    Solicitacao.insert(resultado)
    id_solicitacao = Solicitacao.obter_ultima_linha()['id_solicitacao']
    itens = result['itens']
    # try:
    for i in itens:
        print(i)
        # Itens.insert(id_solicitacao, i['nomeItem'], i['descricao'], i['categoria'], i['classificacao'], i['quantidade'],i['unidade'])
    # except TypeError:
    #         Itens.insert(id_solicitacao, itens['nomeItem'], itens['descricao'], itens['categoria'], itens['classificacao'], itens['quantidade'], itens['unidade'])
    return True
    
    # try:
    #     conn = sqlite3.connect('static/db/compras.db')
    #     cursor = conn.cursor()
    #     cursor.execute(f"""
    #         INSERT INTO solicitacao 
    #         (solicitante, data, motivo, qnt_itens, setor, prioridade ) 
    #         VALUES (?, ?, ?, ?, ?, ?)""", 
    #         (resultado))
    #     conn.commit()
    #     id_solicitacao = cursor.execute(f"""SELECT id_solicitacao 
    #                                     FROM solicitacao 
    #                                     WHERE solicitante = '{result['usuario']}'
    #                                     AND motivo = '{result['motivo']}'
    #                                     AND qnt_itens = {result['qnt_itens']}""").fetchall()[0][0]
    #     try:
    #         for i in itens: #### FAZER DIFERENCA PARA QUNDO TEM MAIS DE 1 ITEM OU apenas 1
    #             cursor.execute(f"""
    #                            INSERT INTO itens
    #                            (id_solicitacao, nomeItem, descricao, categoria, classificacao, quantidade, unidade)
    #                            VALUES (?, ?, ?, ?, ?, ?, ?)""",
    #                            (id_solicitacao, i['nomeItem'], i['descricao'], i['categoria'], i['classificacao'], i['quantidade'],i['unidade']))
    #     except TypeError:
    #         cursor.execute(f"""
    #                         INSERT INTO itens
    #                         (id_solicitacao, nomeItem, descricao, categoria, classificacao, quantidade, unidade)
    #                         VALUES (?, ?, ?, ?, ?, ?, ?)""",
    #                         (id_solicitacao, itens[0], itens[1], itens[2], itens[3], itens[4],itens[5]))
                
    #     conn.commit()
    #     conn.close()
    #     return True
    # except Exception as e: 
    #     print(type(e),e)
    #     return False

def comprasPendentes(status):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        compras = []
        dados = cursor.execute(f"SELECT * FROM solicitacao WHERE status = {status}").fetchall()
        for i in dados:
            itens = cursor.execute(f"SELECT * FROM itens WHERE id_solicitacao = {i[0]}").fetchall()
            itensDataTable = ''
            if not itens == []:
                for j in range(len(itens)):
                    itensDataTable += itens[j][2] + ', '
            itensDataTable = itensDataTable[:-1]
            itensDataTable = itensDataTable[:-1]
            qnt_cotacao = len(cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao = {i[0]} AND status_cotacao = 0").fetchall())
            qnt_cotacao_rejeitada = len(cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao = {i[0]} AND status_cotacao = 2").fetchall())
            if qnt_cotacao_rejeitada != 0:
                qnt_cotacao = 1 + qnt_cotacao - qnt_cotacao_rejeitada
            compras.append({
                'id_solicitacao':i[0],
                'solicitante': i[1],
                'itens': itensDataTable,
                'qnt_itens': i[4],
                'data': i[2],
                'motivo': i[3],
                'setor':i[5],
                'qnt_cotacao': qnt_cotacao,
            })
        conn.close()
        return {'aaData': compras}
    except Exception as e:
        print(e)
        return {'value': False}

def itensMaisInfo(id_solicitacao):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        itens = cursor.execute(f"SELECT * FROM itens WHERE id_solicitacao = {1}").fetchall()
        print(itens)
        return itens
    except Exception as e:
        print(e)
        return False

def compras_updateSolicitacao(comprasPara_aprovar):
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        cursor.execute(f"UPDATE solicitacao SET status=1 WHERE id_solicitacao='{comprasPara_aprovar['id_solicitacao']}'")
        print("Aprovou!")
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Nao Aprovou: ",e)
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
    print(resultado)
    try:
        conn = sqlite3.connect('static/db/compras.db')
        cursor = conn.cursor()
        cursor.execute(f"""
            INSERT INTO cotacao 
            (id_solicitacao, id_item, item, usuario, fornecedor, contato_fornecedor, unidade, valor_un, frete, inf_extra, validade_cotacao)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """,
            (resultado['id_solicitacao'], resultado['id_item'], resultado['item'], resultado['solicitante'], resultado['fornecedor'], 
            resultado['contato_fornecedor'], resultado['unidade'], resultado['valor_unitario'],
            resultado['frete'], resultado['inf_extra'], resultado['validade_cotacao']))
        conn.commit()
        conn.close()
        print("Informações enviadas ao DB com sucesso!")
        return True
    except Exception as e:
        print("Erro: ",e)
        return False

def cotacaoUpdate(dados):
    try:
        conn = sqlite3.connect('static/db/compras.db') 
        cursor = conn.cursor()
        cursor.execute(f"UPDATE cotacao SET fornecedor='{dados['fornecedor']}' WHERE id_cotacao={dados['id_cotacao']} AND id_item={dados['id_item']}")
        cursor.execute(f"UPDATE cotacao SET valor_un='{dados['valor_unitario']}' WHERE id_cotacao={dados['id_cotacao']} AND id_item={dados['id_item']}")
        cursor.execute(f"UPDATE cotacao SET unidade='{dados['unidade']}' WHERE id_cotacao={dados['id_cotacao']} AND id_item={dados['id_item']}")
        cursor.execute(f"UPDATE cotacao SET frete='{dados['frete']}' WHERE id_cotacao={dados['id_cotacao']} AND id_item={dados['id_item']}")
        cursor.execute(f"UPDATE cotacao SET inf_extra='{dados['inf_extra']}' WHERE id_cotacao={dados['id_cotacao']} AND id_item={dados['id_item']}")
        cursor.execute(f"UPDATE cotacao SET validade_cotacao='{dados['validade_cotacao']}' WHERE id_cotacao={dados['id_cotacao']} AND id_item={dados['id_item']}")
        conn.commit()
        conn.close()
        return True

    except Exception as e:
        print("Error:", e)
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
        informacoes = cursor.execute(f"SELECT * FROM cotacao WHERE id_solicitacao={id_solicitacao} AND status_cotacao=0").fetchall()
        dict_lista_informacoes = []
        for i in informacoes:
            dict_lista_informacoes.append({
                'id_cotacao':i[0],
                'id_solicitacao':i[1],
                'id_item':i[2],
                'item':i[3],
                'solicitante':i[4],
                'fornecedor':i[5],
                'contato_fornecedor':i[6],
                'unidade':i[7],
                'valor_unitario':i[8],
                'frete':i[9],
                'inf_extra':i[10],
                'validade_cotacao':i[11],
                'status_cotacao':i[12],
            })
        conn.close()
        return dict_lista_informacoes
        
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
        dict_informacoes['id_item']=informacoes[2]
        dict_informacoes['item']=informacoes[3]
        dict_informacoes['solicitante']=informacoes[4]
        dict_informacoes['fornecedor']=informacoes[5]
        dict_informacoes['contato_fornecedor']=informacoes[6]
        dict_informacoes['unidade']=informacoes[7]
        dict_informacoes['valor_unitario']=informacoes[8]
        dict_informacoes['frete']=informacoes[9]
        dict_informacoes['inf_extra']=informacoes[10]
        dict_informacoes['validade_cotacao']=informacoes[11]
        dict_informacoes['status_cotacao']=informacoes[12]
        print(dict_informacoes)
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
