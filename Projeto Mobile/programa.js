var app = angular.module('loja', []);

app.controller('principal', function($scope, $http){


  $scope.min = 0;
  $scope.max = 10000;
  $scope.produtos = [];


  $http.get('produtos.json').then(function(response){
      $scope.produtos = response.data;
  });

  $scope.minmax = function(produto){
      return produto.valor >= $scope.min && produto.valor <= $scope.max;
  };

  //retorna valor de categoria para a tela
  $scope.categoria = $('#categorias').val();

  //Função Captura produto clicado
  $scope.selecionar = function(nometela){                
    var i = 0;
    var a = false;
    while (i < $scope.produtos.length && a === false){
        if ($scope.produtos[i].nome === nometela){
            a = true;
        } else {
            i++;
        }
    }

    //alert($scope.produtos[i].nome + " " + $scope.produtos[i].valor + " " + $scope.produtos[i].categoria + " " + $scope.produtos[i].desc)
    
    window.sessionStorage.setItem('produto', JSON.stringify($scope.produtos[i]));
    //alert("Passou: " + $scope.produtos[i].desc);
    $scope.teste = {};
    $scope.produtodesc = JSON.parse(sessionStorage.getItem('produto'));    
    window.location.href='descricao.html';
    }

    
});

//Controller da página de descrição
var appdesc = angular.module("produtodesc", []);

appdesc.controller('descricao', function($scope, $http){
    $scope.produtodesc = {};
               $scope.init = function(){                   
                   $scope.produtodesc = JSON.parse(window.sessionStorage.getItem('produto'));
                   //alert("Página descrição" + $scope.produtodesc.desc);
                   window.sessionStorage.removeItem('produto');
               }
    $scope.init();

    $scope.comprarproduto = function(nomeproduto, valorproduto, produtoqtd){
        var valortotal = valorproduto * produtoqtd;
        var arrayList = [];
        $scope.itemcarrinho = [
            {
                "nome": nomeproduto,
                "valorunitario": valorproduto,
                "quantidade": produtoqtd,
                "valortotal": valortotal
            },
        ];
    

        if(JSON.parse(window.sessionStorage.getItem('itemcarrinho'))){
            var itens = [];
            var verifica = false;
            itens = JSON.parse(window.sessionStorage.getItem('itemcarrinho'));
            
            
            for(var i = 0; i < itens.length; i++){
                arrayList.push(itens[i]);
            }
            
            //Verificar valores repetidos
            for(var i = 0; i < itens.length; i++){
                if(itens[i].nome === $scope.itemcarrinho[0].nome){
                    itens[i].quantidade = parseInt(itens[i].quantidade) + parseInt($scope.itemcarrinho[0].quantidade);
                    itens[i].valortotal = parseFloat(itens[i].valorunitario) * parseFloat(itens[i].quantidade);
                    verifica = true;
                }
                
            }
            //Push digitado fica por último para assegurar que não seja digitado o mesmo produto de forma duplicada
            //O mesmo verifica se não existe registro do produto já e faz a inclusão em caso negativo
            if(verifica == false){
                arrayList.push($scope.itemcarrinho[0]);
            }
        }else{
            arrayList.push($scope.itemcarrinho[0]);
        }
        
        window.sessionStorage.setItem('itemcarrinho', JSON.stringify(arrayList));    
        window.location.href='carrinho.html';
        //alert(nomeproduto + " " + valorproduto + " " + produtoqtd + " " + valortotal);
        //alert($scope.itemcarrinho[0].nome + " " + $scope.itemcarrinho[0].valortotal);
    }
});


//Controller de carrinho
var appcar = angular.module("ProdutoCarrinho", []);


appcar.controller('carrinho', function($scope, $http){
    var arraycarrinho = [];
    $scope.init = function(){

        arraycarrinho = JSON.parse(window.sessionStorage.getItem('itemcarrinho'));

        //alert(arraycarrinho[0].nomeproduto);
    }
    $scope.init();
    //alert(arraycarrinho[0].nome);


    //Laço para preenchimento de tabela
    var valor = 0;
    for(var i = 0; i < arraycarrinho.length; i++){
        var html = '<th>' + arraycarrinho[i].nome + '</th>' + 
                   '<th>' + arraycarrinho[i].valorunitario + '</th>' +
                   '<th>' + arraycarrinho[i].quantidade +  '</th>' + 
                   '<th>' + arraycarrinho[i].valortotal + '</th>' +
                   '<th scope="row"><button type="button" class="btn btn-danger" value="' + [i] + '" id="btexcluir' + [i] + '">X</button></th>'
        
        valor += parseFloat(arraycarrinho[i].valortotal);
        $scope.valorgeral = valor;
        $("#bodytabela").append('<tr>' + html + '</tr>');
    }

     /*Captura nomes de cada item
     var arraynomes = [];
     for(var i = 0; i < arraycarrinho.length; i++){
          arraynomes.push(arraycarrinho[i].nome);
         
     }*/

    //Função excluir produto do carrinho
    //var arrayexcluir = [];
    for(var i = 0; i < arraycarrinho.length; i++){
        $("#btexcluir" + [i]).click(function(){
            /*if(arraycarrinho[i].nome != arraynomes[i]){
                arraysub.push(arraycarrinho[i]);
            }*/
            var botao = $(this).val();
            //alert(botao);
            arraycarrinho.splice(botao, 1);

            //alert(arraycarrinho);
            
            //Envia novo array para Sessão Itemcarrinho
            window.sessionStorage.setItem('itemcarrinho', JSON.stringify(arraycarrinho));    
            window.location.href='carrinho.html';   
            alert("Item excluído com sucesso!");
        });
    }
});

$(document).ready(function(){
    $('#btnaplicar').click(function(){
        var valor = $('#categorias').val();
        alert(valor);
    });
});


