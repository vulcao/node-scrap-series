var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express();

// Passo 1
app.get('/raspagem', function(req, res) {
  // Passo 2
  url = 'http://www.serieswithlove.com/bones-12a-temporada-mp4-legendado-mega/';
  request(url, function(error, response, html) {
      //.entry > blockquote:nth-child(3) > p:nth-child(1) > strong:nth-child(1)
      //.entry > div:nth-child(8) > div:nth-child(6) > div:nth-child(2) > div:nth-child(9) > strong:nth-child(1)
      //.entry > div:nth-child(8) > div:nth-child(6) > div:nth-child(2) > div:nth-child(9) > strong:nth-child(1) > a:nth-child(1)
      // Assegurar que não tenha erros para fazer a raspagem de dados com sucesso
      if (!error) {
          var $ = cheerio.load(html);

          // Objeto que irá armazenar a tabela
          var resultado = [];
          // Passo 3
          // Manipulando o seletor específico para montar nossa estrutura
          // Escolhi não selecionar a primeira linha porque faz parte do header da tabela
          $('#listagem tr:not(:first-child)').each(function(i) {
              // Obtendo as propriedades da tabela.
              // O método .trim() garante que irá remover espaço em branco
              var codigo = $(this).find('td').eq(0).text().trim(),
                  orgao = $(this).find('td').eq(1).text().trim(),
                  valorTotal = $(this).find('td').eq(2).text().trim();

              // Inserindo os dados obtidos no nosso objeto
              resultado.push({
                  codigo: codigo,
                  orgao: orgao,
                  total: valorTotal
              });
          });

          // Passo 4
          fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
              console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
          })
      }
  })
})

app.listen('8081')
console.log('Executando raspagem de dados na porta 8081...');
exports = module.exports = app;
