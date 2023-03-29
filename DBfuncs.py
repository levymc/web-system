from sqlalchemy import Column, Integer, String, create_engine, and_, func, update, exists, select, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
# from app import mode

# if mode == "dev":
engine = create_engine(r'sqlite:///static/db/compras.db', echo=False)
# elif mode == "prod":
#     engine = create_engine(r'sqlite://///NasTecplas/Pintura/DB/compras.db', echo=False)
    
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()


class Cotacao(Base):
    __tablename__ = "cotacao"
    
    id_cotacao = Column(Integer, primary_key=True, unique=True)
    id_solicitacao = Column(Integer)
    id_item = Column(Integer)
    item = Column(String)
    usuario = Column(String)
    fornecedor = Column(String)
    contato_fornecedor = Column(String)
    unidade = Column(String)
    valor_un = Column(Integer)
    frete = Column(Integer)
    inf_extra = Column(String)
    validade_cotacao = Column(String)
    status_cotacao = Column(String)
    
    def __repr__(self):
        return f"""Cotação de id: {self.id_cotacao}"""
    
    @hybrid_property
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    @classmethod
    def consultaTudo(cls):
        conteudo  = [cotacao.as_dict for cotacao in session.query(cls).all()]
        return conteudo
    
    @classmethod
    def consultaEspecifica(cls, coluna, valor):
        conteudo  = [i.as_dict for i in session.query(cls).filter(getattr(cls, coluna) == valor).all()]
        return conteudo
    
    @classmethod
    def obter_ultima_linha(cls):
        ultima_linha = session.query(cls).order_by(cls.id_cotacao.desc()).first().as_dict
        return ultima_linha
    
    @classmethod
    def contar_linhas(cls, status, id_solicitacao):
        quantidade_linhas = session.query(cls).filter(and_(cls.status_cotacao == status, cls.id_solicitacao == id_solicitacao)).count()
        return quantidade_linhas
    
    @classmethod
    def insert(cls, id_solicitacao, id_item, item, usuario, fornecedor, contato_fornecedor, unidade, valor_un, frete, inf_extra, validade_cotacao, status_cotacao):
        try:
            cotacao = cls(
                id_solicitacao=id_solicitacao,
                id_item=id_item,
                item=item,
                usuario=usuario,
                fornecedor=fornecedor,
                contato_fornecedor=contato_fornecedor,
                unidade=unidade,
                valor_un=valor_un,
                frete=frete,
                inf_extra=inf_extra,
                validade_cotacao=validade_cotacao,
                status_cotacao=status_cotacao
            )
            session.add(cotacao)
            session.commit()
            return cotacao
        except IntegrityError as e:
            session.rollback()
            print(f"Erro ao inserir a Solicitação {id_solicitacao}: {str(e)}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao inserir item {id_solicitacao}: {str(e)}")
        finally:
            session.close()
    
    @classmethod
    def delete(cls, id_cotacao):
        session = Session()
        try:
            cotacao = session.query(cls).filter(cls.id_cotacao == id_cotacao).one()
            session.delete(cotacao)
            session.commit()
        except NoResultFound:
            print(f"Não existe cotacao com o id_cotacao {id_cotacao}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar cotacao com o id_cotacao {id_cotacao}: {str(e)}")
        finally:
            session.close()
    
    @classmethod
    def update(cls, id_cotacao, **kwargs):
        session = Session()
        try:
            cotacao = session.query(cls).filter(cls.id_cotacao == id_cotacao).one()
            for key, value in kwargs.items():
                setattr(cotacao, key, value)
            session.commit()
        except NoResultFound:
            print(f"Não existe cotação com o id_cotacao {id_cotacao}")
        except IntegrityError as e:
            session.rollback()
            print(f"Erro de integridade ao atualizar a cotação com o id_cotacao {id_cotacao}: {str(e)}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar a cotação com o id_cotacao {id_cotacao}: {str(e)}")
        finally:
            session.close()

    
    
