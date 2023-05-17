const contentContainer = document.querySelector('.content')
const bookButton = document.querySelector('.book-btn');
const newBookContainer = document.querySelector('.new-book-container');
const createButton = document.querySelector('.create-btn')
const editContainer = document.querySelector('.edit-book-container')
const closeDetails = document.querySelector('.close-details');
const bookDetailContainer = document.querySelector('.book-details-container')
const inputsInNewBook = document.querySelectorAll('.new-book-container input')
const tableContent = document.querySelector('.content table tbody')
const inputFieldsCreate = document.querySelectorAll('.new-book-container input');
const booksData = document.querySelector('.books-data');
const message = document.querySelector('.message');
const inputInBookDetail = document.querySelectorAll('.book-details-container input')
const inputInEdit = document.querySelectorAll('.edit-book-container input')
const showBooks = async () => {
    message.innerHTML = "Loading..."
    try {
        const {
            data: { books },
        } = await axios.get('/api/v1/books')
        if (books.length < 1) {
            message.innerHTML = "No books..."
            tableContent.innerHTML = ""
            return
        }
        const allBooks = books.map((book) => {
            const { title, author, isbn, _id: bookID } = book;
            return (
                `
                <tr class="border-b">
                    <td class="text-base font-semibold text-gray-600 px-6 py-4 whitespace-nowrap">${book.title}</td>
                    <td class="text-base font-semibold text-gray-600 px-6 py-4 whitespace-nowrap">${book.author}</td>
                    <td class="text-base font-semibold text-gray-600 px-6 py-4 whitespace-nowrap">${book.isbn}</td>
                    <td class="text-base font-semibold text-gray-600 px-6 py-4 whitespace-nowrap">
                        <button type="button" class="inline-block px-6 py-1.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-400 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out mx-1 edit-btn"  data-id="${bookID}">Edit</button>
                        <button type="button" class="inline-block px-6 py-1.5 bg-sky-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-sky-400 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out mx-1 details-btn" data-id="${bookID}">Details</button>
                        <button type="button" class="inline-block px-6 py-1.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-400 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out mx-1 delete-btn" data-id="${bookID}">Delete</button>
                    </td>
                </tr>
`
            )
        }).join('')
        message.innerHTML = ""
        tableContent.innerHTML = allBooks;
    } catch (error) {
        console.log(error);
    }
}
showBooks();
const editButton = document.querySelector('.edit-btn');
const doneEditButton = document.querySelector('.done-edit')
const detailsButton = document.querySelector('.details-btn');
const deleteButton = document.querySelector('.delete-btn');

bookButton.addEventListener('click', () => {
    newBookContainer.classList.remove('hidden');
    contentContainer.classList.add('blur-sm')
})

createButton.addEventListener('click', async () => {
    //put data
    const title = inputFieldsCreate[0].value;
    const author = inputFieldsCreate[1].value;
    const isbn = inputFieldsCreate[2].value;
    for (let i = 0; i < 3; i++) {
        inputFieldsCreate[i].value = ""
    }
    try {
        await axios.post('/api/v1/books', { title, author, isbn })
        showBooks();
    }
    catch (error) {
        console.log(error);
    }
    newBookContainer.classList.add('hidden');
    contentContainer.classList.remove('blur-sm')
})

booksData.addEventListener('click', async (e) => {
    const el = e.target;
    const id = el.dataset.id;
    if (el.classList.contains("delete-btn")) {
        el.parentElement.children[0].disabled=true;
        el.parentElement.children[1].disabled=true;
        el.disabled=true;
        await axios.delete(`/api/v1/books/${id}`)
        showBooks();
    }
    if (el.classList.contains('details-btn')) {
        bookDetailContainer.classList.remove('hidden')
        contentContainer.classList.add('blur-sm')
        const results = await axios.get(`/api/v1/books/${id}`)
        if (results) {
            const book = results.data.book;
            console.log(inputInBookDetail);
            inputInBookDetail[0].value = book.title
            inputInBookDetail[1].value = book.author
            inputInBookDetail[2].value = book.isbn
        }

        document.querySelector('.close-details').addEventListener('click', () => {
            closeDetails.innerHTML = "Closing..."
            setTimeout(() => {
                bookDetailContainer.classList.add('hidden');
                contentContainer.classList.remove('blur-sm')
                closeDetails.innerHTML = "Close"
            }, 1000)
        })
    }
        if(el.classList.contains("edit-btn")){
            editContainer.classList.remove('hidden')
            contentContainer.classList.add('blur-sm')
            const results = await axios.get(`/api/v1/books/${id}`)
            if (results) {
                const book = results.data.book;
                console.log(inputInBookDetail);
                inputInEdit[0].value = book.title
                inputInEdit[1].value = book.author
                inputInEdit[2].value = book.isbn
            }
            console.log(doneEditButton);
            doneEditButton.addEventListener('click', async() => {
                const title = inputInEdit[0].value 
                const author = inputInEdit[1].value
                const isbn = inputInEdit[2].value
                await axios.patch(`/api/v1/books/${id}`,{title,author,isbn})
                showBooks();
                doneEditButton.innerHTML = "Editing..."
                setTimeout(() => {
                    editContainer.classList.add('hidden')
                    contentContainer.classList.remove('blur-sm')
                    doneEditButton.innerHTML = "Edit"
            
                }, 1000)
            })
        }
})


