document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const phoneNumber = document.getElementById('phone').value.trim();
    
    if (!phoneNumber) {
        alert('Please enter your phone number');
        return;
    }
    
    // Store phone number in localStorage for demo purposes
    localStorage.setItem('currentUser', phoneNumber);
    
    // Redirect to chat list page
    window.location.href = 'chat-list.html';
});

// Generate random avatar URL from Pexels
function getRandomAvatar() {
    const avatars = [
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
        'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// Generate random time for messages
function getRandomTime() {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
}

// Chat list functionality
document.addEventListener('DOMContentLoaded', function() {
    // Make chat items clickable
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            if (item.classList.contains('group-chat')) {
                window.location.href = 'group-chat.html';
            } else {
                window.location.href = 'chat.html';
            }
        });
    });

    // New chat button functionality
    const newChatBtn = document.querySelector('.fixed.bottom-6.right-6');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            const choice = confirm('Create new group chat? (Cancel for individual chat)');
            if (choice) {
                window.location.href = 'group-chat.html';
            } else {
                window.location.href = 'chat.html';
            }
        });
    }
});

// Group chat page functionality
if (window.location.pathname.includes('group-chat.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const inputField = document.querySelector('input[type="text"]');
        const sendBtn = document.querySelector('.fa-microphone').parentElement;
        const participantsBtn = document.getElementById('participantsBtn');
        const videoCallBtn = document.querySelector('.video-call-btn');
        const videoModal = document.querySelector('.video-modal');
        const participantGrid = document.querySelector('.participant-grid');
        
        // Initialize PeerJS
        const peer = new Peer({
            host: 'peerjs-server.herokuapp.com',
            secure: true,
            path: '/'
        });

        let localStream;
        const connections = [];

        // Toggle participants panel
        participantsBtn.addEventListener('click', function() {
            document.querySelector('.participants-panel').classList.toggle('hidden');
        });

        // Message sending
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && inputField.value.trim()) {
                sendGroupMessage(inputField.value.trim());
                inputField.value = '';
            }
        });

        sendBtn.addEventListener('click', function() {
            if (inputField.value.trim()) {
                sendGroupMessage(inputField.value.trim());
                inputField.value = '';
            }
        });

        // Video call functionality
        videoCallBtn.addEventListener('click', async function() {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                videoModal.classList.remove('hidden');
                addVideoTile(localStream, 'You', true);
                
                // Generate unique room ID
                const roomId = prompt('Enter room ID for others to join:', 
                    `group-${Math.random().toString(36).substr(2, 5)}`);
                
                if (roomId) {
                    // In a real app, you would send this roomId to other participants via chat
                    console.log('Share this room ID to join:', roomId);
                }
            } catch (err) {
                console.error('Failed to get media devices:', err);
                alert('Could not access camera/microphone. Please check permissions.');
            }
        });

        // Add video tile to grid
        function addVideoTile(stream, name, isLocal = false) {
            const tile = document.createElement('div');
            tile.className = 'video-tile relative bg-black rounded-lg overflow-hidden';
            
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true;
            if (isLocal) video.muted = true;
            
            const label = document.createElement('div');
            label.className = 'absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm';
            label.textContent = name;
            
            tile.appendChild(video);
            tile.appendChild(label);
            participantGrid.appendChild(tile);
            
            return video;
        }

        // End call handler
        document.querySelector('.end-call').addEventListener('click', function() {
            videoModal.classList.add('hidden');
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            participantGrid.innerHTML = '';
            connections.forEach(conn => conn.close());
            connections.length = 0;
        });

        // Toggle camera/mic
        document.querySelector('.toggle-camera').addEventListener('click', function() {
            if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                videoTrack.enabled = !videoTrack.enabled;
                this.querySelector('i').classList.toggle('text-red-500');
            }
        });

        document.querySelector('.toggle-mic').addEventListener('click', function() {
            if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                audioTrack.enabled = !audioTrack.enabled;
                this.querySelector('i').classList.toggle('text-red-500');
            }
        });

        function sendGroupMessage(text) {
            const messagesContainer = document.querySelector('.flex-1.p-4');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'mb-4 flex justify-end';
            messageDiv.innerHTML = `
                <div class="bg-blue-100 rounded-lg px-4 py-2 max-w-xs">
                    <div>${text}</div>
                    <div class="text-right mt-1 text-xs text-gray-500">
                        ${getRandomTime()} <i class="fas fa-check-double text-blue-500 ml-1"></i>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
}

// Chat page functionality
if (window.location.pathname.includes('chat.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const inputField = document.querySelector('input[type="text"]');
        const sendBtn = document.querySelector('.fa-microphone').parentElement;

        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && inputField.value.trim()) {
                sendMessage(inputField.value.trim());
                inputField.value = '';
            }
        });

        sendBtn.addEventListener('click', function() {
            if (inputField.value.trim()) {
                sendMessage(inputField.value.trim());
                inputField.value = '';
            }
        });

        function sendMessage(text) {
            const messagesContainer = document.querySelector('.chat-container');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'flex justify-end mb-4';
            messageDiv.innerHTML = `
                <div class="message-sent px-4 py-2 shadow max-w-xs">
                    <div>${text}</div>
                    <div class="text-right mt-1">
                        <span class="text-xs text-gray-500">${getRandomTime()}</span>
                        <i class="fas fa-check-double text-blue-500 ml-1"></i>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
}
