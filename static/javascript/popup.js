function newPopup(){
    Swal.fire({
        title: 'Contato Processo',
        html: `<div class="loginCompras">
        <div class="row" style="width:60%; margin-bottom:1em, margin-left:auto; margin-right:auto">
            <input type="text" id="nome_contato" name="nome" class="swal2-input" placeholder="Nome">
        </div>
        <div class="row" style="width:60%; margin-bottom:1em, margin-left:auto; margin-right:auto">
            <input type="text" id="motivo_contato" name="motivo" class="swal2-input" placeholder="Motivo">
        </div>
        <div class="row" style="width:60%; margin-bottom:1em, margin-left:auto !important; margin-right:auto !important">
            <textarea id="descricao_contato" name="descricao_contato" cols="30" rows="500" style="height:10em !important;" class="swal2-textarea"  maxlength="200" placeholder="Descrição"></textarea>
        </div>
            </div>`,
        confirmButtonText: 'Enviar',
        confirmButtonColor:'hwb(216 31% 1%)',
        showCancelButton: true,
        
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
        const login = Swal.getPopup().querySelector('#login').value
        const password = Swal.getPopup().querySelector('#password').value
        const descricao = Swal.getPopup().querySelector('#descricao').value
        if (!login || !password) {
            Swal.showValidationMessage(`Nome e motivo devem ser preenchidos.`)
        }
        return { login: login, password: password , descricao: descricao}
    }
    }).then((result) => {
        if (!result.value){
          Swal.fire({
            title:"Contato cancelado.",
            showConfirmButton: true,
            timer: 1000,
            confirmButtonText: 'OK',
            confirmButtonColor:'hwb(216 31% 1%)',
          })
        }else{
            const nome = result.value.login;
            const motivo = result.value.password;
            const descricao = result.value.descricao;
            const dict_values = {nome, motivo, descricao};
            const s = JSON.stringify(dict_values);
            $.ajax({
                url:"/send",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(s)
            });
            Swal.fire(`
            Informações enviadas com sucesso!!
            `.trim())
        }
    }) 
};

function requiSend(){
    Swal.fire({
        title: 'Solicitante',
        html: `<div class="loginCompras">
        <input type="text" id="login" class="swal2-input" placeholder="Usuário">
        <input type="password" id="password" class="swal2-input" placeholder="Senha">
        </div>`,
        confirmButtonText: 'Enviar Requisição',
        focusConfirm: false,
        preConfirm: () => {
          const login = Swal.getPopup().querySelector('#login').value
          const password = Swal.getPopup().querySelector('#password').value
          if (!login || !password) {
            Swal.showValidationMessage(`Insira o usuário e a senha.`)
          }
          return { login: login, password: password}
        }
      }).then((result) => {
        const usuario = result.value.login
        const senha = result.value.password
        const dict_values = {usuario, senha}; //, quantidade
        const s = JSON.stringify(dict_values);
        $.ajax({
          url:"/requisicao/confere",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(s)
      });
      //   Swal.fire(`
      //   //   ${dict_values}
      //   // `.trim())
      })     
};

function acessoResponsavel(){
  Swal.fire({
    title: 'Responsável pela Área',
    html: `<input type="text" id="login" class="swal2-input" placeholder="Usuário">
    <input type="password" id="password" class="swal2-input" placeholder="Senha">`,
    confirmButtonText: 'Entrar',
    focusConfirm: false,
    preConfirm: () => {
      const login = Swal.getPopup().querySelector('#login').value
      const password = Swal.getPopup().querySelector('#password').value
      if (!login || !password) {
        Swal.showValidationMessage(`Please enter login and password`)
      }
      return { login: login, password: password }
    }
  }).then((result) => {
    Swal.fire(`
      Login: ${result.value.login}
      Password: ${result.value.password}
    `.trim())
  })     
};

