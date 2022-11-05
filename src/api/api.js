const { default: axios } = require("axios");
const apiPage = "https://books-pp.azurewebsites.net/api";
export const getAllBooks = () => {
  return axios.get(apiPage + "/getAllBooks");
};
export const getSpecificBook = (book) => {
  return axios.get(apiPage + "/getBook/" + book);
};
