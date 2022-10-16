import * as model from "./model.js"
import {MODAL_CLOSE_SEC} from "./config.js"
import recipeView  from "./views/recipeView.js";
import searchView from "./views/searchView.js"
import resultView from "./views/resultsView.js"
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js"
import addRecipeView from "./views/addRecipeView.js";
import "core-js/stable"
import "regenerator-runtime/runtime"

//per non aggiornare al save e mantenere lo state
/* if(module.hot){
  module.hot.accept()
}
 */

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    if(!id) return
    recipeView.renderSpinner()
    
    //update results view to mark selected search result
    resultView.update(model.getSearchResultsPage())
    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks)
    
    //loading recipe 
    await model.loadRecipe(id)
    //rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    //propagazione errore da helper a modello a controller a view
    recipeView.renderError()
  }
};

const controlSearchResults = async function () {
  try{
    //get search query
    const query = searchView.getQuery()
    if(!query) return
    resultView.renderSpinner()
    //load search results
    await model.loadSearchResults(query)
    //render results
    // resultView.render(model.state.search.results)
    resultView.render(model.getSearchResultsPage())
    //rendere paginations
    paginationView.render(model.state.search)
  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  //render new results
  resultView.render(model.getSearchResultsPage(goToPage))
  //render new paginations buttons
  paginationView.render(model.state.search)
}

const controServings = function(newServings){
  //update the recipes servings (in state)
  model.updateServings(newServings)

  //update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function() {
  //add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  //update recipe view
  recipeView.update(model.state.recipe)

  //render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
    //spinner
    addRecipeView.renderSpinner()

    //upload new recipe data
    await model.uploadRecipe(newRecipe)
    //render recipe
    recipeView.render(model.state.recipe)

    //succes message
    addRecipeView.renderMessage()

    //render bookmark view
    bookmarksView.render(model.state.bookmarks)

    //change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`)
    //close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  }catch(err){
    addRecipeView.renderError(err.message)
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()