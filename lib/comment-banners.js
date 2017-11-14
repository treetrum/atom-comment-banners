'use babel';

import {CompositeDisposable} from 'atom';

export default {

    subscriptions: null,

    activate(state) {

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'comment-banners:create-comment-banner': () => this.createCommentBanner()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {
        return {};
    },

    createCommentBanner() {

        // Get the current active text editor
        let editor = atom.workspace.getActiveTextEditor();

        // Get current buffer row
        let currentRow = editor.getCursorBufferPosition().row;

        // Get line of text at current buffer row
        let lineOfTextAtCursor = editor.lineTextForBufferRow(currentRow);
        let spacesAtStartOfLine = lineOfTextAtCursor.replace(/^(\s*).*$/,"$1");
        let lineOfTextWithoutSpaces = lineOfTextAtCursor.replace(/^\s+(.+)/, "$1");

        // Generate the two lines
        let firstLine = spacesAtStartOfLine + '// ' + lineOfTextWithoutSpaces;
        let secondLine = spacesAtStartOfLine + '// ' + lineOfTextWithoutSpaces.replace(/./gi, "-");
        let completeBanner = firstLine + '\n' + secondLine;

        // Replace the current line with the generated banner
        editor.setTextInBufferRange( [[currentRow, 0], [currentRow, lineOfTextAtCursor.length]], completeBanner );

    }
}