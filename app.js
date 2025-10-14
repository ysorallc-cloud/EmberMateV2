        let selectedSeverity = null;
        let undoStack = [];
        let bpChart = null;
        let glucoseChart = null;

        // HIPAA Disclaimer Management
        function dismissHipaaDisclaimer() {
            const disclaimer = document.getElementById('hipaaDisclaimer');
            disclaimer.classList.add('hidden');
            document.body.classList.add('disclaimer-dismissed');
            localStorage.setItem('hipaaDisclaimerDismissed', 'true');
        }

        function checkHipaaDisclaimer() {
            const dismissed = localStorage.getItem('hipaaDisclaimerDismissed');
            if (dismissed === 'true') {
                const disclaimer = document.getElementById('hipaaDisclaimer');
                if (disclaimer) {
                    disclaimer.classList.add('hidden');
                    document.body.classList.add('disclaimer-dismissed');
                }
            }
        }

        // Inspirational Quotes System
        const inspirationalQuotes = [
            "Your health is an investment, not an expense.",
            "Take care of your body. It's the only place you have to live.",
            "The greatest wealth is health.",
            "Small steps every day lead to big changes.",
            "Health is not just about what you're eating. It's also about what you're thinking and saying.",
            "Self-care is not selfish. You cannot serve from an empty vessel.",
            "Your body hears everything your mind says. Stay positive.",
            "The groundwork for all happiness is good health.",
            "Healing is a matter of time, but it is sometimes also a matter of opportunity.",
            "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear."
        ];

        function setDailyQuote() {
            const today = new Date().toDateString();
            let savedQuote = localStorage.getItem('dailyQuote');
            let savedDate = localStorage.getItem('quoteDate');
            
            if (savedDate !== today) {
                const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
                savedQuote = inspirationalQuotes[randomIndex];
                localStorage.setItem('dailyQuote', savedQuote);
                localStorage.setItem('quoteDate', today);
            }
            
            document.getElementById('dailyQuote').textContent = `"${savedQuote}"`;
        }

        // Navigation
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
            }
        }

        function navigateTo(page) {
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const targetItem = Array.from(document.querySelectorAll('.sidebar-item')).find(item => {
                const onclick = item.getAttribute('onclick');
                return onclick && onclick.includes(`'${page}'`);
            });
            
            if (targetItem) {
                targetItem.classList.add('active');
            }
            
            document.querySelectorAll('.page-container').forEach(container => {
                container.classList.remove('active');
            });
            
            const pageElement = document.getElementById(`page-${page}`);
            if (pageElement) {
                pageElement.classList.add('active');
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        }

        // Inline Editing
        function makeEditable(cell) {
            if (cell.classList.contains('editing')) return;
            
            const originalValue = cell.textContent;
            cell.classList.add('editing');
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = originalValue;
            cell.textContent = '';
            cell.appendChild(input);
            input.focus();
            
            function finishEdit() {
                const newValue = input.value || originalValue;
                cell.textContent = newValue;
                cell.classList.remove('editing');
                
                if (newValue !== originalValue) {
                    showToast('✓ Value updated successfully');
                }
            }
            
            input.addEventListener('blur', finishEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    finishEdit();
                }
            });
        }

        // Medication Status Toggle with Undo
        function toggleMedStatus(badge, medId, medName) {
            const currentStatus = badge.querySelector('span:last-child').textContent;
            
            undoStack.push({
                element: badge,
                previousHTML: badge.innerHTML,
                medId: medId,
                medName: medName,
                previousStatus: currentStatus
            });
            
            let newStatus, newClass, newDot;
            
            if (currentStatus === 'Taken') {
                newStatus = 'Pending';
                newClass = 'navy';
                newDot = 'navy';
            } else if (currentStatus === 'Pending') {
                newStatus = 'Missed';
                newClass = 'red';
                newDot = 'red';
            } else if (currentStatus === 'Missed') {
                newStatus = 'Taken';
                newClass = 'green';
                newDot = 'green';
            } else if (currentStatus === 'Due Soon') {
                newStatus = 'Taken';
                newClass = 'green';
                newDot = 'green';
            }
            
            badge.className = `status-badge ${newClass}`;
            badge.innerHTML = `
                <span class="status-dot ${newDot}"></span>
                ${newStatus}
            `;
            
            badge.onclick = function() { toggleMedStatus(this, medId, medName); };
            
            showUndoToast(`${medName} marked as ${newStatus}`);
            
            console.log(`Medication ${medName} (ID: ${medId}) status changed to: ${newStatus}`);
        }

        function showUndoToast(message) {
            const toast = document.getElementById('undoToast');
            document.getElementById('undoMessage').textContent = message;
            toast.classList.add('active');
            
            setTimeout(() => {
                toast.classList.remove('active');
                if (undoStack.length > 0) {
                    undoStack.pop();
                }
            }, 5000);
        }

        function undoStatusChange() {
            if (undoStack.length === 0) return;
            
            const lastChange = undoStack.pop();
            const badge = lastChange.element;
            
            badge.innerHTML = lastChange.previousHTML;
            
            badge.onclick = function() { 
                toggleMedStatus(this, lastChange.medId, lastChange.medName); 
            };
            
            document.getElementById('undoToast').classList.remove('active');
            showToast('✓ Change undone');
            
            console.log(`Undone: ${lastChange.medName} restored to ${lastChange.previousStatus}`);
        }

        // Toast Notifications
        function showToast(message) {
            const existingToasts = document.querySelectorAll('.toast-notification');
            existingToasts.forEach(toast => toast.remove());
            
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 3000);
        }

        // Alert System
        function showAlerts() {
            const banner = document.getElementById('bpAlertBanner');
            banner.classList.add('active');
            navigateTo('vitals');
            showToast('Viewing active health alerts');
        }

        function dismissAlert() {
            const banner = document.getElementById('bpAlertBanner');
            const badge = document.getElementById('alertBadge');
            banner.classList.remove('active');
            badge.style.display = 'none';
            showToast('Alert dismissed');
        }

        // Modal Functions
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function openSideEffectModal(medName) {
            document.getElementById('sideEffectMedName').textContent = medName;
            document.getElementById('sideEffectModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeSideEffectModal() {
            document.getElementById('sideEffectModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            selectedSeverity = null;
            document.querySelectorAll('.severity-option').forEach(opt => {
                opt.classList.remove('selected');
            });
        }

        function selectSeverity(severity, event) {
            event.preventDefault();
            selectedSeverity = severity;
            document.querySelectorAll('.severity-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            event.target.classList.add('selected');
        }

        function submitSideEffect(event) {
            event.preventDefault();
            if (!selectedSeverity) {
                showToast('Please select a severity level');
                return;
            }
            closeSideEffectModal();
            showToast('✓ Side effect report submitted successfully');
        }

        function openBPModal() {
            document.getElementById('bpModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeBPModal() {
            document.getElementById('bpModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function submitBP(event) {
            event.preventDefault();
            closeBPModal();
            
            const systolic = parseInt(event.target.elements[0].value);
            const diastolic = parseInt(event.target.elements[1].value);
            
            if (systolic > 140 || diastolic > 90) {
                document.getElementById('bpAlertBanner').classList.add('active');
                document.getElementById('alertBadge').style.display = 'block';
                showToast('⚠️ Blood pressure reading saved - Alert triggered!');
            } else {
                showToast('✓ Blood pressure reading saved successfully');
            }
        }

        function openGlucoseModal() {
            document.getElementById('glucoseModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeGlucoseModal() {
            document.getElementById('glucoseModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function submitGlucose(event) {
            event.preventDefault();
            closeGlucoseModal();
            showToast('✓ Blood glucose reading saved successfully');
        }

        function openHelpModal() {
            document.getElementById('helpModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeHelpModal() {
            document.getElementById('helpModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function openLogMedicationModal() {
            const now = new Date();
            const timeString = now.toTimeString().slice(0, 5);
            document.getElementById('medTime').value = timeString;
            openModal('logMedicationModal');
        }

        function openRecordVitalsModal() {
            openModal('recordVitalsModal');
        }

        function openJournalModal() {
            openModal('journalModal');
        }

        function openAddMedicationModal() {
            openModal('addMedicationModal');
        }

        function openAddAppointmentModal() {
            openModal('addAppointmentModal');
        }

        function openAddProviderModal() {
            openModal('addProviderModal');
        }

        function openUploadRecordModal() {
            openModal('uploadRecordModal');
        }

        function openEditProfileModal() {
            openModal('editProfileModal');
        }

        function openNotificationsModal() {
            openModal('notificationsModal');
        }

        function openAddReminderModal() {
            openModal('addReminderModal');
        }

        function clearAllNotifications() {
            const activityList = document.querySelector('#notificationsModal .activity-list');
            activityList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);"><p>No notifications</p></div>';
            showToast('All notifications cleared!');
        }

        function updateScheduleFields() {
            const frequency = document.getElementById('reminderFrequency').value;
            
            document.getElementById('onceTimeGroup').style.display = 'none';
            document.getElementById('dailyTimeGroup').style.display = 'none';
            document.getElementById('weeklyGroup').style.display = 'none';
            document.getElementById('customIntervalGroup').style.display = 'none';
            
            switch(frequency) {
                case 'once':
                    document.getElementById('onceTimeGroup').style.display = 'block';
                    break;
                case 'daily':
                    document.getElementById('dailyTimeGroup').style.display = 'block';
                    break;
                case 'weekly':
                    document.getElementById('weeklyGroup').style.display = 'block';
                    break;
                case 'custom':
                    document.getElementById('customIntervalGroup').style.display = 'block';
                    break;
            }
        }

        function submitLogMedication(event) {
            event.preventDefault();
            const medName = document.getElementById('medName').value;
            const medTime = document.getElementById('medTime').value;
            
            const activityList = document.getElementById('recentActivityList');
            const newActivity = document.createElement('div');
            newActivity.className = 'activity-item';
            newActivity.innerHTML = `
                <div class="activity-icon" style="background: linear-gradient(135deg, rgba(45, 155, 155, 0.15), rgba(45, 155, 155, 0.25));">💊</div>
                <div class="activity-content">
                    <div class="activity-title">${medName} taken</div>
                    <div class="activity-meta">Today at ${medTime}</div>
                </div>
            `;
            activityList.insertBefore(newActivity, activityList.firstChild);
            
            closeModal('logMedicationModal');
            showToast(`${medName} logged successfully!`);
            document.getElementById('logMedicationForm').reset();
        }

        function submitVitals(event) {
            event.preventDefault();
            closeModal('recordVitalsModal');
            showToast('Vitals recorded successfully!');
            document.getElementById('recordVitalsForm').reset();
        }

        function submitJournal(event) {
            event.preventDefault();
            const title = document.getElementById('journalTitle').value;
            
            const careStreak = parseInt(document.getElementById('careStreak').textContent);
            document.getElementById('careStreak').textContent = careStreak + 1;
            
            closeModal('journalModal');
            showToast('Journal entry saved!');
            document.getElementById('journalForm').reset();
        }

        function submitAddMedication(event) {
            event.preventDefault();
            const name = document.getElementById('newMedName').value;
            
            closeModal('addMedicationModal');
            showToast(`${name} added successfully!`);
            document.getElementById('addMedicationForm').reset();
        }

        function submitAddAppointment(event) {
            event.preventDefault();
            
            closeModal('addAppointmentModal');
            showToast('Appointment scheduled!');
            document.getElementById('addAppointmentForm').reset();
        }

        function submitAddProvider(event) {
            event.preventDefault();
            const name = document.getElementById('providerName').value;
            
            closeModal('addProviderModal');
            showToast(`${name} added to your care team!`);
            document.getElementById('addProviderForm').reset();
        }

        function submitUploadRecord(event) {
            event.preventDefault();
            
            closeModal('uploadRecordModal');
            showToast('Lab result uploaded!');
            document.getElementById('uploadRecordForm').reset();
        }

        function submitEditProfile(event) {
            if (event) event.preventDefault();
            
            const name = document.getElementById('editName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            
            if (!name || !email) {
                showToast('Please fill in all fields');
                return false;
            }
            
            document.getElementById('profileName').textContent = name;
            document.getElementById('profileEmail').textContent = email;
            
            const firstName = name.split(' ')[0];
            const hour = new Date().getHours();
            let greeting = 'Good Evening';
            if (hour < 12) greeting = 'Good Morning';
            else if (hour < 18) greeting = 'Good Afternoon';
            
            document.getElementById('heroGreeting').textContent = `${greeting}, ${firstName}`;
            
            const nameParts = name.split(' ').filter(part => part.length > 0);
            const initials = nameParts.map(word => word[0]).join('').toUpperCase().substring(0, 2);
            document.querySelector('.user-avatar').textContent = initials;
            
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            
            closeModal('editProfileModal');
            showToast('✅ Profile updated successfully!');
            
            return false;
        }

        function submitAddReminder(event) {
            event.preventDefault();
            const title = document.getElementById('reminderTitle').value;
            
            const activeCount = parseInt(document.getElementById('activeRemindersCount').textContent);
            document.getElementById('activeRemindersCount').textContent = activeCount + 1;
            
            closeModal('addReminderModal');
            showToast(`Reminder "${title}" created successfully!`);
            document.getElementById('addReminderForm').reset();
        }

        // Search functionality
        function performSearch() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
            
            if (!searchTerm) {
                clearSearchHighlights();
                return;
            }
            
            let foundResults = false;
            
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.backgroundColor = 'rgba(255, 179, 71, 0.2)';
                    foundResults = true;
                } else {
                    item.style.backgroundColor = '';
                }
            });
            
            const allTables = document.querySelectorAll('table tbody tr');
            allTables.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.backgroundColor = 'rgba(255, 179, 71, 0.15)';
                    row.style.border = '2px solid var(--accent-peach)';
                    foundResults = true;
                } else {
                    row.style.backgroundColor = '';
                    row.style.border = '';
                }
            });
            
            if (!foundResults) {
                showToast(`No results found for "${searchTerm}"`);
            }
        }
        
        function clearSearchHighlights() {
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.style.backgroundColor = '';
            });
            
            document.querySelectorAll('table tbody tr').forEach(row => {
                row.style.backgroundColor = '';
                row.style.border = '';
            });
        }

        // Guide Step Demonstrations
        function demonstrateStatusUpdate() {
            showToast('💡 Try it: Click any colored status badge in the table below to update medication status');
        }

        function demonstrateSideEffects() {
            showToast('💡 Opening side effect reporting form...');
            setTimeout(() => {
                openSideEffectModal('Lisinopril');
            }, 800);
        }

        function demonstrateProgress() {
            showToast('💡 View your daily progress in the Analytics section');
            setTimeout(() => {
                navigateTo('analytics');
            }, 1500);
        }

        function demonstrateLogReading() {
            showToast('💡 Opening blood pressure logging form...');
            setTimeout(() => {
                openBPModal();
            }, 800);
        }

        function demonstrateInlineEdit() {
            showToast('💡 Try it: Double-click any reading in the table to edit inline');
        }

        function demonstrateTrends() {
            showToast('💡 View your vitals trends in the Analytics dashboard');
            setTimeout(() => {
                navigateTo('analytics');
            }, 1500);
        }

        function demonstrateSchedule() {
            showToast('💡 Click "Schedule Appointment" to book a new visit');
        }

        function demonstrateTransportation() {
            showToast('💡 Try it: Click transportation badges in the table to update arrangements');
        }

        function demonstrateReminders() {
            showToast('💡 Reminders: Set up notifications for upcoming appointments (Feature coming soon)');
        }

        function demonstrateAggregation() {
            showToast('💡 All your health data is automatically collected and analyzed');
        }

        function demonstrateAnalysis() {
            showToast('💡 View detailed trend analysis in the charts below');
        }

        function demonstrateExport() {
            showToast('💡 Scroll down to see export options');
        }

        // Chart Initialization
        function initializeCharts() {
            const bpCtx = document.getElementById('bpChart');
            if (bpCtx) {
                bpChart = new Chart(bpCtx, {
                    type: 'line',
                    data: {
                        labels: ['Oct 1', 'Oct 5', 'Oct 8', 'Oct 12', 'Oct 15', 'Oct 18', 'Oct 22', 'Oct 25', 'Oct 28', 'Oct 30'],
                        datasets: [{
                            label: 'Systolic',
                            data: [138, 135, 142, 136, 132, 128, 131, 127, 129, 128],
                            borderColor: '#EF4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#EF4444',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }, {
                            label: 'Diastolic',
                            data: [88, 86, 90, 87, 84, 82, 83, 81, 82, 82],
                            borderColor: '#2D9B9B',
                            backgroundColor: 'rgba(45, 155, 155, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#2D9B9B',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 70,
                                max: 150
                            }
                        }
                    }
                });
            }

            const glucoseCtx = document.getElementById('glucoseChart');
            if (glucoseCtx) {
                glucoseChart = new Chart(glucoseCtx, {
                    type: 'line',
                    data: {
                        labels: ['Oct 1', 'Oct 3', 'Oct 6', 'Oct 9', 'Oct 12', 'Oct 15', 'Oct 18', 'Oct 21', 'Oct 24', 'Oct 27', 'Oct 30'],
                        datasets: [{
                            label: 'Blood Glucose',
                            data: [125, 118, 132, 115, 128, 122, 165, 119, 112, 118, 115],
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#F59E0B',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 80,
                                max: 180
                            }
                        }
                    }
                });
            }
        }

        function updateChartRange(range) {
            document.querySelectorAll('.chart-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            showToast(`Updated to ${range} view`);
        }

        function updateGlucoseRange(range) {
            const buttons = event.target.parentElement.querySelectorAll('.chart-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            showToast(`Updated to ${range} view`);
        }

        // Initialize profile from localStorage
        function initializeProfile() {
            const savedName = localStorage.getItem('userName') || 'User Name';
            const savedEmail = localStorage.getItem('userEmail') || 'jane.smith@email.com';
            
            document.getElementById('profileName').textContent = savedName;
            document.getElementById('profileEmail').textContent = savedEmail;
            document.getElementById('editName').value = savedName;
            document.getElementById('editEmail').value = savedEmail;
            
            const firstName = savedName.split(' ')[0];
            const hour = new Date().getHours();
            let greeting = 'Good Evening';
            if (hour < 12) greeting = 'Good Morning';
            else if (hour < 18) greeting = 'Good Afternoon';
            
            document.getElementById('heroGreeting').textContent = `${greeting}, ${firstName}`;
            
            const initials = savedName.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
            document.querySelector('.user-avatar').textContent = initials;
        }

        // Close modals when clicking outside
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal-overlay')) {
                closeSideEffectModal();
                closeBPModal();
                closeGlucoseModal();
                closeHelpModal();
                closeModal('logMedicationModal');
                closeModal('recordVitalsModal');
                closeModal('journalModal');
                closeModal('addMedicationModal');
                closeModal('addAppointmentModal');
                closeModal('addProviderModal');
                closeModal('uploadRecordModal');
                closeModal('editProfileModal');
                closeModal('notificationsModal');
                closeModal('addReminderModal');
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = 'auto';
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            checkHipaaDisclaimer();
            
            showToast('✓ Welcome to EmberMate! You have 1 active health alert.');
            document.getElementById('alertBadge').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('bpAlertBanner').classList.add('active');
            }, 2000);

            initializeCharts();
            setDailyQuote();
            initializeProfile();
        });

        console.log('EmberMate - Integrated Health Management Loaded');
