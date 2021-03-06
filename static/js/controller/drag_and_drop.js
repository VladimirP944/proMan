import { dataHandler } from "../data/dataHandler.js";

const ui = {
  slots: null,
  cards: null,
  dragged: null
};

export function initDragAndDrop() {
    initElements();
    initDragEvents();
}

function initElements() {
  ui.cards = document.querySelectorAll(".card");
  ui.slots = document.querySelectorAll(".board-column-content");
}

function initDragEvents() {
    ui.cards.forEach(function (card) {
        initDraggable(card);
    });

    ui.slots.forEach(function (slot) {
        initDropzone(slot);
    });
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart(event) {
    ui.dragged = event.currentTarget;
    ui.dragged.classList.add("dragging-now")
}

function handleDragEnd() {
    ui.dragged.style.opacity = "1";
    ui.dragged.classList.remove("dragging-now");
    ui.dragged = null;
}

function handleDragEnter(e) {
    // console.log("Drag enter of", e.currentTarget);
}

function handleDragOver(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    if (dropzone.getAttribute("data-board-id") === ui.dragged.getAttribute("data-board-id")) {
        dropzone.style.opacity = "0.7";
        const afterElement = getDragAfterElement(dropzone, event.clientY);

        if (!afterElement) {
            dropzone.appendChild(ui.dragged);
        } else {
            dropzone.insertBefore(ui.dragged, afterElement);
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll(".card:not(.dragging-now)")];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }
            ).element;
        }
    }
}

function handleDragLeave(event) {
    const dropzone = event.currentTarget;
    dropzone.style.opacity = null;
}

function handleDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    dropzone.style.opacity = null;

    for (let i=0; i<dropzone.children.length; i++) {
        dropzone.children[i].setAttribute("data-card-order", `${i+1}`);

        dataHandler.updateCards(dropzone.children[i].getAttribute("data-card-id"),
                                dropzone.getAttribute("data-status-id"),
                                dropzone.children[i].getAttribute("data-card-order"))
    }

}