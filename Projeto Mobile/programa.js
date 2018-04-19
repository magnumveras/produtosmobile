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
        arrayList.push($scope.itemcarrinho[0]);
        if(JSON.parse(window.sessionStorage.getItem('itemcarrinho'))){
            var itens = [];
            itens = JSON.parse(window.sessionStorage.getItem('itemcarrinho'))

            for(var i = 0; i < itens.length; i++){
                arrayList.push(itens[i]);
            }
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
    alert(arraycarrinho[0].nome);
    //Laço para preenchimento de tabela
    for(var i = 0; i < arraycarrinho.length; i++){
        var html = '<th>' + arraycarrinho[i].nome + '</th>' + 
                   '<th>' + arraycarrinho[i].valorunitario + '</th>' +
                   '<th>' + arraycarrinho[i].quantidade +  '</th>' + 
                   '<th>' + arraycarrinho[i].valortotal + '</th>' +
                   '<th scope="row"><button type="button" class="btn btn-danger">X</button>'
        
        $("#bodytabela").append('<tr>' + html + '</tr>');
    }

});

$(document).ready(function(){
    $('#btnaplicar').click(function(){
        var valor = $('#categorias').val();
        alert(valor);
    });
});


