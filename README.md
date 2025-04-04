
Built by https://www.blackbox.ai

---

```markdown
# WhatsApp Clone

## Project Overview

WhatsApp Clone is a web-based application that mimics the functionality of WhatsApp, allowing users to log in using their phone numbers, initiate chats, and participate in group discussions. The project showcases the use of modern web technologies and aims to provide a user-friendly interface along with some features typical of messaging applications.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/whatsapp-clone.git
   cd whatsapp-clone
   ```

2. **Open the project in your preferred web server or directly in your browser:**
   - You can use a simple HTTP server for local testing, for example:
     - Using Python:
       ```bash
       python -m http.server 8000
       ```
     - Or use any local development server of your choice.

3. **Access the application:**
   Open your browser and go to `http://localhost:8000` or the respective port you are using.

## Usage

1. **Login:**
   Enter your phone number in the login form on the `index.html` page and click "Next". For demo purposes, the phone number is saved in `localStorage`.

2. **Chat List:**
   After logging in, you will be redirected to the chat list where you can view active chats.

3. **Individual and Group Chats:**
   Click on any contact or group to begin chatting. You can also create a new group chat.

4. **Send Messages:**
   Enter your message in the input box at the bottom of the chat screen and press Enter or click the microphone button to send.

5. **Group Features:**
   In group chats, you can toggle a participants panel, initiate a video call, and messages can be sent in the same way.

## Features

- User login via phone number.
- Individual chat messaging.
- Group chat capabilities.
- User interface styled with Tailwind CSS.
- Responsive design for optimal viewing on various devices.
- Basic video call functionality (Note: PeerJS server is referenced but not fully implemented).

## Dependencies

The project includes the following dependencies:

- **Tailwind CSS**: For modern UI styling.
- **Font Awesome**: For icon usage.
- **PeerJS**: For implementing WebRTC based video calling functionality.

No other external packages are specifically listed in a `package.json` file, but the project relies on CDN links for Tailwind CSS and Font Awesome.

## Project Structure

The project folder is organized as follows:

```
whatsapp-clone/
│
├── index.html          # The login page of the application
├── chat-list.html      # The page displaying the list of chats
├── chat.html           # The individual chat page
├── group-chat.html     # The group chat page
├── script.js           # Main JavaScript file containing the functionality of the application
│
├── styles/             # (optional) Directory for custom styles (if any were to be added)
└── README.md           # Project documentation
```

## License

This project is open-source and available under the MIT License. Feel free to use, modify, and distribute it as needed.
```