function solicitacaoCompra(){
  var itens = [];
  $.ajax({
    url:"/usuario",
    type: "POST",
    contentType: "application/json"
  }).done((jade) => {
    if (jade == false){
      console.log("Error");
    } else {
      var test = JSON.parse(jade)
      var html = `
      <section class="containerExterno" id="itens"></section>
  <div class="row" style="margin-left:1em !important;">
    <div class="col">
      <div class="row">
        <h3 style="text-align: left; margin-left: 0.75em; margin-top: 4% ;">Usuário: <b>${test.usuario.charAt(0).toUpperCase() + test.usuario.slice(1)}</b></h3>
      </div>
      <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
        <label for="item_solicitacao">Nome do Item (forma genérica)</label>
        <input type="text" MAXLENGTH=25 id="item_solicitacao" name="item_solicitacao" class="swal2-input" placeholder="Nome do Item" style="width: 80%; margin-left:0 !important;">
        </div>
      <div class="row text-start" style="margin-left:1em !important;; margin-top:0.9em;">
        <label for="descricao_solicitacao">Descrição  (especificações)</label>
        <textarea id="descricao_solicitacao" name="descricao_solicitacao" rows="10" cols="10" style="margin-left:-0em !important; resize:none; width: 80%;" class="swal2-textarea text-start"  maxlength="200" placeholder="Descrição da Solicitação"></textarea>
      </div>
      <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
        <label for="item_solicitacao">Categoria </label>
        <select style="margin-left:-0em !important;font-size:14px;width:80%" class="selectClass1" id="categoria">
          <option style="font-size:14px;" value="" disabled selected>Categoria</option>
          <option style="font-size:14px;" value="Componente">Componente</option>
          <option style="font-size:14px;" value="EPI">EPI</option>
          <option style="font-size:14px;" value="Material de Consumo">Material de Consumo Produtivo</option>
          <option style="font-size:14px;" value="Escritório">Material de Escritório</option>
          <option style="font-size:14px;" value="Material de Manutenção">Material de Manutenção</option>
          <option style="font-size:14px;" value="Material de Higiene e Limpeza">Material de Higiene e Limpeza</option>
          <option style="font-size:14px;" value="MP">Matéria-Prima</option>
        </select>
      </div>
      <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
        <label for="classificacao">Classificação </label>
        <select style="margin-left:-0em !important;font-size:14px;width:80%" class="selectClass1" id="classificacao">
        <option value="" disabled selected>Classificação</option>
          <optgroup label="Material Novo">
            <option>Investimento</option>
            <option>Obra/Infraestrutura</option>
            <option value="Material Novo - Manutenção Planejada">Manutenção Planejada</option>
            <option value="Material Novo - Manutenção Corretiva">Manutenção Corretiva</option>
          </optgroup>
          <optgroup label="Serviço">
            <option value="Serviço - Manutenção Planejada">Manutenção Planejada</option>
            <option value="Serviço - Manutenção Corretiva">Manutenção Corretiva</option>
          </optgroup>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
        <label for="quantidade_solicitacao">Quantidade</label>             
        <input type="number" id="quantidade_solicitacao" name="quantidade_solicitacao" class="swal2-input" placeholder="Quantidade solicitada" style="width: 80%; margin-left:0 !important;">
      </div>
      <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
        <label for="unidade_solicitacao">Unidade de Venda do Item</label>             
        <select style="margin-left:-0em !important;font-size:14px;width:80%" class="selectClass1" id="unidade_solicitacao">
          <option style="font-size:14px;" value="" disabled selected>UN</option>
          <option style="font-size:14px;" value="Bloco">Bloco</option>
          <option style="font-size:14px;" value="Bobina">Bobina</option>
          <option style="font-size:14px;" value="Caixa">Caixa</option>
          <option style="font-size:14px;" value="Chapa">Chapa</option>
          <option style="font-size:14px;" value="Conjunto">Conjunto</option>
          <option style="font-size:14px;" value="Folha">Folha</option>
          <option style="font-size:14px;" value="Frasco">Frasco</option>
          <option style="font-size:14px;" value="Galão">Galão</option>
          <option style="font-size:14px;" value="Kilograma">Kilograma (Kg)</option>
          <option style="font-size:14px;" value="Lata">Lata</option>
          <option style="font-size:14px;" value="Litro">Litro (l)</option>
          <option style="font-size:14px;" value="Metro">Metro (m)</option>
          <option style="font-size:14px;" value="Metro²">Metro² (m²)</option>
          <option style="font-size:14px;" value="Pacote">Pacote</option>
          <option style="font-size:14px;" value="Par">Par</option>
          <option style="font-size:14px;" value="Peça">Peça</option>
          <option style="font-size:14px;" value="Pote">Pote</option>
          <option style="font-size:14px;" value="Rolo">Rolo</option>
          <option style="font-size:14px;" value="Saco">Saco</option>
          <option style="font-size:14px;" value="Unidade">Unidade</option>
          <option style="font-size:14px;" value="Outro">Outro... (complementar na descrição)</option>
        </select>
      </div>
        <div class="fundinSol" style="width:90% !important; ">
          <div class="row text-start" style="margin-top:0.9em;">
            <label for="motivo_solicitacao" style="margin-left:1.25em !important;">Justificativa</label>
            <input type="text" id="motivo_solicitacao" name="motivo_solicitacao" class="swal2-input" placeholder="Justificativa da Solicitação"></input>
          </div>
          <div class="row text-start" style="margin-top:0.9em;">
            <label for="areaUso" style="margin-left:1.25em !important;margin-bottom:-0.3em">Área de Uso</label>
            <select class="selectClass1" id="areaUso">
              <option style="font-size:14px;" value="" disabled selected>Área de Uso</option>
              <option style="font-size:14px;" value="Administração">Administração</option>
              <option style="font-size:14px;" value="Ajustagem">Ajustagem</option>
              <option style="font-size:14px;" value="AutoClave">AutoClave</option>
              <option style="font-size:14px;" value="Colmeia">Colmeia</option>
              <option style="font-size:14px;" value="Engenharia">Engenharia</option>
              <option style="font-size:14px;" value="Ferramental">Ferramental</option>
              <option style="font-size:14px;" value="Manutenção">Manutenção</option>
              <option style="font-size:14px;" value="MC Ajustagem">MC Ajustagem</option>
              <option style="font-size:14px;" value="MC Laminação">MC Laminação</option>
              <option style="font-size:14px;" value="Pintura">Pintura</option>
              <option style="font-size:14px;" value="Polimento Acrílico">Polimento Acrílico</option>
              <option style="font-size:14px;" value="Polimento Metálico">Polimento Metálico</option>
              <option style="font-size:14px;" value="Produto Próprio">Produto Próprio</option>
              <option style="font-size:14px;" value="Qualidade">Qualidade</option>
              <option style="font-size:14px;" value="Sala Branca">Sala Branca</option>
              <option style="font-size:14px;" value="Termoformado">Termoformado</option>
              <option style="font-size:14px;" value="Outro">Outro... (complementar na descrição)</option>
            </select>
        </div>
        <div class="row text-start" style="margin-top:0.9em;">
          <label for="prioridade" style="margin-left:1.25em !important;margin-bottom:-0.3em">Prioridade </label>
          <select class="selectClass1" id="prioridade">
            <option style="font-size:14px;" value="" disabled selected>Prioridade</option>
            <option style="font-size:14px;" value="Alta">Alta</option>
            <option style="font-size:14px;" value="Média">Média</option>
            <option style="font-size:14px;" value="Crítico">Crítico</option>
            <option style="font-size:14px;" value="Baixa">Baixa</option>
          </select>
        </div>
    </div>
  </div>
  <p class="text-end" style="padding-right:3em;padding-top:0.5em; font-size:16px">Add Itens :  <a style="margin-top:2em !important;" id="addItem" class="text-end"><i class="fa-solid fa-plus"></i></a></p>
  <p class="text-center" style="font-size:14px;"><strong> Em caso de mais de um item, clicar em 'Add Item' antes de Enviar a Solicitação</strong></p>
  
  `
      Swal.fire({
        allowOutsideClick: false,
        width: "50em",
        title: 'Solicitação de Compra',
        html: html,
        confirmButtonText: 'Enviar Solicitação',
        confirmButtonColor: '#007bff',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
        const nomeItem = Swal.getPopup().querySelector('#item_solicitacao').value;
        const descricao = Swal.getPopup().querySelector('#descricao_solicitacao').value;
        const categoria = Swal.getPopup().querySelector('#categoria').value;
        const classificacao = Swal.getPopup().querySelector('#classificacao').value;
        const quantidade = Swal.getPopup().querySelector('#quantidade_solicitacao').value;
        const unidade = Swal.getPopup().querySelector('#unidade_solicitacao').value;
        const motivo = Swal.getPopup().querySelector('#motivo_solicitacao').value;
        const setor = Swal.getPopup().querySelector('#areaUso').value;
        const prioridade = Swal.getPopup().querySelector('#prioridade').value;
        if (!motivo || !setor || !prioridade ) {
            Swal.showValidationMessage(`Preencha os campos para Enviar a Solicitação`)
        }
        return { 
          nome: nomeItem,
          descricao: descricao, 
          categoria: categoria,
          classificacao: classificacao,
          quantidade: quantidade, 
          unidade: unidade,
          motivo: motivo, 
          setor: setor,
          prioridade: prioridade,
        }
    }
    }).then((result2) => {
        if (!result2.value){
            Swal.fire({
              title:"Solicitação de compra cancelada.",
              showConfirmButton: true,
              timer: 2000,
              confirmButtonText: 'OK',
              confirmButtonColor:'hwb(216 31% 1%)',
            })
        }else{
            var data = new Date();
            var dia = String(data.getDate()).padStart(2, '0');
            var mes = String(data.getMonth() + 1).padStart(2, '0');
            var ano = data.getFullYear();
            dataAtual = dia + '/' + mes + '/' + ano;
            const nomeItem = result2.value.nome;
            const descricao = result2.value.descricao;
            const categoria = result2.value.categoria;
            const classificacao = result2.value.classificacao;
            const quantidade = result2.value.quantidade;
            const unidade = result2.value.unidade;
            const motivo = result2.value.motivo;
            const setor = result2.value.setor;
            const prioridade = result2.value.prioridade;
            var qnt_itens = itens.length
            if (itens.length == 0){
              qnt_itens = qnt_itens + 1
              itens.push(nomeItem);
              itens.push(descricao);
              itens.push(categoria);
              itens.push(classificacao);
              itens.push(quantidade);
              itens.push(unidade);
              const dict_values ={dataAtual, itens, motivo, setor, prioridade, qnt_itens};
              console.log("Dados1: ",dict_values);
              const s = JSON.stringify(dict_values);
              $.ajax({
                url:"/comprasInserir",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(s)
            }).done((response) => {
              if (response.value == true){
                Swal.fire({
                  confirmButtonColor:'hwb(216 31% 1%)',
                  titleText: "Solicitação de compra enviada!!",
                  icon: "success"
                }
                )} else{
                  Swal.fire("Ocorreu algum erro!")
                }
              })
            }else{
              const dict_values = {dataAtual, itens, motivo, setor, prioridade, qnt_itens};
              console.log("Dados2: ",dict_values);
              const s = JSON.stringify(dict_values);
              $.ajax({
                url:"/comprasInserir",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(s)
            }).done((response) => {
              if (response.value == true){
                Swal.fire({
                  confirmButtonColor:'hwb(216 31% 1%)',
                  titleText: "Solicitação de compra enviada!!",
                  icon: "success"
                }
              )} else{
                Swal.fire("Ocorreu algum erro!")
              }
            })
          }
        }
            
            
      });
    $('#addItem').click(function () {
      const nomeItem = Swal.getPopup().querySelector('#item_solicitacao').value;
      const descricao = Swal.getPopup().querySelector('#descricao_solicitacao').value;
      const categoria = Swal.getPopup().querySelector('#categoria').value;
      const classificacao = Swal.getPopup().querySelector('#classificacao').value;
      const quantidade = Swal.getPopup().querySelector('#quantidade_solicitacao').value;
      const unidade = Swal.getPopup().querySelector('#unidade_solicitacao').value;
      if (!nomeItem || !descricao || !categoria || !classificacao || !quantidade || !unidade ) {
        Swal.showValidationMessage(`Preencha os campos para Adicionar um novo Item`)
    }else{
      const dictDadosItem = {
        nomeItem: nomeItem,
        descricao: descricao,
        categoria: categoria,
        classificacao: classificacao,
        quantidade: quantidade,
        unidade: unidade,
      };
      itens.push(dictDadosItem);
      Swal.getPopup().querySelector("#item_solicitacao").value = "";
      Swal.getPopup().querySelector("#descricao_solicitacao").value = "";
      Swal.getPopup().querySelector("#categoria").value = "";
      Swal.getPopup().querySelector("#classificacao").value = "";
      Swal.getPopup().querySelector("#quantidade_solicitacao").value = "";
      Swal.getPopup().querySelector("#unidade_solicitacao").value = "";
      if (itens.length==1){
        document.getElementById("itens").style.background = "rgba(192, 192, 192, 0.75)";
        htmlNovo = `
        <div class="row">
          <div class="col h4 itensNovos" id="titleItens">Itens Adicionados:</div>    
        </div>
        <div class="row">
          <div class="col itensNovos">${itens.length}- ${nomeItem}</div>    
        </div>`;
      }else{
        htmlNovo = `
      <div class="row">
        <div class="col itensNovos">${itens.length}- ${nomeItem}</div>    
      </div>`;
      }
      document.getElementById("itens").insertAdjacentHTML("beforeend", htmlNovo);
    }
    });
  }
  });
};
       
