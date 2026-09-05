// Cardápio da Doce Sonho — edite aqui para adicionar produto/sabor novo, sem mexer no HTML.

const NUMERO_WHATSAPP = "5588997984717";
const HORARIO_ABERTURA = 7;
const HORARIO_FECHAMENTO = 21;

const PRODUTOS = [
  {
    id: "brownie",
    nome: "Brownie",
    descricao: "Brownie denso, feito com muito chocolate.",
    preco: 7.00,
    foto: "images/brownie.jpg",
    sabores: null
  },
  {
    id: "brownie-pote",
    nome: "Brownie no Pote",
    descricao: "Brownie cremoso servido no pote, com calda de chocolate.",
    preco: 7.00,
    foto: "images/brownie-pote.jpg",
    sabores: null
  },
  {
    id: "sorvete",
    nome: "Sorvete",
    descricao: "Sorvete cremoso para refrescar o seu dia.",
    precoBase: 4.00,
    foto: "images/sorvete-ninho-trufado.JPG",
    sabores: [
      { nome: "Flocos", preco: 4.00, foto: "images/sorvete-flocos.jpg" },
      { nome: "Chocolate", preco: 4.00, foto: "images/sorvete-chocolate.jpg" },
      { nome: "Ninho Trufado", preco: 4.00, foto: "images/sorvete-ninho-trufado.JPG" }
    ]
  },
  {
    id: "dindin-gourmet",
    nome: "Dindin Gourmet",
    descricao: "Dindin gourmet cremoso, embalado e lacrado à mão.",
    precoBase: 4.00,
    foto: "images/bolo.jpg",
    sabores: [
      { nome: "Ninho com Nutella", preco: 4.00, foto: "images/dindin-ninho-nutella.jpg" },
      { nome: "Morango com Nutella", preco: 4.00, foto: "images/galeria3.jpg" },
      { nome: "Chocolate", preco: 4.00, foto: "images/dindin-chocolate.jpg" },
      { nome: "Prestígio", preco: 4.00, foto: "images/galeria5.jpg" },
      { nome: "Pudim", preco: 5.00, foto: "images/dindin-pudim.jpg" }
    ]
  },
  {
    id: "trufas",
    nome: "Trufas",
    descricao: "Trufas artesanais em diversos sabores.",
    preco: 3.00,
    foto: "images/trufas.jpg",
    saboresLista: ["Chocolate", "Dois Amores", "Açaí", "Amendoim", "Beijinho", "Ninho"]
  }
];
