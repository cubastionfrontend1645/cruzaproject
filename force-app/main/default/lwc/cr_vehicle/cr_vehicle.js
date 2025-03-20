import { LightningElement, track } from 'lwc';

export default class RichTextCharacterLimit extends LightningElement {
    @track descValue = ''; // Holds the rich text value
    @track characterCount = 0; // Tracks the current plain text character count
    maxCharacterLimit = 1000; // Set the character limit
    errorMessage = ''; // Error message placeholder

    // Handles input event to monitor character count
    handleRichTextInput(event) {
        const richText = event.target.value;
        const plainText = this.stripHTML(richText);

        if (plainText.length > this.maxCharacterLimit) {
            event.target.value = this.descValue; 
            this.errorMessage = `Character limit of ${this.maxCharacterLimit} exceeded!`;
        } else {
            this.descValue = richText; 
            this.characterCount = plainText.length; 
            this.errorMessage = ''; 
        }
    }

    
    handleRichTextPaste(event) {
        event.preventDefault(); 
        const clipboardText = event.clipboardData.getData('text/plain'); 
        const plainText = this.stripHTML(this.descValue); 
        const newText = plainText + clipboardText;

        if (newText.length <= this.maxCharacterLimit) {
            this.descValue += clipboardText; 
            this.characterCount = newText.length; 
        } else {
            this.errorMessage = `Character limit of ${this.maxCharacterLimit} exceeded!`;
        }
    }

    stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
}
