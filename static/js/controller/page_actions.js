import { dataHandler } from "../data/dataHandler.js";

let initialText = null;

addEventListener('click', event => {


    // Delete elements function

    if (event.target.id.includes('delete')) {
        let element = event.target.id;
        let identifier = event.target.getAttribute('dataId');

        switch (element) {
            case 'deleteBoard':
                if (dataHandler.deleteBoard(identifier)) {
                    let parent = document.querySelector(`[section-board-id="${identifier}"]`);
                    while (parent.firstChild) {
                        parent.firstChild.remove()
                    }
                    parent.remove()        
                };
                break;
            case 'deleteStatus':
                if (dataHandler.deleteStatus(identifier)) {
                    let parent = document.querySelector(`[data-status-id="${identifier}"]`);
                    while (parent.firstChild) {
                        parent.firstChild.remove()
                    }
                    parent.remove()
                }
                break;
            case 'deleteCard':
                if (dataHandler.deleteCard(identifier)) {
                    let parent = document.querySelector(`[data-card-id="${identifier}"]`);
                    while (parent.firstChild) {
                        parent.firstChild.remove()
                    }
                    parent.remove()
                }
                break;
        }
    }


    // Set board dropown and button image

    if (event.target.name === 'chevron') {
        let boardId = event.target.dataset.boardId;
        let boardContent = document.querySelector(`.board-columns[data-board-id="${boardId}"]`)
        if (boardContent.hidden === true) {
            boardContent.hidden = false;
            document.querySelector(`#chevron${boardId}`).src = "./static/chevronUp.png"
        }else {
            boardContent.hidden = true;
            document.querySelector(`#chevron${boardId}`).src = "./static/chevronDown.png"
        }
    }


    // Close login/registration modal when clicked outside of it

    if (event.target.id === 'id01' || event.target.id === 'id02') {
        event.target.style = 'none'
    }


    // Activate and save editable text

    if (event.target.isContentEditable) {
        initialText = event.target.innerHTML;

        // setTimeout(() => {
        //     if (document.activeElement !== event.target) {
        //         event.target.contentEditable = false;
        //     }
        // }, 400)

        event.target.addEventListener('keypress', e => {
            
            if (e.key === 'Enter') {
                event.target.contentEditable = false
                event.target.contentEditable = true
                if (event.target.innerHTML == '' || event.target.innerHTML === initialText) {
                    event.target.innerHTML = initialText;
                    return
                }
                let newText = event.target.innerHTML;
                let elementId = event.target.id;
                switch (event.target.className) {
                    case 'boardTitle':
                        let table = `boards`
                        dataHandler.editContent(table, elementId, newText);
                        break;
                    case 'card-title':
                        dataHandler.editContent('cards', elementId, newText);
                        break
                    case 'board-column-title':
                        dataHandler.editContent('statuses', elementId, newText);
                        break
                }
            }
        })
        event.target.addEventListener('blur', e => {
            if (event.target.isContentEditable) {
                event.target.innerHTML = initialText;
                // event.target.contentEditable = false
            }
        })
    }
})