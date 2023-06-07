// Inicializar Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_DOMINIO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_BUCKET.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.firestore();
  
  // Referencias a los elementos del formulario
  const form = document.querySelector("form");
  const imageInput = document.querySelector("#image");
  const idInput = document.querySelector("#id");
  const nameInput = document.querySelector("#name");
  const descriptionInput = document.querySelector("#description");
  const valueInput = document.querySelector("#value");
  const categoryInput = document.querySelector("#category");
  
  // Referencia al cuerpo de la tabla
  const tableBody = document.querySelector("#product-table-body");
  
  // Función para cargar los datos en la tabla
  function loadProducts() {
    tableBody.innerHTML = ""; // Limpiar el contenido actual
  
    db.collection("productos").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { id, name, description, value, category } = data;
  
        // Crear una nueva fila en la tabla con los datos del producto
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${id}</td>
          <td>${name}</td>
          <td>${description}</td>
          <td>${value}</td>
          <td>${category}</td>
          <td>
            <button onclick="editProduct('${doc.id}')">Editar</button>
            <button onclick="deleteProduct('${doc.id}')">Eliminar</button>
          </td>
        `;
  
        tableBody.appendChild(row);
      });
    });
  }
  
  // Escuchar el evento submit del formulario para agregar un producto
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evitar el envío del formulario
  
    // Obtener los valores del formulario
    const id = idInput.value;
    const name = nameInput.value;
    const description = descriptionInput.value;
    const value = valueInput.value;
    const category = categoryInput.value;
  
    // Guardar el producto en la base de datos
    db.collection("productos").add({
      id,
      name,
      description,
      value,
      category
    }).then(() => {
      // Limpiar los campos del formulario
      form.reset();
      loadProducts(); // Actualizar la tabla
    });
  });
  
  // Función para editar un producto
  function editProduct(productId) {
    // Obtener los datos del producto a través del ID
    db.collection("productos").doc(productId).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const { id, name, description, value, category } = data;
  
        // Rellenar los campos del formulario con los datos del producto
        idInput.value = id;
        nameInput.value = name;
        descriptionInput.value = description;
        valueInput.value = value;
        categoryInput.value = category;
      }
    });
  }
  
  // Función para eliminar un producto
  function deleteProduct(productId) {
    db.collection("productos").doc(productId).delete().then(() => {
      loadProducts(); // Actualizar la tabla
    });
  }
  
  // Cargar los productos al cargar la página
  loadProducts();
  