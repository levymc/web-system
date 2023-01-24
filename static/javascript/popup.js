function newPopup(){
    Swal.fire({
        title: 'Contato Processo',
        html: `<div class="loginCompras">
            <input type="text" id="nome_contato" name="nome" class="swal2-input" placeholder="Nome">
            <input type="text" id="motivo_contato" name="motivo" class="swal2-input" placeholder="Motivo">
            <textarea id="descricao_contato" name="descricao_contato" cols="30" rows="500" style="resize:none; height:10em !important;" class="swal2-textarea"  maxlength="200" placeholder="Descrição"></textarea>
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
}

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
}

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
}

function solicitacaoCompra(){
  $.ajax({
    url:"/usuario",
    type: "POST",
    contentType: "application/json"
  }).done((jade) => {
    if (jade == false){
      console.log("Error");
    } else {
      var test = JSON.parse(jade)
      Swal.fire({
        allowOutsideClick: false,
        width: "50em",
        title: 'Solicitação de Compra',
        html: `
          <div class="row" style="margin-left:1em !important;">
            <div class="col">
              <div class="row">
                <h3 style="text-align: left; margin-left: 0.75em; margin-top: 4% ;">Usuário: <b>${test.usuario.charAt(0).toUpperCase() + test.usuario.slice(1)}</b></h3>
              </div>
              <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
                <label for="item_solicitacao">Nome do Item (forma genérica)</label>
                <input type="text" id="item_solicitacao" name="item_solicitacao" class="swal2-input" placeholder="  Nome do Item" style="width: 80%">
                </div>
              <div class="row text-start" style="margin-left:1em !important;; margin-top:0.9em;">
                <label for="descricao_solicitacao">Descrição  (especificações)</label>
                <textarea id="descricao_solicitacao" name="descricao_solicitacao" rows="20" cols="10" style="margin-left:-0em !important; resize:none; width: 80%;" class="swal2-textarea text-start"  maxlength="200" placeholder="Descrição da Solicitação"></textarea>
              </div>
            </div>
            <div class="col">
              <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
                <label for="quantidade_solicitacao">Quantidade</label>             
                <input type="number" id="quantidade_solicitacao" name="quantidade_solicitacao" class="swal2-input" placeholder="  Quantidade solicitada" style="width: 80%">
              </div>
              <div class="row text-start" style="margin-left:1em !important; margin-top:0.9em;">
                <label for="unidade_solicitacao">Unidade de Venda do Item</label>             
                <select style="margin-left:-0em !important;font-size:14px;width:80%" class="form-control" id="unidade_solicitacao">
                  <option style="font-size:14px;" value="" disabled selected>UN</option>
                  <option style="font-size:14px;">Caixa (complementar na descrição)</option>
                  <option style="font-size:14px;">Centímetro (cm)</option>
                  <option style="font-size:14px;">Centímetro Quadrado (cm²)</option>
                  <option style="font-size:14px;">Gramas (g)</option>
                  <option style="font-size:14px;">Kilos (kg)</option>
                  <option style="font-size:14px;">Litros (l)</option>
                  <option style="font-size:14px;">Metro (m)</option>
                  <option style="font-size:14px;">Metro Quadrado (m²)</option>
                  <option style="font-size:14px;">Mililítros (ml)</option>
                  <option style="font-size:14px;">Polegadas (")</option>
                  <option style="font-size:14px;">Unitário</option>
                  <option style="font-size:14px;">Outro... (complementar na descrição)</option>
                </select>
              </div>
              <div class="row text-start" style="margin-left:1em !important;margin-top:0.9em;">
                <label for="motivo_solicitacao">Justificativa</label>
                <input type="text" id="motivo_solicitacao" name="movito_solicitacao" style="margin-left:-0em !important; width: 80%" class="swal2-input" placeholder="  Justificativa da Solicitação"></input>
              </div>
              <div class="row text-start" style="margin-left:1em !important;margin-top:0.9em;">
                <label for="areaUso" style="margin-bottom:-0.3em">Área de Uso</label>
                <select style="margin-left:-0em !important;font-size:14px;" class="form-control" id="areaUso">
                  <option style="font-size:14px;" value="" disabled selected>Área de Uso</option>
                  <option style="font-size:14px;">Administração</option>
                  <option style="font-size:14px;">Ajustagem</option>
                  <option style="font-size:14px;">AutoClave</option>
                  <option style="font-size:14px;">Colmeia</option>
                  <option style="font-size:14px;">Engenharia</option>
                  <option style="font-size:14px;">Ferramental</option>
                  <option style="font-size:14px;">Manutenção</option>
                  <option style="font-size:14px;">MC Ajustagem</option>
                  <option style="font-size:14px;">MC Laminação</option>
                  <option style="font-size:14px;">Pintura</option>
                  <option style="font-size:14px;">Polimento Acrílico</option>
                  <option style="font-size:14px;">Polimento Metálico</option>
                  <option style="font-size:14px;">Produto Próprio</option>
                  <option style="font-size:14px;">Qualidade</option>
                  <option style="font-size:14px;">Sala Branca</option>
                  <option style="font-size:14px;">Termoformado</option>
                  <option style="font-size:14px;">Outro... (complementar na descrição)</option>
                </select>
            </div>
          </div>
          `,
        confirmButtonText: 'Enviar Solicitação',
        confirmButtonColor: '#007bff',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
        const nomeItem = Swal.getPopup().querySelector('#item_solicitacao').value
        const descricao = Swal.getPopup().querySelector('#descricao_solicitacao').value
        const quantidade = Swal.getPopup().querySelector('#quantidade_solicitacao').value
        const motivo = Swal.getPopup().querySelector('#motivo_solicitacao').value
        const setor = Swal.getPopup().querySelector('#areaUso').value
        if (!descricao || !motivo || !setor) {
            Swal.showValidationMessage(`Preencha os campos para prosseguir`)
        }
        return { 
          nome: nomeItem,
          descricao: descricao, 
          quantidade: quantidade, 
          unidade: Swal.getPopup().querySelector('#unidade_solicitacao').value,
          motivo: motivo, 
          setor: setor,
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
            const quantidade = result2.value.quantidade;
            const unidade = result2.value.unidade;
            const motivo = result2.value.motivo;
            const setor = result2.value.setor;
            const dict_values = {dataAtual,nomeItem , descricao, quantidade, unidade, motivo, setor};
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
  )}})};
       

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
        <th scope="col">Item</th>
        <th scope="col">Descrição</th>
        <th scope="col">Motivo</th>
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
      { data : 'nomeItem', "width": "15%"}, 
      { data : 'descricao', "width": "30%"},
      { data : 'motivo', "width": "25%"},
      ],
      columnDefs: [
      { className: 'dt-center', targets: '_all' },
      ],
      "language": {
      "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
      },
  })
  $('#button-aprovar').click(function () {
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
  $('#button-info').click(function () {
    var dadosSolicitacao = tableAprovador.rows('.selected').data(); // Adicionar 2 ao status
    dadosSolicitacao = dadosSolicitacao[0];
    console.log(dadosSolicitacao);
    if (!dadosSolicitacao){
      Swal.fire({
        titleText: "Selecione algum item para Rejeitar",
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor:'hwb(216 31% 1%)',
      })}else{
    Swal.fire({
      title: "Informações da Solicitações",
      width:'50em',
      allowOutsideClick: false,
      showCloseButton: true,
      padding: 0 ,
      showConfirmButton: false,
      confirmButtonColor:'hwb(216 31% 1%)', 
      html:`
              <div class="container-fluid" style="margin-left:2em; margin-right:2em; width:40em;">
                <div class="row pageMaisInfo">
                  <div class="col text-start"> 
                    <b>Solicitante (usuário):</b> <font color="#560101">${dadosSolicitacao.solicitante}</font>
                  </div>
                  <div class="col text-start"> 
                  <b>Data da Solicitação:</b> <font color="#560101">${dadosSolicitacao.data}</font>
                  </div>
                  
                </div>
                <div class="row pageMaisInfo"">
                  <div class="col text-start"> 
                  <b>Item Solicitado:</b> <font color="#560101">${dadosSolicitacao.nomeItem}</font>
                  </div>
                  <div class="col text-start"> 
                  <b>Descrição do Item:</b> <font color="#560101">${dadosSolicitacao.descricao}</font>
                  </div>
                </div>

                <div class="row pageMaisInfo">
                  <div class="col text-start" > 
                  <b>Quantidade Solicitada:</b> <font color="#560101">${dadosSolicitacao.quantidade}</font>
                  </div>
                  <div class="col text-start"> 
                  <b>Unidade:</b> <font color="#560101">${dadosSolicitacao.unidade}</font>
                  </div>
                </div>

                <div class="row pageMaisInfo">
                  <div class="col text-start"> 
                  <b>Justificativa da Compra:</b> <font color="#560101">${dadosSolicitacao.motivo}</font>
                  </div>
                  <div class="col text-start"> 
                  <b>Setor/Departamento:</b> <font color="#560101">${dadosSolicitacao.setor}</font>
                  </div>
                </div>
              </div>
              <div class="row" style="margin-bottom:1.5em;">
                <div class="col-sm text-end"><button class="btn btn-outline-secondary" type="submit" id="button-aprovar2">Aprovar</button></div>
                <div class="col-sm text-start"><button class="btn btn-outline-secondary" type="submit" id="button-rejeitar">Rejeitar</button></div>
              </div>
              `
            });
          };
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
  });
};

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
    console.log(response);
  });
}

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
          <th scope="col">Descrição</th>
          <th scope="col">Quantidade</th>
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
        { data : 'descricao', "width": "23%"},
        { data : 'quantidade', "width": "9.375%"},
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
        }
        novaCotacao(data_Solicitacao); 
    });

    $('#button-cotacao').click(function () {
      var data = table.rows('.selected').data();// Recebe os valores da linha selecionada
      data = data[0]
      if (!data){
        Swal.fire({icon:"error", titleText:"Selecione Alguma Compra", confirmButtonColor:'hwb(216 31% 1%)',})
      };
      if (data.qnt_cotacao==0){
        Swal.fire({icon:"info", titleText:"Solicitação ainda sem Cotação", confirmButtonColor:'hwb(216 31% 1%)',})
      }else{
        if(Number(JSON.stringify(data.qnt_cotacao).replace('"', '').replace('"', ''))==1){
          var title = `${JSON.stringify(data.qnt_cotacao).replace('"', '').replace('"', '')} Cotação Realizada`
        } else{
          var title = `${JSON.stringify(data.qnt_cotacao).replace('"', '').replace('"', '')} Cotações Realizadas`
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
              <div class="card" style="width: 15rem; margin-left:auto; margin-right:auto"">
              <div class="card-body">
                <h4 class="card-title">${response[i].id_cotacao}ª Cotação</h4>
                <h5 class="card-title">Fornecedor: ${response[i].fornecedor}</h5>
                <p class="card-text">Valor Total: <b>R$${response[i].valor_total}</b></p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Quantidade Solicitada: ${response[i].qnt_solicitada}</li>
                <li class="list-group-item">Valor Unitário: R$${response[i].valor_unitario}</li>
                <li class="list-group-item">Frete: R$${response[i].frete}</li>
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
              <div class="card" style="width: 15rem; margin-left:auto; margin-right:auto">
              <div class="card-body">
                <h4 class="card-title">${response.id_cotacao}ª Cotação</h4>
                <h5 class="card-title">Fornecedor: ${response.fornecedor}</h5>
                <p class="card-text">Valor Total: <b>R$${response.valor_total}</b></p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Quantidade Solicitada: ${response.qnt_solicitada}</li>
                <li class="list-group-item">Valor Unitário: R$${response.valor_unitario}</li>
                <li class="list-group-item">Frete: R$${response.frete}</li>
              </ul>
              <div class="card-body text-end">
                <a href="#" id="editarCotacao" class="card-link"><i class="fa-solid fa-pen-to-square"></i></a>
                <a onClick="newPopup()" id="apagarCotacao" class="card-link"><i class="fa-sharp fa-solid fa-trash"></i></a>
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
        Swal.fire({
          // titleText: text,
          title: `${JSON.stringify(numero_cotacao+1).replace('"', '').replace('"', '')}ª Cotação`,
          width: '50em',
          confirmButtonText: 'Enviar Cotação',
          allowOutsideClick: false,
          showCloseButton: true,
          confirmButtonColor: '#007bff',
          padding: '1em 1em 1.25em',
          html: `
          <div class="h2" style="margin-left:1em">
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start"><h4><b>Solicitação de Compra</b></h4></div>
            <div class="col-sm-6 text-start v1"><h4><b>Informações a Preencher</b></h4></div>
          </div></div>
          <div class="container-fluid">
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start"><b>Solicitante:</b> ${JSON.stringify(data.solicitante).replace('"', '').replace('"', '').charAt(0).toUpperCase() + JSON.stringify(data.solicitante).replace('"', '').replace('"', '').slice(1)}</div>
            <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="fornecedor" style="width:80% !important;" class="form-control v1" placeholder="Fornecedor"></div>
          </div>
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start"><b>Descrição:</b> ${JSON.stringify(data.descricao).replace('"', '').replace('"', '')}</div>
            <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="contato_fornecedor" style="width:80% !important;" class="form-control" placeholder="Contato Fornecedor"></div>
          </div> 
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start"><b>Motivo:</b> ${JSON.stringify(data.motivo).replace('"', '').replace('"', '')}</div>
            <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="unidade" style="width:80% !important;" class="form-control" placeholder="Unidade Padrão Comercializada"></div>
          </div> 
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start"><b>Quantidade:</b> ${JSON.stringify(data.quantidade).replace('"', '').replace('"', '')}</div>
            <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="number" id="valor_unitario" style="width:80% !important;" class="form-control" placeholder="Valor Unitário"></div>
          </div> 
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start"><b>Setor:</b> ${JSON.stringify(data.setor).replace('"', '').replace('"', '')}</div>
            <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="number" id="frete" style="width:80% !important;" class="form-control" placeholder="Frete"></div>
          </div> 
          <div class="row" style="line-height: 3em;">
            <div class="col-sm-6 text-start""><b>Cotação nº:</b> ${JSON.stringify(data.qnt_cotacao+1).replace('"', '').replace('"', '')}</div>
            <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="inf_extra" style="width:80% !important;" class="form-control" placeholder="Observações"></div>
          </div> 
          <div class="row" style="line-height: 3em; backgroung:white">
          <div class="col-sm-6 text-end"></div>
          <div class="col-sm-6 text-start" style="margin-top:1.25em;border-left: 2px dotted grey;"><input type="date" id="validade_cotacao" style="width:80% !important;" class="form-control" placeholder="Validade Cotação">
          <p class="text-center" style="font-size: 75%; color:red;line-height: 1.25em; margin-top:1em !important;">Caso necessário, indique a data de validade da cotação acima. </p></div>
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
            fornecedor: Swal.getPopup().querySelector('#fornecedor').value,
            valor_unitario: Swal.getPopup().querySelector('#valor_unitario').value,
            frete: Swal.getPopup().querySelector('#frete').value,
            inf_extra: Swal.getPopup().querySelector('#inf_extra').value,
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
    });
  })}
    })});
    }
  

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
          })
        };
      });
    };
  })
}
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
        console.log(dadosCotacao); // Aqui deve entrar o script Modal para editar a cotação!!!!
      });
    };
  });
}

