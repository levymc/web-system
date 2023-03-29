from DBfuncs import *
compras = []
dados = Solicitacao.consultaEspecifica('status', 0)
for i in dados:
    itens = Itens.consultaEspecifica('id_solicitacao', i['id_solicitacao'])
    itensDataTable = ''
    if not itens == []:
        for j in itens:
            itensDataTable += j['nomeItem'] + ', '
    itensDataTable = itensDataTable[:-2]
    qnt_cotacao = Cotacao.contar_linhas(0, i['id_solicitacao'])
    qnt_cotacao_rejeitada = Cotacao.contar_linhas(2, i['id_solicitacao'])
    if qnt_cotacao_rejeitada != 0:
        qnt_cotacao = 1 + qnt_cotacao - qnt_cotacao_rejeitada
    compras.append({
            'id_solicitacao':i['id_solicitacao'],
            'solicitante': i['solicitante'],
            'itens': itensDataTable,
            'qnt_itens': i['qnt_itens'],
            'data': i['data'],
            'motivo': i['motivo'],
            'setor':i['setor'],
            'qnt_cotacao': qnt_cotacao,
        })

print(compras)
        
        