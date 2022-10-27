const { default: axios } = require("axios");
const apiPage = "http://localhost:5154/api";
export const getAllBooks = () => {
  return axios.get(apiPage + "/getAllBooks");
};
export const getSpecificBook = (book) => {
  return axios.get(apiPage + "/getBook/" + book);
};