function novaCotacao(data_Solicitacao){
  Swal.fire({
    title: `${JSON.stringify(data_Solicitacao.qnt_cotacao+1).replace('"', '').replace('"', '')}ª Cotação`,
    width: '50em',
    confirmButtonText: 'Enviar Cotação',
    confirmButtonColor: '#007bff',
    padding: '1em 1em 1.25em',
    html: `
    <div class="h2" style="margin-left:1em">
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start"><h4><b>Resumo da Solicitação</b></h4></div>
      <div class="col-sm-6 text-start v1"><h4><b>Informações a Preencher</b></h4></div>
    </div></div>
    <div class="container-fluid">
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start"><b>Solicitante:</b> ${JSON.stringify(data_Solicitacao.solicitante).replace('"', '').replace('"', '').charAt(0).toUpperCase() + JSON.stringify(data_Solicitacao.solicitante).replace('"', '').replace('"', '').slice(1)}</div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="fornecedor" style="width:80% !important;" class="form-control v1" placeholder="Fornecedor"></div>
    </div>
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start"><b>Descrição:</b> ${JSON.stringify(data_Solicitacao.descricao).replace('"', '').replace('"', '')}</div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="contato_fornecedor" style="width:80% !important;" class="form-control" placeholder="Contato Fornecedor"></div>
    </div> 
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start"><b>Motivo:</b> ${JSON.stringify(data_Solicitacao.motivo).replace('"', '').replace('"', '')}</div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="unidade" style="width:80% !important;" class="form-control" placeholder="Unidade Padrão Comercializada"></div>
    </div> 
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start"><b>Quantidade:</b> ${JSON.stringify(data_Solicitacao.quantidade).replace('"', '').replace('"', '')}</div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="number" id="valor_unitario" style="width:80% !important;" class="form-control" placeholder="Valor Unitário"></div>
    </div> 
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start"><b>Setor:</b> ${JSON.stringify(data_Solicitacao.setor).replace('"', '').replace('"', '')}</div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="number" id="frete" style="width:80% !important;" class="form-control" placeholder="Frete"></div>
    </div> 
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start""><b>Nº da Cotação:</b> ${JSON.stringify(data_Solicitacao.qnt_cotacao+1).replace('"', '').replace('"', '')}</div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="text" id="inf_extra" style="width:80% !important;" class="form-control" placeholder="Observações"></div>
    </div> 
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start""></div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"><input type="date" id="validade_cotacao" style="width:80% !important;" class="form-control" placeholder="Validade Cotação">
      <p class="text-center" style="font-size: 75%; color:red;line-height: 1.25em; margin-top:1em !important;">Caso necessário, indique a data de validade da cotação acima. </p></div>
    </div> 
    <div class="row" style="line-height: 3em;">
      <div class="col-sm-6 text-start""></div>
      <div class="col-sm-6" style="border-left: 2px dotted grey; margin-top:1.25em;"></div>
    </div> 
    <div class="row" style="line-height: 3em; backgroung:white">
    <div class="col-sm-6 text-end"></div>
    <div class="col-sm-6 text-start" style="margin-top:1.25em;border-left: 2px dotted grey;"></div>
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
      fornecedor: Swal.getPopup().querySelector('#fornecedor').value,
      valor_unitario: Swal.getPopup().querySelector('#valor_unitario').value,
      frete: Swal.getPopup().querySelector('#frete').value,
      inf_extra: Swal.getPopup().querySelector('#inf_extra').value,
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
  };