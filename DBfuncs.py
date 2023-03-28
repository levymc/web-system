from sqlalchemy import Column, Integer, String, create_engine, and_, func, update, exists, select, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

engine = create_engine(r'sqlite://///NasTecplas/Pintura/DB/compras.db', echo=False)
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
    def insert(cls, id_solicitacao, id_item, nomeItem, descricao, categoria, classificacao, quantidade, unidade):
        session = Session()
        try:
            item = cls(id_solicitacao=id_solicitacao, id_item=id_item, nomeItem=nomeItem, descricao=descricao, categoria=categoria, classificacao=classificacao, quantidade=quantidade, unidade=unidade)
            session.add(item)
            session.commit()
        except IntegrityError as e:
            session.rollback()
            print(f"Erro ao inserir item {id_item}: {str(e)}")
        except Exception as e:
            session.rollback()
            print(f"Erro ao inserir item {id_item}: {str(e)}")
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
        return f"""id: {self.id_solicitacao}"""
    
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
    
    
