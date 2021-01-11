import { loadPage } from './load'

const fetchUserBoards = async function() {
  const ownerId = window.auth.currentUser.uid;
  const boardDocs = await window.db.collection("boards")
    .where("ownerId", "==",ownerId)
    .get()
  console.log(`Got ${boardDocs.docs.length} boards`);
  const boards=[];
  boardDocs.forEach(function(boardDoc) {
    const board = boardDoc.data();
    board.id = boardDoc.id;
    boards.push(board);
  });
  console.log(boards);
  window.Template7.global.userBoards = boards;
  window.renderTemplates();
}

const routes = {
  '/boards/:boardId': {
    as: 'board.view',
    uses: function (params) {
      console.log('I am on a board view page')
      console.log(params)
      loadPage('board', params)
    }
  }
}

export { fetchUserBoards, routes as boardRoutes }