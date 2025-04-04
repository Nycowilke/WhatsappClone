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

// Contacts functionality
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Generate random time for messages
function getRandomTime() {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
}

// Initialize contacts page
if (window.location.pathname.includes('contacts.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Load contacts
        renderContacts();

        // Add contact modal
        document.getElementById('addContactBtn').addEventListener('click', function() {
            document.getElementById('addContactModal').classList.remove('hidden');
        });

        document.getElementById('cancelAddContact').addEventListener('click', function() {
            document.getElementById('addContactModal').classList.add('hidden');
        });

        document.getElementById('saveContact').addEventListener('click', function() {
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            let photo = document.getElementById('contactPhoto').value.trim();
            
            if (!name || !phone) {
            alert('Por favor ingresa nombre y número de teléfono');
                return;
            }

            if (!photo) {
                photo = `https://images.pexels.com/photos/${Math.floor(Math.random()*1000)+1}/pexels-photo-${Math.floor(Math.random()*1000)+1}.jpeg`;
            }

            const newContact = {
                id: Date.now(),
                name,
                phone,
                photo,
                lastSeen: 'Just now',
                status: 'online'
            };

            contacts.push(newContact);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            document.getElementById('addContactModal').classList.add('hidden');
            renderContacts();
        });

        // Edit profile modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('edit-profile-btn')) {
                const contactId = e.target.getAttribute('data-id');
                const contact = contacts.find(c => c.id == contactId);
                if (contact) {
                    document.getElementById('currentProfileImg').src = contact.photo;
                    document.getElementById('editProfileModal').classList.remove('hidden');
                    document.getElementById('editProfileModal').setAttribute('data-contact-id', contactId);
                }
            }
        });

        document.getElementById('cancelEditProfile').addEventListener('click', function() {
            document.getElementById('editProfileModal').classList.add('hidden');
        });

        document.getElementById('saveProfile').addEventListener('click', function() {
            const contactId = document.getElementById('editProfileModal').getAttribute('data-contact-id');
            const newPhoto = document.getElementById('newProfilePhoto').value.trim();
            
            if (!newPhoto) {
                alert('Please enter a photo URL');
                return;
            }

            const contact = contacts.find(c => c.id == contactId);
            if (contact) {
                contact.photo = newPhoto;
                localStorage.setItem('contacts', JSON.stringify(contacts));
                document.getElementById('editProfileModal').classList.add('hidden');
                renderContacts();
            }
        });
    });
}

function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';

    if (contacts.length === 0) {
        contactsList.innerHTML = '<p class="text-center py-4 text-gray-500">No contacts yet</p>';
        return;
    }

    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item p-3 bg-white rounded-lg flex items-center cursor-pointer';
        contactItem.innerHTML = `
            <img src="${contact.photo}" class="w-12 h-12 rounded-full object-cover mr-3">
            <div class="flex-1">
                <div class="font-medium">${contact.name}</div>
                <div class="text-sm text-gray-500">${contact.phone}</div>
            </div>
            <div class="flex space-x-2">
                <button class="voice-call-btn w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="video-call-btn w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <i class="fas fa-video"></i>
                </button>
                <button class="edit-profile-btn w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center" data-id="${contact.id}">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
        `;
        contactsList.appendChild(contactItem);
    });
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
        const sendBtn = document.getElementById('sendMessageBtn');
        const recordBtn = document.getElementById('recordVoiceBtn');
        let mediaRecorder;
        let audioChunks = [];
        let recordingInterval;
        let recordingSeconds = 0;
        let messages = JSON.parse(localStorage.getItem('messages')) || [];

        // Text message sending
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && inputField.value.trim()) {
                sendMessage(inputField.value.trim(), 'text');
                inputField.value = '';
            }
        });

        sendBtn.addEventListener('click', function() {
            if (inputField.value.trim()) {
                sendMessage(inputField.value.trim(), 'text');
                inputField.value = '';
            }
        });

        // Voice message recording
        recordBtn.addEventListener('click', function() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                document.getElementById('voiceRecorder').classList.remove('hidden');
                startRecording();
            } else {
                alert('Audio recording not supported in your browser');
            }
        });

        document.getElementById('cancelRecording').addEventListener('click', function() {
            stopRecording();
            document.getElementById('voiceRecorder').classList.add('hidden');
        });

        document.getElementById('stopRecording').addEventListener('click', function() {
            stopRecording();
            document.getElementById('voiceRecorder').classList.add('hidden');
            if (audioChunks.length > 0) {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                sendMessage(audioUrl, 'voice');
            }
        });

        function startRecording() {
            audioChunks = [];
            recordingSeconds = 0;
            updateRecordingTime();
            recordingInterval = setInterval(updateRecordingTime, 1000);
            
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    
                    mediaRecorder.ondataavailable = function(e) {
                        audioChunks.push(e.data);
                    };
                    
                    mediaRecorder.onstop = function() {
                        stream.getTracks().forEach(track => track.stop());
                    };
                });
        }

        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            clearInterval(recordingInterval);
        }

        function updateRecordingTime() {
            recordingSeconds++;
            const minutes = Math.floor(recordingSeconds / 60);
            const seconds = recordingSeconds % 60;
            document.getElementById('recordingTime').textContent = 
                `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }

        // Voice call functionality
        document.querySelectorAll('.voice-call-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const contactId = this.getAttribute('data-contact-id');
                const contact = contacts.find(c => c.id == contactId);
                if (contact) {
                    document.getElementById('callerPhoto').src = contact.photo;
                    document.getElementById('callerName').textContent = contact.name;
                    document.getElementById('voiceCallModal').classList.remove('hidden');
                }
            });
        });

        document.getElementById('endCallBtn').addEventListener('click', function() {
            document.getElementById('voiceCallModal').classList.add('hidden');
        });

        function sendMessage(content, type) {
            const messagesContainer = document.querySelector('.chat-container');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'mb-4 flex justify-end';
            
            if (type === 'text') {
                messageDiv.innerHTML = `
                    <div class="message-sent px-4 py-2 shadow max-w-xs">
                        <div>${content}</div>
                        <div class="text-right mt-1">
                            <span class="text-xs text-gray-500">${getRandomTime()}</span>
                            <i class="fas fa-check-double text-blue-500 ml-1"></i>
                        </div>
                    </div>
                `;
            } else if (type === 'voice') {
                messageDiv.innerHTML = `
                    <div class="message-sent px-4 py-2 shadow max-w-xs">
                        <audio controls class="w-full">
                            <source src="${content}" type="audio/mp3">
                        </audio>
                        <div class="text-right mt-1">
                            <span class="text-xs text-gray-500">${getRandomTime()}</span>
                            <i class="fas fa-check-double text-blue-500 ml-1"></i>
                        </div>
                    </div>
                `;
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Save message to storage
            messages.push({
                type,
                content,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    });
}
