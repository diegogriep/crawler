const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const FILE = 'carros.txt'
const URL = 'https://www.seminovos.com.br/carro/Volkswagen/Saveiro-Cab-Simples/ano-2012-2015/cidade[]-2700/listaAcessorios[]-1-3?ordenarPor=4&registrosPagina=100&hidValue=true&hideFinancing=true'

request(URL, function (err, res, body) {
  if (err) console.log(err)

  const jQuery = cheerio.load(body)
  let carros = []

  jQuery('.veiculos-destaque > div .card').not('.vendido').each(function () {
    let regex = /\/(.*?)\//g
    let link = jQuery(this).find('.card-content > a').attr('href').trim().match(regex)
    let valor = jQuery(this).find('.card-content .card-price').text().trim()
    let ano = jQuery(this).find('.card-content .card-info .list-features li').eq(0).text().trim()
    let km = parseInt(jQuery(this).find('.card-content .card-info .list-features li').eq(1).text().trim().replace(' Km', '').replace('.', ''))

    if (km > 1000 && km < 85000) {
      carros.push(`Ano ${ano} - Valor ${valor} - KM ${km} - Link: www.seminovos.com.br${link}`)
    }
  })

  const listaCarros = carros.join('\n')
  let qtdCarros = carros.length

  fs.exists(FILE, exists => {
    if (exists) {
      fs.unlink(FILE, err => {
        if (err) throw err
      })
    }
  })

  fs.appendFile(FILE, listaCarros, err => {
    if (err) throw err
  })

  console.log(`Foram encontrados ${qtdCarros} carros\n`)
  console.log(listaCarros)
})