class Itens(Base):
    __tablename__ = "itens"
    
    id_solicitacao = Column(Integer)
    id_item = Column(Integer, primary_key=True, unique=True)
    nomeItem = Column(String)
    descricao = Column(String)
    categoria = Column(String)
    classificacao = Column(String)
    quantidade = Column(Integer)
    unidade = Column(String)
    
    def __repr__(self):
        return f"""id: {self.id_item}"""
    
    @hybrid_property
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    @classmethod
    def consultaTudo(cls):
        conteudo  = [cotacao.as_dict for cotacao in session.query(cls).all()]
        return conteudo
    
    @classmethod
    def consultaEspecifica(cls, coluna, valor):
        conteudo  = [i.as_dict for i in session.query(cls).filter(getattr(cls, coluna) == valor).all()]
        return conteudo
    
    @classmethod
    def obter_ultima_linha(cls):
        ultima_linha = session.query(cls).order_by(cls.id_item.desc()).first().as_dict
        return ultima_linha
    
    @classmethod
    def insert(cls, id_solicitacao, nomeItem=None, descricao=None, categoria=None, classificacao=None, quantidade=None, unidade=None):
        session = Session()
        try:
            item = cls(id_solicitacao=id_solicitacao, nomeItem=nomeItem, descricao=descricao, categoria=categoria, classificacao=classificacao, quantidade=quantidade, unidade=unidade)
            session.add(item)
            session.commit()
        except IntegrityError as e:
            session.rollback()
            print(f"Erro ao inserir item: {str(e)}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao inserir item: {str(e)}")
        finally:
            session.close()
    
    @classmethod
    def delete(cls, id_solicitacao, id_item):
        session = Session()
        try:
            item = session.query(cls).filter(cls.id_solicitacao == id_solicitacao, cls.id_item == id_item).one()
            session.delete(item)
            session.commit()
        except NoResultFound:
            print(f"Não existe item com o id_solicitacao {id_solicitacao} e id_item {id_item}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar item com o id_solicitacao {id_solicitacao} e id_item {id_item}: {str(e)}")
        finally:
            session.close()
    
    @classmethod
    def update(cls, id_item, nomeItem=None, descricao=None, categoria=None, classificacao=None, quantidade=None, unidade=None):
        session = Session()
        try:
            item = session.query(cls).filter(cls.id_item == id_item).one()
            if nomeItem:
                item.nomeItem = nomeItem
            if descricao:
                item.descricao = descricao
            if categoria:
                item.categoria = categoria
            if classificacao:
                item.classificacao = classificacao
            if quantidade:
                item.quantidade = quantidade
            if unidade:
                item.unidade = unidade
            session.commit()
        except NoResultFound:
            print(f"Não existe item com o id_item {id_item}")
        except IntegrityError as e:
            session.rollback()
            print(f"Erro de integridade ao atualizar item com o id_item {id_item}: {str(e)}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar item com o id_item {id_item}: {str(e)}")
        finally:
            session.close()

    
    
class Solicitacao(Base):
    __tablename__="solicitacao"
    
    id_solicitacao = Column(Integer, primary_key=True, unique=True)
    solicitante = Column(String)
    data = Column(String)
    motivo = Column(String)
    qnt_itens = Column(Integer)
    setor = Column(String)
    prioridade = Column(String)
    qnt_cotacao = Column(Integer)
    status = Column(Integer)
    
    def __repr__(self):
        return f"""id: {self.id_solicitacao} - Solicitante: {self.solicitante} - 
                Data: {self.data} - Motivo: {self.motivo} - Qnt Itens: {self.qnt_itens} - 
                Setor: {self.setor} - Pioridade: {self.prioridade} - Qnt Cotação: {self.qnt_cotacao} - 
                Status: {self.status}
                """
    
    @hybrid_property
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    @classmethod
    def consultaTudo(cls):
        conteudo  = [cotacao.as_dict for cotacao in session.query(cls).all()]
        return conteudo
    
    @classmethod
    def consultaEspecifica(cls, coluna, valor):
        conteudo  = [i.as_dict for i in session.query(cls).filter(getattr(cls, coluna) == valor).all()]
        return conteudo
    
    @classmethod
    def obter_ultima_linha(cls):
        ultima_linha = session.query(cls).order_by(cls.id_solicitacao.desc()).first().as_dict
        return ultima_linha
    
    @classmethod
    def insert(cls, solicitante=None, data=None, motivo=None, qnt_itens=None, setor=None,
               prioridade=None, qnt_cotacao=0, status=0):
        session = Session()
        try:
            solicitacao = cls(solicitante=solicitante, data=data, motivo=motivo, qnt_itens=qnt_itens,
                              setor=setor, prioridade=prioridade, qnt_cotacao=qnt_cotacao, status=status)
            session.add(solicitacao)
            session.commit()
            print(f"Solicitação {solicitacao.id_solicitacao} inserida com sucesso.")
        except IntegrityError:
            session.rollback()
            print(f"Erro de integridade ao inserir a solicitação.")
        except Exception as e:
            session.rollback()
            print(f"Erro ao inserir a solicitação: {str(e)}")
        finally:
            session.close()

    @classmethod
    def delete(cls, id_solicitacao):
        session = Session()
        try:
            solicitacao = session.query(cls).filter(cls.id_solicitacao == id_solicitacao).one()
            session.delete(solicitacao)
            session.commit()
            print(f"Solicitação {id_solicitacao} deletada com sucesso.")
        except NoResultFound:
            print(f"Não existe solicitação com o id_solicitacao {id_solicitacao}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar solicitação com o id_solicitacao {id_solicitacao}: {str(e)}")
        finally:
            session.close()

    @classmethod
    def update(cls, id_solicitacao, solicitante=None, data=None, motivo=None, qnt_itens=None, setor=None,
               prioridade=None, qnt_cotacao=None, status=None):
        session = Session()
        try:
            solicitacao = session.query(cls).filter(cls.id_solicitacao == id_solicitacao).one()
            if solicitante:
                solicitacao.solicitante = solicitante
            if data:
                solicitacao.data = data
            if motivo:
                solicitacao.motivo = motivo
            if qnt_itens:
                solicitacao.qnt_itens = qnt_itens
            if setor:
                solicitacao.setor = setor
            if prioridade:
                solicitacao.prioridade = prioridade
            if qnt_cotacao:
                solicitacao.qnt_cotacao = qnt_cotacao
            if status:
                solicitacao.status = status
            session.commit()
            print(f"Solicitação {id_solicitacao} atualizada com sucesso.")
        except NoResultFound:
            print(f"Não existe solicitação com o id_solicitacao {id_solicitacao}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar solicitação com o id_solicitacao {id_solicitacao}: {str(e)}")
        finally:
            session.close()


# print(Solicitacao.obter_ultima_linha()['id_solicitacao'])
