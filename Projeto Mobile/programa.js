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

  $scope.categoria = $('#categorias').val();
});


$(document).ready(function(){
    $('#btnaplicar').click(function(){
        var valor = $('#categorias').val();
        alert(valor);
    });
});