function paginaAprovador(){
  Swal.fire({
    width: '85%',
    showConfirmButton: false,
    title: 'Compras à serem aprovadas',
    titleText: 'Solicitações de Compra Aguardando Aprovação',
    padding: '2em 1em 1.25em',
    allowOutsideClick: false,
    showCloseButton: true,
    html: `
    <div class="row">
        <div class="col-1"></div>
        <div class="col" id="subTitle-comprasPendente">Selecione uma, ou mais, Solicitação para aprovar ou rejeitar.</div>
        <div class="col-1"></div>
    </div>
    <table class="table table-striped display" id="dataTable4" style="width:100%; background-color: rgb(255, 255, 255); border-radius: 10px;">
    <thead>
      <tr>
        <th scope="col">Data da Solicitação</th>
        <th scope="col">Usuário</th>
        <th scope="col">Itens</th>
        <th scope="col">Qnt. Itens</th>
        <th scope="col">Justificativa</th>
        <th scope="col">Setor</th>
      </tr>
    </thead>    
  </table>
  <div class="row">
    <div class="col-sm text-end"><button class="btn btn-outline-secondary" type="submit" id="button-aprovar">Aprovar</button></div>
    <div class="col-sm text-start"><button class="btn btn-outline-secondary" type="submit" id="button-rejeitar">Rejeitar</button></div>
  </div>
  <div class="row">
    <div class="col-sm text-end"><button class="btn btn-outline-secondary" type="submit" id="button-info">Mais Informações</button></div>
  </div>
  <div class="col text-center" style="color: rgb(255, 0, 0); font-size: 14px;font-weight: bold; padding-top: 20px;">Qualquer problema Acione o Processo pelo menu.</div>`,
  });
  $(document).ready(function () {
    var tableAprovador = $('#dataTable4').DataTable({
      select: true,
      selectionMode:"single",
      "processing" : true,
      "serverSide" : false,
      "serverMethod" : "post",
      "ajax" :{
      'url' : '/comprasPendentesAprovacao'
      },
      "aLengthMenu" : [[5, 10, 20, -1], [5, 10, 20, "Todos"]],
      "pageLength": 5,
      "paging": true,
      "responsive" : true,
      searching : false,
      sort: true,
      'columns': [
      { data : 'data', "width": "15%"},
      { data : 'solicitante', "width": "15%"}, 
      { data : 'itens', "width": "15%"}, 
      { data : 'qnt_itens', "width": "15%"}, 
      { data : 'motivo', "width": "25%"},
      { data : 'setor', "width": "15%"},
      ],
      columnDefs: [
      { className: 'dt-center', targets: '_all' },
      {targets: 2, render: function ( data, type, row ) {
        return data.length > 25 ?
            data.substr( 0, 25 ) +'…' :
            data;
    }},
    {targets:1, render:function(data){
      return data.charAt(0).toUpperCase() + data.slice(1)
    }}
      ],
      "language": {
      "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
      },
  });
  $('#button-aprovar').click(function() {
    var dadosSolicitacao = tableAprovador.rows('.selected').data(); // Adicionar 1 ao status
    dadosSolicitacao = dadosSolicitacao[0];
    if (!dadosSolicitacao){
      Swal.fire({
        titleText: "Selecione algum item para Aprovar",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor:'hwb(216 31% 1%)', 
      })};
      const s = JSON.stringify(dadosSolicitacao);
      $.ajax({
        url:"/comprasAprovar", // Envia status = 1 na tabela solicitacao
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(s)
      }).done((response) => {
        if(response.value==true){
          Swal.fire({
            titleText: "Solicitação de Compra Aprovada",
            text: "O processo de cotação já pode ser iniciado.",
            icon: "success",
            showConfirmButton: true,
            confirmButtonColor:'hwb(216 31% 1%)', 
          });
        };
    });
  });
  $('#button-rejeitar').click(function () {
    var dadosSolicitacao = tableAprovador.rows('.selected').data(); // Adicionar 2 ao status
    dadosSolicitacao = dadosSolicitacao[0];
    if (!dadosSolicitacao){
      Swal.fire({
        titleText: "Selecione algum item para Rejeitar",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor:'hwb(216 31% 1%)',
      })}else{
        Swal.fire({
          titleText: "Deseja Rejeitar a Solicitação?",
          showCancelButton: true,
          icon: "question",
          focusConfirmButton: false,
          allowOutsideClick: false,
          confirmButtonText: "Sim",
          confirmButtonColor:'hwb(216 31% 1%)',
          cancelButtonText: "Não",
        }).then((result) => {
          if (result.value==true){
            const id_reprovar = JSON.stringify(dadosSolicitacao['id_solicitacao']);
            $.ajax({
              url:"/rejeitarCompras", // Envia status = 2 na tabela solicitacao
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(id_reprovar)
            }).done((response) => {
              if(response.value==true){
                Swal.fire({
                  titleText: "Solicitação de Compra Rejeitada",
                  icon: "info",
                  showConfirmButton: true,
                  confirmButtonColor:'hwb(216 31% 1%)', 
                });
              };
            });
          }else{
            Swal.fire({
              titleText: "Solicitação Não Rejeitada",
              icon: "warning",
              showConfirmButton: true,
              confirmButtonColor:'hwb(216 31% 1%)', 
              confirmButtonText:"Ok",
            });
          }
        });
      }
    });

  $('#button-info').click(function () {
    var dadosSolicitacao = tableAprovador.rows('.selected').data(); // Adicionar 2 ao status
    dadosSolicitacao = dadosSolicitacao[0];
    if (!dadosSolicitacao){
      Swal.fire({
        titleText: "Para mais informações, selecione um item",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor:'hwb(216 31% 1%)',
      })}else{
      const s = JSON.stringify(dadosSolicitacao);
        $.ajax({
          url:"/itensMaisInfo",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(s)
        }).done((jade) => {
          var html1 = `
                    <div class="pageInfoContainer" style="margin-top:0 !important;">
                      <div class="row">
                        <div class="col-4 fundinSol text-start"> 
                          <div class="row pageInfo-linhas">
                            <b>Solicitante: <font color="#560101">${dadosSolicitacao.solicitante.charAt(0).toUpperCase() + dadosSolicitacao.solicitante.slice(1)}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Data da Solicitação: <font color="#560101">${dadosSolicitacao.data}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Justificativa: <font color="#560101">${dadosSolicitacao.motivo}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Setor: <font color="#560101">${dadosSolicitacao.setor}</font></b>
                          </div>
                        </div>
                        <div class="col-8"> 
                        <label for="carouselExample" style="margin-left:1px" id="info-qntItens">Quantidade de Itens Solicitados: ${jade.length}</label>
                        <div id="carouselExample" class="carousel slide fundinItens">
                          <div class="carousel-inner text-center">
                            <div class="carousel-item active">
                              <div class="row pageInfo-linhas">
                                  <b>Item: <font color="#560101">${jade[0][2]}</font></b>
                              </div>
                              <div class="row pageInfo-linhas">
                                  <b>Descricao: <font color="#560101">${jade[0][3]}</font></b>
                              </div>
                              <div class="row pageInfo-linhas">
                                  <b>Categoria: <font color="#560101">${jade[0][4]}</font></b>
                              </div>
                              <div class="row pageInfo-linhas">
                                  <b>Classificação: <font color="#560101">${jade[0][5]}</font></b>
                              </div>
                              <div class="row pageInfo-linhas">
                                <b>Quantidade: <font color="#560101">${jade[0][6]}</font></b>
                              </div>
                              <div class="row pageInfo-linhas">
                                  <b>Unidade: <font color="#560101">${jade[0][7]}</font></b>
                              </div>
                            </div>
                            `
          var html2 = `
                          <button class="carousel-control-prev" type="button" id="btn-slide" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next" type="button" id="btn-slide" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                          </button>

                    `
          var html3 = `
                    </div>
                      </div>
                    </div>
                    <div class="row" style="margin-bottom:1.5em;">
                      <div class="col-sm text-end"><button class="btn btn-outline-secondary" type="submit" id="button-aprovar2">Aprovar</button></div>
                      <div class="col-sm text-start"><button class="btn btn-outline-secondary" type="submit" id="button-rejeitar2">Rejeitar</button></div>
                    </div>
            `
          if (jade.length == 1){
            var html = html1 + `</div>` + html3
          } else{
            var html = html1
            for (i in jade){
              if (i==0){
              }else{
              html += `<div class="carousel-item">
                          <div class="row pageInfo-linhas">
                            <b>Item: <font color="#560101">${jade[i][2]}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Descricao: <font color="#560101">${jade[i][3]}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Categoria: <font color="#560101">${jade[i][4]}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Classificação: <font color="#560101">${jade[i][5]}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Quantidade: <font color="#560101">${jade[i][6]}</font></b>
                          </div>
                          <div class="row pageInfo-linhas">
                            <b>Unidade: <font color="#560101">${jade[i][7]}</font></b>
                          </div>
                        </div>`
            }
          }
            html += html2 + html3
          }
          Swal.fire({
            title: "Informações da Solicitações",
            width:'65em',
            allowOutsideClick: false,
            showCloseButton: true,
            padding: 0 ,
            showConfirmButton: false,
            confirmButtonColor:'hwb(216 31% 1%)', 
            html:html,
          });

          $('#button-aprovar2').click(function () {
            const s = JSON.stringify(dadosSolicitacao);
            $.ajax({
              url:"/comprasAprovar", // Envia status = 1 na tabela solicitacao
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(s)
            }).done((response) => {
              if(response.value==true){
                Swal.fire({
                  titleText: "Solicitação de Compra Aprovada",
                  text: "O processo de cotação já pode ser iniciado.",
                  icon: "success",
                  showConfirmButton: true,
                  confirmButtonColor:'hwb(216 31% 1%)', 
                });
              };
          });
          });
          $('#button-rejeitar2').click(function () {
            Swal.fire({
              titleText: "Deseja Rejeitar a Solicitação?",
              showCancelButton: true,
              icon: "question",
              focusConfirmButton: false,
              allowOutsideClick: false,
              confirmButtonText: "Sim",
              confirmButtonColor:'hwb(216 31% 1%)',
              cancelButtonText: "Não",
            }).then((result) => {
              if (result.value==true){
                const id_reprovar = JSON.stringify(dadosSolicitacao['id_solicitacao']);
                $.ajax({
                  url:"/rejeitarCompras", // Envia status = 2 na tabela solicitacao
                  type: "POST",
                  contentType: "application/json",
                  data: JSON.stringify(id_reprovar)
                }).done((response) => {
                  if(response.value==true){
                    Swal.fire({
                      titleText: "Solicitação de Compra Rejeitada",
                      icon: "info",
                      showConfirmButton: true,
                      confirmButtonColor:'hwb(216 31% 1%)', 
                    });
                  };
                });
              }else{
                Swal.fire({
                  titleText: "Solicitação Não Rejeitada",
                  icon: "warning",
                  showConfirmButton: true,
                  confirmButtonColor:'hwb(216 31% 1%)', 
                  confirmButtonText:"Ok",
                
              });
              }
            });
          });
      });
    }

  
  });
}
)};

