// ==UserScript==
// @name            Focus inline tag editor
// @description     Focus inline tag editor when opened
// @author          VLAZ
// @grant           none
// @inject-into     page
// @match           https://stackoverflow.com/*
// @match           https://serverfault.com/*
// @match           https://superuser.com/*
// @match           https://*.stackexchange.com/*
// @match           https://askubuntu.com/*
// @match           https://stackapps.com/*
// @match           https://mathoverflow.net/*
// @match           https://pt.stackoverflow.com/*
// @match           https://ja.stackoverflow.com/*
// @match           https://ru.stackoverflow.com/*
// @match           https://es.stackoverflow.com/*
// @match           https://meta.stackoverflow.com/*
// @match           https://meta.serverfault.com/*
// @match           https://meta.superuser.com/*
// @match           https://meta.askubuntu.com/*
// @match           https://meta.mathoverflow.net/*
// @match           https://pt.meta.stackoverflow.com/*
// @match           https://ja.meta.stackoverflow.com/*
// @match           https://ru.meta.stackoverflow.com/*
// @match           https://es.meta.stackoverflow.com/*
// @match           https://stackoverflowteams.com/c/*
// @namespace       https://github.com/PurpleMagick/
// @run-at          document-end
// @version         1.0.0
// ==/UserScript==
(() => {
	const taglistSelector = "#question .post-taglist";
	const tagsContainer = document.querySelector(taglistSelector);
	if (!tagsContainer)
		return;

	const inlineTagEditorSelector = "#edit-tags-form input#tageditor-replacing-tagnames--input";



	/* focus when opening tag editor */

	const findAndFocusInlineTagEditor = mutationList => {
		for (const mutation of mutationList) {
			if (mutation.type !== "childList")
				continue;

			if (mutation.addedNodes.length === 0)
				continue;

			const inlineTagEditor = mutation.target.querySelector(inlineTagEditorSelector);
			inlineTagEditor?.focus();
		}
	};

	const inlineEditObserver = new MutationObserver(findAndFocusInlineTagEditor);

	inlineEditObserver.observe(tagsContainer, {
		childList: true,
		subtree: true
	});



	/* cancel with Escape */

	const escapeToCancel = function(event) {
		if(event.target.matches(inlineTagEditorSelector)){
			if (event.isComposing)
				return; //discard
			if (event.code !== "Escape")
				return; //discard

			const cancelButton = event.currentTarget.querySelector("#edit-tags-cancel")
			if (!cancelButton) {
				console.warn(`Cancel button not found in parent element`, event.currentTarget);
				return;
			}
			cancelButton.click();
		}
	};
	
	tagsContainer.addEventListener("keyup", escapeToCancel);
})();
