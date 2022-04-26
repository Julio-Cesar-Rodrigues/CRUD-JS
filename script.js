const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
  clearFields()
  document.getElementById('modal').classList.remove('active')
}

//retorna o db_client e o converte em JSON ou retorna um array vazio
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_client')) ?? []

//adiciona uma chave no Storage e converte os dados em string
const setLocalStorage = dbCLient =>
  localStorage.setItem('db_client', JSON.stringify(dbCLient))

//CRUD - Create
//recebe o client, e a const dbClient recebe a funcao getLocalStorage, envia os dados atravez do metodo push e chama a funcao setLocalStorage
const createClient = client => {
  const dbClient = getLocalStorage()
  dbClient.push(client)
  setLocalStorage(dbClient)
}

//CRUD - Read
const readClient = () => getLocalStorage()

//CRUD- Update
//recebe o index e as informaçoes do cliente, procura essa index e substitui as informaçoes
const updateClient = (index, client) => {
  const dbClient = readClient()
  dbClient[index] = client
  setLocalStorage(dbClient)
}

//CRUD - delete
//recebe o index, le as informaçoes remove o item do localstorage e retorna novamente o bdClient
const deleteClient = index => {
  const dbClient = readClient()
  dbClient.splice(index, 1)
  setLocalStorage(dbClient)
}

const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

//recebe todos os campos do html com a classe modal-field e deixa elas com o valor ''
const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => (field.value = ''))
}

//salvar dados
//verifica se os dados sao validos, constroi um novo cliente, cria ele no local stoage, atualiza a tabela, limpa os campos e fecha o modal
const saveClient = () => {
  if (isValidFields()) {
    const client = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      cell: document.getElementById('cell').value,
      city: document.getElementById('city').value
    }

    const index = document.getElementById('name').dataset.index
    if (index == 'new') {
      createClient(client)
      updateTable()
      closeModal()
    } else {
      updateClient(index, client)
      updateTable()
      closeModal()
    }
  }
}

//criando linhas da tabela
const createRow = (client, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `<td>${client.name}</td>
                      <td>${client.email}</td>
                      <td>${client.cell}</td>
                      <td>${client.city}</td>
                      
                      <td>
                        <button type="button" class="button green" id="edit-${index}">Editar</button>
                        <button type="button" class="button red" id="delete-${index}">Deletar</button>
                      </td>`
  document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

//le os dados que existem no dbClient e chama função createRow
const updateTable = () => {
  const dbClient = readClient()
  clearTable()
  dbClient.forEach(createRow)
}

const fillFields = client => {
  document.getElementById('name').value = client.name
  document.getElementById('email').value = client.email
  document.getElementById('cell').value = client.cell
  document.getElementById('city').value = client.city
  document.getElementById('name').dataset.index = client.index
}

//recebe o index e le o cliente e abre op modal
const editClient = index => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

//identifica quais sao os botoes de editar e de excluir e seus index
const editDelete = event => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(
        `Deseja realmente excluir o cliente ${client.name}?`
      )
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
  }
}

updateTable()

document.getElementById('register').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('save').addEventListener('click', saveClient)
document
  .querySelector('#tableClient>tbody')
  .addEventListener('click', editDelete)
document
  .querySelector('.modal-footer>#cancel')
  .addEventListener('click', closeModal)