function confereComprasPendentes(){
  $.ajax({
    url:"/comprasPendentes",
    type: "POST",
    contentType: "application/json",
  }).done((response) => {
    if (response.value==false){
      Swal.fire({
        titleText:"Nenhuma Solicitação de Compra foi aprovada para Cotação",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonColor:'hwb(216 31% 1%)',
      });
    }else{
      loginComprador();
    }
  });
};

function loginComprador(){
    Swal.fire({
      width: '85%',
      showConfirmButton: false,
      title: 'Solicitações de Compras Pendentes',
      titleText: 'Compras Pendentes', 
      padding: '2em 1em 1.25em',
      allowOutsideClick: false,
      showCloseButton: true,
      html: `
      <div class="row">
        <div class="col-1"></div>
        <div class="col" id="subTitle-comprasPendente">Selecione alguma Solicitação de Compra abaixo para iniciar uma Nova Cotação, ou ver as que existem.</div>
        <div class="col-1"></div>
      </div>
      <table class="table table-striped display" id="dataTable4" style="width:100%; background-color: rgb(255, 255, 255); border-radius: 10px;">
      <thead>
        <tr>
          <th scope="col">Data da Solicitação</th>
          <th scope="col">Usuário</th>
          <th scope="col">Justificativa</th>
          <th scope="col">Setor</th>
          <th scope="col">Cotações</th>
        </tr>
      </thead>    
    </table>
    <div class="row">
      <div class="col-sm text-end"><button class="btn btn-outline-secondary" type="submit" id="button-novaCotacao">Nova Cotação</button></div>
      <div class="col-sm text-start"><button class="btn btn-outline-secondary" type="submit" id="button-cotacao">Cotações</button></div>
    </div>
    <div class="col text-center" style="color: rgb(255, 0, 0); font-size: 14px;font-weight: bold; padding-top: 20px;">Qualquer problema Acione o Processo pelo menu.</div>`,
    });
    $(document).ready(function () {
      var table = $('#dataTable4').DataTable({
        select: true,
        "processing" : true,
        "serverSide" : false,
        "serverMethod" : "post",
        "ajax" :{
          'url' : '/comprasPendentes'
        },
        "aLengthMenu" : [[5, 10, 20, -1], [5, 10, 20, "Todos"]],
        "pageLength": 5,
        "paging": true,
        "responsive" : true,
        searching : true,
        sort: true,
        'columns': [
        { data : 'data', "width": "10%"},
        { data : 'solicitante', "width": "12.5%"}, 
        { data : 'motivo', "width": "15.625%"},
        { data : 'setor', "width": "12.5%"},
        { data : 'qnt_cotacao', "width": "8%"},
        ],
        columnDefs: [
        { className: 'dt-center', targets: '_all' },
        ],
        "language": {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
        },
    });
    
    $('#button-novaCotacao').click(function () {
        var data_Solicitacao = table.rows('.selected').data(); // Recebe os valores da linha selecionada
        data_Solicitacao = data_Solicitacao[0]
        if (!data_Solicitacao){
          Swal.fire({icon:"error", titleText:"Selecione Alguma Compra", confirmButtonColor:'hwb(216 31% 1%)',})
        }else{
          novaCotacao(data_Solicitacao); 
        }
    });

    $('#button-cotacao').click(function () {
      var data = table.rows('.selected').data();// Recebe os valores da linha selecionada
      data = data[0]
      console.log(data)
      if (!data){
        Swal.fire({icon:"error", titleText:"Selecione Alguma Compra", confirmButtonColor:'hwb(216 31% 1%)',})
      };
      if (data.qnt_cotacao==0){
        Swal.fire({icon:"info", titleText:"Solicitação ainda sem Cotação", confirmButtonColor:'hwb(216 31% 1%)',})
      }else{
        if(Number(JSON.stringify(data.qnt_cotacao).replace('"', '').replace('"', ''))==1){
          var title = `${JSON.stringify(data.qnt_cotacao).replace('"', '').replace('"', '')} Cotação Válida`
        } else{
          var title = `${JSON.stringify(data.qnt_cotacao).replace('"', '').replace('"', '')} Cotações Válidas`
        }
        const s = JSON.stringify(data);
        $.ajax({
          url:"/cotacaoInformacoes",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(s)
        }).done((response) => {
          if (response.length){
            var html = ``
            for (var i in response){
              var width = '70em';
              var html_ = `
              <div class="card text-start" style="width: 19rem; margin-left:auto; margin-right:auto; font-size:15px;">
                <div class="card-body">
                  <h5 class="card-title"><b>Fornecedor:</b> ${response[i].fornecedor}</h5>
                  <p class="card-text"><b>Contato:</b> ${response[i].contato_fornecedor}</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><b>Valor Unitário:</b> ${response[i].valor_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
                  <li class="list-group-item"><b>Unidade:</b> ${response[i].unidade}</li>
                  <li class="list-group-item"><b>Frete:</b> ${response[i].frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
                  <li class="list-group-item"><b>Informações Extras:</b> ${response[i].inf_extra}</li>
                  <li class="list-group-item"><b>Validade Cotação:</b> ${response[i].validade_cotacao}</li>
                </ul>
                <div class="card-body text-end">
                  <a onClick="editarCotacao(${response[i].id_cotacao})" class="card-link"><i class="fa-solid fa-pen-to-square"></i></a>
                  <a onClick="apagarCotacao(${response[i].id_cotacao})" class="card-link"><i class="fa-sharp fa-solid fa-trash"></i></a>
                </div>
              </div>`;
            html = html + html_;
            var numero_cotacao = response[response.length-1].id_cotacao
            }
          } else{
            var width = '30em';
            var html = `
              <div class="card text-start" style="width: 19rem; margin-left:auto; margin-right:auto; font-size:15px;">
              <div class="card-body">
                <h5 class="card-title"><b>Fornecedor:</b> ${response.fornecedor}</h5>
                <p class="card-text"><b>Contato:</b> ${response.contato_fornecedor}<p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><b>Valor Unitário:</b> ${response.valor_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
                <li class="list-group-item"><b>Unidade:</b> ${response.unidade}</li>
                <li class="list-group-item"><b>Frete:</b> ${response.frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
                <li class="list-group-item"><b>Informações Extras:</b> ${response.inf_extra}</li>
                <li class="list-group-item"><b>Validade Cotação:</b> ${response.validade_cotacao}</li>
              </ul>
              <div class="card-body text-end">
                <a onClick="editarCotacao(${response.id_cotacao})" id="editarCotacao" class="card-link"><i class="fa-solid fa-pen-to-square"></i></a>
                <a onClick="apagarCotacao(${response.id_cotacao})" id="apagarCotacao" class="card-link"><i class="fa-sharp fa-solid fa-trash"></i></a>
              </div>
            </div>`
            var numero_cotacao = response.id_cotacao
          }
          var botoes = `
            <div class="row">
              <div class="col-sm text-start"></div>
              <div class="col-sm text-center"><button class="btn btn-outline-secondary botoes-popup" type="submit" id="button-novaCotacao2">Nova Cotação</button></div>
              <div class="col-sm text-start"></div>
            </div>
            <div class="col text-center" style="color: rgb(255, 0, 0); font-size: 14px;font-weight: bold; padding-top: 20px;">Qualquer problema Acione o Processo pelo menu.</div>`
          Swal.fire({
          title: title,
          width: width,
          allowOutsideClick: false,
          showCloseButton: true,
          showConfirmButton: false,
          confirmButtonText: 'Finalizar Cotação',
          confirmButtonColor: '#007bff',
          showCancelButton: false,
          cancelButtonText: 'Sair',
          padding: '1em 1em 1.25em',
          html: `<div class="row text-center">`+html+`</div>`+botoes
        });
      
      $('#button-novaCotacao2').click(function () {
        console.log("TESTE: ", data)
        Swal.fire({
          // titleText: text,
          title: `${JSON.stringify(data.qnt_cotacao+1).replace('"', '').replace('"', '')}ª Cotação Válida`,
          width: '70em',
          confirmButtonText: 'Enviar Cotação',
          allowOutsideClick: false,
          showCloseButton: true,
          confirmButtonColor: '#007bff',
          padding: '1em 1em 1.25em',
          html: `
          <div class="row" style="margin: 0 !important; padding-top:1.25em !important;">
      <div class="h2" style="margin-left:1em">
        <div class="row" style="line-height: 1.5em;">
          <div class=" h5 col-sm-4 text-center"><b>Resumo da Solicitação</b></div>
          <div class=" h5 col-sm text-center"><b>Informações da Cotação</b></div>
        </div>
      </div>
      <div class="col-4 container-fluid2 text-start" style="width:35em !important;line-height: 3em;font-size: 14px;">
          <b>Solicitante:</b> <font color="#560101">${JSON.stringify(data.solicitante).replace('"', '').replace('"', '').charAt(0).toUpperCase() + JSON.stringify(data.solicitante).replace('"', '').replace('"', '').slice(1)}</font> <br />
          <b>Data da Solicitação:</b> <font color="#560101">${data.data}</font><br />
          <b>Item Solicitado:</b> <font color="#560101">OOOOI</font><br />
          <b>Setor:</b> <font color="#560101">${data.setor}</font><br />
          <b>Justificativa:</b> <font color="#560101">${data.motivo}</font><br />
      </div>
      <div class="col">
          <div class="row text-center" style="margin-left:2em;font-size:15px; margin-top:2em;">
              <div class="col" style="width:110%">
                <div class="input-group mb-3">
                    <label for="fornecedor" style="padding: 0.75em 0;margin-right: 0.5em;">Fornecedor: </label>
                    <input type="text" id="fornecedor" name="fornecedor" class="form-control" placeholder="Fornecedor">
                </div>
                <div class="input-group mb-3">
                    <label for="contato_fornecedor" style="padding: 0.75em 0;margin-right: 0.5em;">Contato: </label>
                    <input type="text" id="contato_fornecedor" name="contato_fornecedor" class="form-control" placeholder="Contato">
                </div>
                <div class="input-group mb-3">
                    <label for="unidade" style="padding: 0.75em 0;margin-right: 0.5em;">Unidade Comercializada: </label>
                    <select class="form-select" style="font-size:15px" aria-label="UN" id="unidade">
                      <option style="font-size:14px;" value="" disabled selected>UN</option>
                      <option style="font-size:14px;">Bloco</option>
                      <option style="font-size:14px;">Bobina</option>
                      <option style="font-size:14px;">Caixa</option>
                      <option style="font-size:14px;">Chapa</option>
                      <option style="font-size:14px;">Conjunto</option>
                      <option style="font-size:14px;">Folha</option>
                      <option style="font-size:14px;">Frasco</option>
                      <option style="font-size:14px;">Galão</option>
                      <option style="font-size:14px;">Kilograma (Kg)</option>
                      <option style="font-size:14px;">Lata</option>
                      <option style="font-size:14px;">Litro (l)</option>
                      <option style="font-size:14px;">Metro (m)</option>
                      <option style="font-size:14px;">Metro² (m²)</option>
                      <option style="font-size:14px;">Pacote</option>
                      <option style="font-size:14px;">Par</option>
                      <option style="font-size:14px;">Peça</option>
                      <option style="font-size:14px;">Pote</option>
                      <option style="font-size:14px;">Rolo</option>
                      <option style="font-size:14px;">Saco</option>
                      <option style="font-size:14px;">Unidade</option>
                      <option style="font-size:14px;">Outro... (complementar na descrição)</option>
                    </select>
                </div>
                <div class="input-group mb-3">
                    <label for="valor_unitario" style="padding: 0.75em 0;margin-right: 0.5em;">Valor Unitário: </label>
                    <input type="number" id="valor_unitario" name="valor_unitario" class="form-control" placeholder="R$/UN">
                </div>
                <div class="input-group mb-3">
                    <label for="frete" style="padding: 0.75em 0;margin-right: 0.5em;">Valor Frete: </label>
                    <input type="number" id="frete" name="frete" class="form-control" placeholder="Frete">
                </div>
            </div>
            <div class="col" style="margin-left:3em;">
                <div class="input-group mb-3">
                    <label for="inf_extra" style="padding: 0.75em 0;margin-right: 0.5em;">Informações Extra: </label>
                    <textarea class="form-control" id="inf_extra" rows="3" placeholder="Informações Extra"></textarea>
                </div>
                <div class="input-group mb-3">
                    <label for="validade_cotacao" style="padding: 0.75em 0;margin-right: 0.5em;">Validade Cotação: </label>
                    <input type="date" id="validade_cotacao" class="form-control" placeholder="Validade Cotação">
                </div>
            </div>
        </div>
      </div>
  </div>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          focusConfirm: false,
          preConfirm: () => {
          const fornecedor = Swal.getPopup().querySelector('#fornecedor').value
          const unidade = Swal.getPopup().querySelector('#unidade').value
          const valor_unitario = Swal.getPopup().querySelector('#valor_unitario').value
          if (!fornecedor || !unidade || !valor_unitario) {
              Swal.showValidationMessage(`Preencha ao menos os campos: Fornecedor, Unidade Padrão e Valor Unitário`)
          }
          return { 
            id_solicitacao: data.id_solicitacao,
            solicitante: data.solicitante, 
            qnt_solicitada: data.quantidade,
            unidade: unidade,
            solicitante: data.solicitante,
            fornecedor: fornecedor,
            valor_unitario: valor_unitario.replace(',','.'),
            frete: Swal.getPopup().querySelector('#frete').value,
            inf_extra: Swal.getPopup().querySelector('#inf_extra').value,
            validade_cotacao: Swal.getPopup().querySelector('#validade_cotacao').value,
          }
      }
        }).then((result) => {
          // console.log(result)
          if (!result.value){
            Swal.fire({
              title:"Cotação Cancelada.",
              icon:"error",
              showConfirmButton: true,
              timer: 2000,
              confirmButtonText: 'OK',
              confirmButtonColor:'hwb(216 31% 1%)',
            })
        }else{
            const dict_values = result.value;
            const s = JSON.stringify(dict_values);
            $.ajax({
                url:"/cotacaoInserir", /// ARRUMAR A PARTIR DAQUI!!
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(s)
            }).done((response) => {
              if (response.value == true){Swal.fire({icon: 'success', title:"Cotação Enviada com Sucesso!",confirmButtonColor:'hwb(216 31% 1%)',})} 
                else{Swal.fire({icon:"error", titleText:"Ocorreu algum erro!"})}
              })
              }
        });
    });
  })}
    })});
};
  
function apagarCotacao(id){
  Swal.fire({
    title:"Deseja mesmo apagar?",
    showConfirmButton: true,
    confirmButtonColor: '#007bff',
    icon:"question",
    allowOutsideClick: false,
    confirmButtonText: "Sim",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
  }).then(response => {
    if (response.value == true){
      const dict_values = {'id': id};
      const s = JSON.stringify(dict_values);
      $.ajax({
        url:"/cotacaoApagar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(s)
      }).done((apagou) => {
        if (apagou.value==true){
          Swal.fire({
            titleText:"Cotação Apagada",
            showConfirmButton: true,
            confirmButtonColor: '#007bff',
            icon:"info",
          })
        };
      });
    };
  })
};

function editarCotacao(id){
  Swal.fire({
    title:"Editar Cotação?",
    showConfirmButton: true,
    confirmButtonColor: '#007bff',
    icon:"question",
    confirmButtonText: "Sim",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
  }).then(response => {
    if (response.value == true){
      const dict_values = {'id_cotacao': id};
      const s = JSON.stringify(dict_values);
      $.ajax({
        url:"/dadosCotacao",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(s)
      }).done((dadosCotacao)=> {
        console.log(dadosCotacao);
        Swal.fire({
          title: `Modificação da Cotação`,
          width: '70em',
          confirmButtonText: 'Enviar Cotação',
          confirmButtonColor: '#007bff',
          padding: '1em 1em 1.25em',
          html: `
          <div class="row" style="margin: 0 !important; padding-top:1.25em !important;">
            <div class="h2" style="margin-left:1em">
              <div class="row" style="line-height: 1.5em;">
                <div class=" h5 col-sm-4 text-center"><b>Resumo da Cotação</b></div>
                <div class=" h5 col-sm text-center"><b>Alterações</b></div>
              </div>
            </div>
            <div class="col-4 container-fluid2 text-start" style="width:35em !important;line-height: 3em;font-size: 14px;">
                <b>Fornecedor:</b> <font color="#560101">${dadosCotacao.fornecedor.charAt(0).toUpperCase() + dadosCotacao.fornecedor.slice(1)}</font> <br />
                <b>Contato:</b> <font color="#560101">${dadosCotacao.contato_fornecedor}</font><br />
                <b>Unidade Comercializada:</b> <font color="#560101">${dadosCotacao.unidade}</font><br />
                <b>Valor Unitário:</b> <font color="#560101">${dadosCotacao.valor_unitario}</font><br />
                <b>Valor Frete:</b> <font color="#560101">${dadosCotacao.frete}</font><br />
                <b>Informações Extra:</b> <font color="#560101">${dadosCotacao.inf_extra}</font><br />
                <b>Validade Cotação:</b> <font color="#560101">${dadosCotacao.validade_cotacao}</font><br />
            </div>
            <div class="col">
                <div class="row text-center" style="margin-left:2em;font-size:15px; margin-top:2em;">
                    <div class="col" style="width:110%">
                      <div class="input-group mb-3">
                          <label for="fornecedor" style="padding: 0.75em 0;margin-right: 0.5em;">Fornecedor: </label>
                          <input type="text" id="fornecedor" name="fornecedor" class="form-control" placeholder="Fornecedor">
                      </div>
                      <div class="input-group mb-3">
                          <label for="contato_fornecedor" style="padding: 0.75em 0;margin-right: 0.5em;">Contato: </label>
                          <input type="text" id="contato_fornecedor" name="contato_fornecedor" class="form-control" placeholder="Contato">
                      </div>
                      <div class="input-group mb-3">
                          <label for="unidade" style="padding: 0.75em 0;margin-right: 0.5em;">Unidade Comercializada: </label>
                          <select class="form-select" style="font-size:15px" aria-label="UN" id="unidade">
                            <option style="font-size:14px;" value="" disabled selected>UN</option>
                            <option style="font-size:14px;">Bloco</option>
                            <option style="font-size:14px;">Bobina</option>
                            <option style="font-size:14px;">Caixa</option>
                            <option style="font-size:14px;">Chapa</option>
                            <option style="font-size:14px;">Conjunto</option>
                            <option style="font-size:14px;">Folha</option>
                            <option style="font-size:14px;">Frasco</option>
                            <option style="font-size:14px;">Galão</option>
                            <option style="font-size:14px;">Kilograma (Kg)</option>
                            <option style="font-size:14px;">Lata</option>
                            <option style="font-size:14px;">Litro (l)</option>
                            <option style="font-size:14px;">Metro (m)</option>
                            <option style="font-size:14px;">Metro² (m²)</option>
                            <option style="font-size:14px;">Pacote</option>
                            <option style="font-size:14px;">Par</option>
                            <option style="font-size:14px;">Peça</option>
                            <option style="font-size:14px;">Pote</option>
                            <option style="font-size:14px;">Rolo</option>
                            <option style="font-size:14px;">Saco</option>
                            <option style="font-size:14px;">Unidade</option>
                            <option style="font-size:14px;">Outro... (complementar na descrição)</option>
                          </select>
                      </div>
                      <div class="input-group mb-3">
                          <label for="valor_unitario" style="padding: 0.75em 0;margin-right: 0.5em;">Valor Unitário: </label>
                          <input type="number" id="valor_unitario" name="valor_unitario" class="form-control" placeholder="R$/UN">
                      </div>
                      <div class="input-group mb-3">
                          <label for="frete" style="padding: 0.75em 0;margin-right: 0.5em;">Valor Frete: </label>
                          <input type="number" id="frete" name="frete" class="form-control" placeholder="Frete">
                      </div>
                  </div>
                  <div class="col" style="margin-left:3em;">
                      <div class="input-group mb-3">
                          <label for="inf_extra" style="padding: 0.75em 0;margin-right: 0.5em;">Informações Extra: </label>
                          <textarea class="form-control" id="inf_extra" rows="3" placeholder="Informações Extra"></textarea>
                      </div>
                      <div class="input-group mb-3">
                          <label for="validade_cotacao" style="padding: 0.75em 0;margin-right: 0.5em;">Validade Cotação: </label>
                          <input type="date" id="validade_cotacao" class="form-control" placeholder="Validade Cotação">
                      </div>
                  </div>
              </div>
            </div>
        </div>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          focusConfirm: false,
          preConfirm: () => {
            const fornecedor = Swal.getPopup().querySelector('#fornecedor').value
            const unidade = Swal.getPopup().querySelector('#unidade').value
            const valor_unitario = Swal.getPopup().querySelector('#valor_unitario').value
            if (!fornecedor || !unidade || !valor_unitario) {
                Swal.showValidationMessage(`Preencha ao menos os campos: Fornecedor, Unidade Padrão e Valor Unitário`)
            }
            return { 
              id_cotacao: dadosCotacao.id_cotacao,
              id_solicitacao: dadosCotacao.id_solicitacao,
              solicitante: dadosCotacao.solicitante, 
              qnt_solicitada: dadosCotacao.quantidade,
              unidade: unidade,
              fornecedor: fornecedor,
              valor_unitario: valor_unitario,
              frete: Swal.getPopup().querySelector('#frete').value,
              inf_extra: Swal.getPopup().querySelector('#inf_extra').value,
              validade_cotacao: Swal.getPopup().querySelector('#validade_cotacao').value,
            }
          }
        }).then((result) => {// AQUI ENTRA O UPDATE DA COTAÇÃO NO DB
          const dict_values = result.value;
          const s = JSON.stringify(dict_values);
          $.ajax({
            url:"/cotacaoUpdate", /// ARRUMAR A PARTIR DAQUI!!
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(s)
          }).done((response) => {
            if (response.value == true){Swal.fire({icon: 'success', title:"Cotação Enviada com Sucesso!"})} 
              else{Swal.fire({icon:"error", titleText:"Ocorreu algum erro!"})}
          });
        });
      });
    };
  });
};

function novaCotacao(data_Solicitacao){
  const s = JSON.stringify(data_Solicitacao);
  $.ajax({
    url:"/itensMaisInfo", /// ARRUMAR A PARTIR DAQUI!!
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(s)
  }).done((resposta) => {
    var itens = ""
    for (var i in resposta){
      console.log(resposta[i][1])
      itens += String(resposta[i][2])
      itens += ", "
    }
    itens = itens.substring(0, itens.length-2);
  
  Swal.fire({
    title: `${JSON.stringify(data_Solicitacao.qnt_cotacao+1).replace('"', '').replace('"', '')}ª Cotação Válida`,
    width: '70em',
    confirmButtonText: 'Enviar Cotação',
    confirmButtonColor: '#007bff',
    padding: '1em 1em 1.25em',
    html: `
    <div class="row" style="margin: 0 !important; padding-top:1.25em !important;">
      <div class="h2" style="margin-left:0.3  em">
        <div class="row" style="line-height: 1.5em;">
          <div class=" h5 col-sm-4 text-center"><b>Resumo da Solicitação</b></div>
          <div class=" h5 col-sm text-center"><b>Informações da Cotação</b></div>
        </div>
      </div>
      <div class="col-4 text-start" style="width:35em !important">
        <div class="row container-fluid2" style="line-height: 3em;font-size: 14px;height:25em !important;">
          <dl>
            <dd><b>Solicitante:</b> <font color="#560101">${JSON.stringify(data_Solicitacao.solicitante).replace('"', '').replace('"', '').charAt(0).toUpperCase() + JSON.stringify(data_Solicitacao.solicitante).replace('"', '').replace('"', '').slice(1)}</font></dd>
            <dd><b>Data da Solicitação:</b> <font color="#560101">${data_Solicitacao.data}</font></dd>
            <dd><b>Itens:</b> <font color="#560101">${itens}</font></dd>
            <dd><b>Setor:</b> <font color="#560101">${data_Solicitacao.setor}</font></dd>
            <dd><b>Justificativa:</b> <font color="#560101">${data_Solicitacao.motivo}</font></dd>
          </dl>
        </div>
      </div>
      <div class="col">
          <div class="row text-center" style="margin-left:2em;font-size:15px; margin-top:2em;">
              <div class="col" style="width:110%">
                <div class="input-group mb-3">
                    <label for="fornecedor" style="padding: 0.75em 0;margin-right: 0.5em;">Fornecedor: </label>
                    <input type="text" id="fornecedor" name="fornecedor" class="form-control" placeholder="Fornecedor">
                </div>
                <div class="input-group mb-3">
                    <label for="contato_fornecedor" style="padding: 0.75em 0;margin-right: 0.5em;">Contato: </label>
                    <input type="text" id="contato_fornecedor" name="contato_fornecedor" class="form-control" placeholder="Contato">
                </div>
                <div class="input-group mb-3">
                    <label for="unidade" style="padding: 0.75em 0;margin-right: 0.5em;">Unidade Comercializada: </label>
                    <select class="form-select" style="font-size:15px" aria-label="UN" id="unidade">
                    <option style="font-size:14px;" value="" disabled selected>UN</option>
                    <option style="font-size:14px;">Bloco</option>
                    <option style="font-size:14px;">Bobina</option>
                    <option style="font-size:14px;">Caixa</option>
                    <option style="font-size:14px;">Chapa</option>
                    <option style="font-size:14px;">Conjunto</option>
                    <option style="font-size:14px;">Folha</option>
                    <option style="font-size:14px;">Frasco</option>
                    <option style="font-size:14px;">Galão</option>
                    <option style="font-size:14px;">Kilograma (Kg)</option>
                    <option style="font-size:14px;">Lata</option>
                    <option style="font-size:14px;">Litro (l)</option>
                    <option style="font-size:14px;">Metro (m)</option>
                    <option style="font-size:14px;">Metro² (m²)</option>
                    <option style="font-size:14px;">Pacote</option>
                    <option style="font-size:14px;">Par</option>
                    <option style="font-size:14px;">Peça</option>
                    <option style="font-size:14px;">Pote</option>
                    <option style="font-size:14px;">Rolo</option>
                    <option style="font-size:14px;">Saco</option>
                    <option style="font-size:14px;">Unidade</option>
                    <option style="font-size:14px;">Outro... (complementar na descrição)</option>
                    </select>
                </div>
                <div class="input-group mb-3">
                    <label for="valor_unitario" style="padding: 0.75em 0;margin-right: 0.5em;">Valor Unitário: </label>
                    <input type="number" id="valor_unitario" name="valor_unitario" class="form-control" placeholder="R$/UN">
                </div>
                <div class="input-group mb-3">
                    <label for="frete" style="padding: 0.75em 0;margin-right: 0.5em;">Valor Frete: </label>
                    <input type="number" id="frete" name="frete" class="form-control" placeholder="Frete">
                </div>
            </div>
            <div class="col" style="margin-left:3em;">
                <div class="input-group mb-3">
                    <label for="inf_extra" style="padding: 0.75em 0;margin-right: 0.5em;">Informações Extra: </label>
                    <textarea class="form-control" id="inf_extra" rows="3" placeholder="Informações Extra"></textarea>
                </div>
                <div class="input-group mb-3">
                    <label for="validade_cotacao" style="padding: 0.75em 0;margin-right: 0.5em;">Validade Cotação: </label>
                    <input type="date" id="validade_cotacao" class="form-control" placeholder="Validade Cotação">
                </div>
                <div class="row">
                  <p class="text-end" style="padding-top:0.5em; font-size:14px">Adicionar Cotação:  <a style="margin-top:3em !important;" id="addCotacao" class="text-end"><i class="fa-solid fa-plus"></i></a></p>
                </div>
                <div class="tableCotacoes">
                  <table class="table" id="tableCotacoes">
                  </table>
                </div>
            </div>
        </div>
      </div>
  </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    preConfirm: () => {
    const fornecedor = Swal.getPopup().querySelector('#fornecedor').value
    const unidade = Swal.getPopup().querySelector('#unidade').value
    const valor_unitario = Swal.getPopup().querySelector('#valor_unitario').value
    if (!fornecedor || !unidade || !valor_unitario) {
        Swal.showValidationMessage(`Preencha ao menos os campos: Fornecedor, Unidade Padrão e Valor Unitário`)
    }
    return { 
      id_solicitacao: data_Solicitacao.id_solicitacao,
      solicitante: data_Solicitacao.solicitante, 
      qnt_solicitada: data_Solicitacao.quantidade,
      unidade: unidade,
      solicitante: data_Solicitacao.solicitante,
      fornecedor: fornecedor,
      valor_unitario: valor_unitario,
      contato_fornecedor: Swal.getPopup().querySelector("#contato_fornecedor").value,
      frete: Swal.getPopup().querySelector('#frete').value,
      inf_extra: Swal.getPopup().querySelector('#inf_extra').value,
      validade_cotacao: Swal.getPopup().querySelector('#validade_cotacao').value,
    }
}
  }).then((result) => {
    if (!result.value){
      Swal.fire({
        title:"Cotação Cancelada.",
        icon:"error",
        showConfirmButton: true,
        timer: 2000,
        confirmButtonText: 'OK',
        confirmButtonColor:'hwb(216 31% 1%)',
      })
  }else{
      const dict_values = result.value;
      const s = JSON.stringify(dict_values);
      $.ajax({
          url:"/cotacaoInserir", /// ARRUMAR A PARTIR DAQUI!!
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(s)
      }).done((response) => {
        if (response.value == true){Swal.fire({icon: 'success', title:"Cotação Enviada com Sucesso!"})} 
          else{Swal.fire({icon:"error", titleText:"Ocorreu algum erro!"})}
        })
      }
    });
    $('#addCotacao').click(function(){ //
      var table = document.getElementById("tableCotacoes");
      if (table.rows.length == 0){
        var htmlCotacoes1 = `
        <thead>
          <tr>
            <th scope="col">nº</th>
            <th scope="col">Item</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Levy</td>
          </tr>
        `
        document.getElementById("tableCotacoes").insertAdjacentHTML("beforeend", htmlCotacoes1);
      }else{
        var htmlCotacoes2 = ``
        htmlCotacoes2 += `
          <tr>
            <th scope="row">2</th>
            <td>Levy</td>
          </tr>
        </tbody>
      `
      document.getElementById("tableCotacoes").insertAdjacentHTML("beforeend", htmlCotacoes2);      
      }
    })
  });
};