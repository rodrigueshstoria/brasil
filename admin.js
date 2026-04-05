.admin-panel {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.admin-section {
    background-color: #f9f9f9;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 20px;
}

.admin-section h2 {
    margin-top: 0;
    color: #009c3b;
    border-bottom: 2px solid #009c3b;
    padding-bottom: 10px;
}

.stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
}

.stat-box {
    background-color: white;
    border: 2px solid #009c3b;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #009c3b;
}

.data-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: white;
}

.data-item {
    padding: 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.3s;
}

.data-item:hover {
    background-color: #f0f0f0;
}

.data-item:last-child {
    border-bottom: none;
}

.item-header {
    font-weight: bold;
    color: #009c3b;
    margin-bottom: 5px;
}

.item-details {
    font-size: 0.85rem;
    color: #666;
}

.item-answers {
    display: none;
    margin-top: 10px;
    padding: 10px;
    background-color: #f5f5f5;
    border-left: 3px solid #009c3b;
    font-size: 0.8rem;
}

.item-answers.visible {
    display: block;
}

.data-item.expanded {
    background-color: #f5f5f5;
}

.admin-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.admin-options label {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    cursor: pointer;
}

.admin-options input[type="checkbox"] {
    margin-right: 10px;
    accent-color: #009c3b;
}

.status-text {
    margin: 0;
    padding: 10px;
    background-color: white;
    border-left: 3px solid #ff6b6b;
    color: #ff6b6b;
    font-weight: bold;
}

.status-text.public {
    border-left-color: #009c3b;
    color: #009c3b;
    background-color: #e8f5e8;
}

.secondary-btn {
    background-color: #6c757d;
}

.secondary-btn:hover {
    background-color: #5a6268;
}

.danger-btn {
    background-color: #dc3545;
}

.danger-btn:hover {
    background-color: #c82333;
}

button {
    margin: 0;
}

@media (max-width: 768px) {
    .stats {
        grid-template-columns: 1fr;
    }

    .data-list {
        max-height: 300px;
    }
}

.empty-message {
    padding: 20px;
    text-align: center;
    color: #999;
    font-style: italic;
}
