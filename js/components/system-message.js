// js/components/system-message.js

class SystemMessage {
    constructor(elementId = "system-message") {
      this.element = document.getElementById(elementId);
      this.timer = null;
    }
  
    show(message, type = "success") {
      this.clearTimer();
      this.element.textContent = message;
      this.element.className = `message-${type}`;
      this.element.style.display = "block";
      this.timer = setTimeout(() => this.hide(), 3000);
    }
  
    hide() {
      this.element.style.display = "none";
      this.element.textContent = "";
      this.clearTimer();
    }
  
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }
  
  const systemMessage = new SystemMessage();
  
  export { systemMessage };